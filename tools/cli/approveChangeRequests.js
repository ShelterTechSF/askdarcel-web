const fs = require('fs');
const { join } = require('path');
const yaml = require('js-yaml');
const AskDarcelClient = require('./AskDarcelClient');

const config = yaml.safeLoad(fs.readFileSync(join(__dirname, './config.yml'), 'utf8'));
const darcel = new AskDarcelClient(config['api.endpoint']);

function approveChangeRequests() {
  const changeRequestLookup = {};
  const stats = { approved: 0, duplicates: 0, errors: 0 };

  return darcel.signIn(config['admin.username'], config['admin.password'])
    .then(() => darcel.getData('/change_requests'))
    .then(d => {
      const { data } = d;
      const duplicates = {};

      // Do a first pass over all requests to check for duplicates
      data.change_requests.forEach(changeRequest => {
        const { type, object_id, id } = changeRequest;

        if (changeRequestLookup[type] === undefined) {
          changeRequestLookup[type] = {};
        }

        if (changeRequestLookup[type][object_id] === undefined) {
          changeRequestLookup[type][object_id] = { changedIDs: [] };
        }

        // Track field changes for this resource/service
        const changes = changeRequestLookup[type][object_id];

        changeRequest.field_changes.forEach(fieldChange => {
          const { field_name, field_value } = fieldChange;
          changes.changedIDs.push(id);

          // If we have already changed this field,
          // play it safe and don't approve this changeRequest
          if (changes[field_name]) {
            changes.changedIDs.forEach(cid => { duplicates[cid] = true; });
            console.log('There are conflicting changes for', `resource:${changeRequest.resource.id}`, `type:${changeRequest.type}`, `object:${changeRequest.object_id}`, '\n', { field: field_name, old: field_value, new: changes[field_name] }, '\n');
          } else {
            changes[field_name] = field_value;
          }
        });
      });

      return data.change_requests.reduce((action, changeRequest) => action
        .catch(err => {
          console.log(err);
          stats.errors++;
        })
        .then(() => {
          // If this changeRequest was not marked duplicate
          if (!duplicates[changeRequest.id]) {
            stats.approved++;
            const body = {};
            changeRequest.field_changes.forEach(fieldChange => {
              const { field_name, field_value } = fieldChange;
              body[field_name] = field_value;
            });

            return new Promise(resolve => {
              setTimeout(() => {
                resolve(darcel.postData(`/change_requests/${changeRequest.id}/approve`, { change_request: body }));
              }, 10); // Brief timeout because Promise.all with ~500 requests broke the API
            }).then(() => console.log('approved', changeRequest.id));
          }
          console.log('not applying duplicate', changeRequest.id);
          stats.duplicates++;
          return Promise.resolve();
        }), Promise.resolve('first'));
    })
    .then(() => {
      console.log('completed', stats);
      // console.log(JSON.stringify(d));
    })
    .catch(e => {
      console.error(e);
    });
}

approveChangeRequests();
