import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, browserHistory } from 'react-router';
import _ from 'lodash';

import { Loader } from 'components/ui';
import EditAddress from './EditAddress';
import EditServices from './EditServices';
import EditNotes from './EditNotes';
import EditSchedule from './EditSchedule';
import EditPhones from './EditPhones';
import EditSidebar from './EditSidebar';
import * as dataService from '../../utils/DataService';

function getDiffObject(curr, orig) {
  return Object.entries(curr).reduce((acc, [key, value]) => {
    if (!_.isEqual(orig[key], value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function updateCollectionObject(object, id, path, promises) {
  promises.push(
    dataService.post(
      `/api/${path}/${id}/change_requests`,
      { change_request: object },
    ),
  );
}

/**
 * Create a change request for a new object.
 */
function createCollectionObject(object, path, promises, resourceID) {
  promises.push(
    dataService.post(
      '/api/change_requests',
      { change_request: object, type: path, parent_resource_id: resourceID },
    ),
  );
}

function createNewPhoneNumber(item, resourceID, promises) {
  promises.push(
    dataService.post(
      '/api/change_requests',
      {
        change_request: item,
        type: 'phones',
        parent_resource_id: resourceID,
      },
    ),
  );
}

function deletCollectionObject(item, path, promises) {
  if (path === 'phones') {
    promises.push(
      dataService.APIDelete(`/api/phones/${item.id}`),
    );
  }
}

function postCollection(collection, originalCollection, path, promises, resourceID) {
  for (let i = 0; i < collection.length; i += 1) {
    const item = collection[i];
    if (item.isRemoved) {
      deletCollectionObject(item, path, promises);
    } else if (i < originalCollection.length && item.dirty) {
      const diffObj = getDiffObject(item, originalCollection[i]);
      if (!_.isEmpty(diffObj)) {
        delete diffObj.dirty;
        updateCollectionObject(diffObj, item.id, path, promises);
      }
    } else if (item.dirty) {
      delete item.dirty;
      if (path === 'phones') {
        createNewPhoneNumber(item, resourceID, promises);
      } else {
        createCollectionObject(item, path, promises, resourceID);
      }
    }
  }
}

function postSchedule(scheduleObj, promises) {
  if (!scheduleObj) {
    return;
  }
  let currDay = [];
  let value = {};
  Object.keys(scheduleObj).forEach((day) => {
    currDay = scheduleObj[day];
    currDay.forEach((curr) => {
      value = {};
      if (curr.id) {
        if (!curr.openChanged && !curr.closeChanged) {
          return;
        }
        if (curr.openChanged) {
          value.opens_at = curr.opens_at;
        }
        if (curr.closeChanged) {
          value.closes_at = curr.closes_at;
        }

        promises.push(dataService.post(`/api/schedule_days/${curr.id}/change_requests`, { change_request: value }));
      } else {
        value = {
          change_request: {
            day,
          },
          type: 'schedule_days',
          schedule_id: curr.scheduleId,
        };
        if (curr.openChanged) {
          value.change_request.opens_at = curr.opens_at;
        }
        if (curr.closeChanged) {
          value.change_request.closes_at = curr.closes_at;
        }
        if (!curr.openChanged && !curr.closeChanged) {
          return;
        }
        promises.push(dataService.post('/api/change_requests', { ...value }));
      }
    });
  });
}

function postNotes(notesObj, promises, uriObj) {
  if (notesObj && notesObj.notes) {
    const notes = notesObj.notes;
    Object.entries(notes).forEach(([key, currentNote]) => {
      if (key < 0) {
        const uri = `/api/${uriObj.path}/${uriObj.id}/notes`;
        promises.push(dataService.post(uri, { note: currentNote }));
      } else if (currentNote.isRemoved) {
        const uri = `/api/notes/${key}`;
        promises.push(dataService.APIDelete(uri));
      } else {
        const uri = `/api/notes/${key}/change_requests`;
        promises.push(dataService.post(uri, { change_request: currentNote }));
      }
    });
  }
}

function createFullSchedule(scheduleObj) {
  if (scheduleObj) {
    const newSchedule = [];
    let tempDay = {};
    Object.keys(scheduleObj).forEach((day) => {
      scheduleObj[day].forEach((curr) => {
        tempDay = {};
        tempDay.day = day;
        tempDay.opens_at = curr.opens_at;
        tempDay.closes_at = curr.closes_at;
        newSchedule.push(tempDay);
      });
    });

    return { schedule_days: newSchedule };
  }
  return { schedule_days: [] };
}

class EditSections extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scheduleObj: {},
      schedule_days: {},
      resourceFields: {},
      serviceFields: {},
      address: {},
      services: {},
      notes: {},
      phones: [],
      submitting: false,
      newResource: false,
      inputsDirty: false,
    };

    this.certifyHAP = this.certifyHAP.bind(this);
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.keepOnPage = this.keepOnPage.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleResourceFieldChange = this.handleResourceFieldChange.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeactivation = this.handleDeactivation.bind(this);
    this.postServices = this.postServices.bind(this);
    this.postNotes = this.postNotes.bind(this);
    this.postSchedule = this.postSchedule.bind(this);
    this.createResource = this.createResource.bind(this);
    this.prepServicesData = this.prepServicesData.bind(this);
  }

  componentDidMount() {
    const { query, pathname } = this.props.location;
    const splitPath = pathname.split('/');
    window.addEventListener('beforeunload', this.keepOnPage);
    if (splitPath[splitPath.length - 1] === 'new') {
      this.setState({ newResource: true, resource: {}, originalResource: {}, scheduleMap: {} });
    }
    const resourceID = query.resourceid;
    if (resourceID) {
      const url = `/api/resources/${resourceID}`;
      fetch(url).then(r => r.json())
        .then((data) => {
          this.setState({
            resource: data.resource,
            originalResource: data.resource,
          });

          const scheduleMap = {};
          data.resource && data.resource.schedule && data.resource.schedule.schedule_days.forEach((day) => {
            scheduleMap[day.day] = day;
          });
          this.setState({ scheduleMap });
        });
    }
  }

  componentWillMount() {
    this.props.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave,
    );
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.keepOnPage);
  }

  keepOnPage(e) {
    if (this.state.inputsDirty) {
      const message = 'Are you sure you want to leave? Any changes you have made will be lost.';
      e.returnValue = message;
      return message;
    }
  }

  routerWillLeave() {
    if (this.state.inputsDirty && this.state.submitting !== true) {
      return 'Are you sure you want to leave? Any changes you have made will be lost.';
    }
  }
  createResource() {
    const {
      scheduleObj,
      notes,
      phones,
      services,
      resourceFields,
      name,
      long_description,
      short_description,
      website,
      email,
      address,
    } = this.state,
      newResource = {
        name,
        address,
        long_description,
        email,
        website,
        notes: notes.notes ? this.prepNotesData(notes.notes) : [],
        schedule: { schedule_days: schedule },
        phones,
      },
      requestString = '/api/resources',
      schedule = this.prepSchedule(scheduleObj);
    // let newServices = this.prepServicesData(services.services);

    this.setState({ submitting: true });
    dataService.post(requestString, { resources: [newResource] })
      .then((response) => {
        if (response.ok) {
          alert('Resource successfuly created. Thanks!');
          response.json().then(res => browserHistory.push(`/resource?id=${res.resources[0].resource.id}`));
        } else {
          Promise.reject(response);
        }
      })
      .catch((error) => {
        alert('Issue creating resource, please try again.');
        console.log(error);
      });
  }


  hasKeys(object) {
    const size = 0;
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        return true;
      }
      return false;
    }
  }
  prepSchedule(scheduleObj) {
    const newSchedule = [];
    let tempDay = {};
    Object.keys(scheduleObj).forEach((day) => {
      scheduleObj[day].forEach((curr) => {
        tempDay = {};
        tempDay.day = day;
        tempDay.opens_at = curr.opens_at;
        tempDay.closes_at = curr.closes_at;
        newSchedule.push(tempDay);
      });
    });
    return newSchedule;
  }

  handleCancel() {
    browserHistory.goBack();
  }

  handleSubmit() {
    this.setState({ submitting: true });
    const resource = this.state.resource;
    const promises = [];

    // Resource
    const resourceChangeRequest = {};
    let resourceModified = false;
    if (this.state.name && this.state.name !== resource.name) {
      resourceChangeRequest.name = this.state.name;
      resourceModified = true;
    }
    if (this.state.long_description && this.state.long_description !== resource.long_description) {
      resourceChangeRequest.long_description = this.state.long_description;
      resourceModified = true;
    }
    if (this.state.short_description && this.state.short_description !== resource.short_description) {
      resourceChangeRequest.short_description = this.state.short_description;
      resourceModified = true;
    }
    if (this.state.website && this.state.website !== resource.website) {
      resourceChangeRequest.website = this.state.website;
      resourceModified = true;
    }
    if (this.state.name && this.state.name !== resource.name) {
      resourceChangeRequest.name = this.state.name;
      resourceModified = true;
    }
    if (this.state.email && this.state.email !== resource.email) {
      resourceChangeRequest.email = this.state.email;
      resourceModified = true;
    }
    if (this.state.alternate_name && this.state.alternate_name !== resource.alternate_name) {
      resourceChangeRequest.alternate_name = this.state.alternate_name;
      resourceModified = true;
    }
    if (this.state.legal_status && this.state.legal_status !== resource.legal_status) {
      resourceChangeRequest.legal_status = this.state.legal_status;
      resourceModified = true;
    }
    // fire off resource request
    if (resourceModified) {
      promises.push(dataService.post(`/api/resources/${resource.id}/change_requests`, { change_request: resourceChangeRequest }));
    }

    // Fire off phone requests
    postCollection(this.state.phones, this.state.resource.phones, 'phones', promises, this.state.resource.id);

    // schedule
    postSchedule(this.state.scheduleObj, promises);

    // address
    if (this.hasKeys(this.state.address) && this.state.resource.address) {
      promises.push(dataService.post(`/api/addresses/${this.state.resource.address.id}/change_requests`, {
        change_request: this.state.address,
      }));
    }

    // Services
    this.postServices(this.state.services.services, promises);

    // Notes
    this.postNotes(this.state.notes, promises, { path: 'resources', id: this.state.resource.id });

    const that = this;
    Promise.all(promises).then((resp) => {
      that.props.router.push({ pathname: '/resource', query: { id: that.state.resource.id } });
    }).catch((err) => {
      console.log(err);
    });
  }

  handleDeactivation(type, id) {
    if (confirm('Are you sure you want to deactive this resource?') === true) {
      let path = null;
      if (type === 'resource') {
        path = `/api/resources/${id}`;
      } else if (type === 'service') {
        path = `/api/services/${id}`;
      }
      dataService.APIDelete(path, { change_request: { status: '2' } })
        .then(() => {
          alert('Successfully deactivated! \n \nIf this was a mistake, please let someone from the ShelterTech team know.');
          if (type === 'resource') {
            this.props.router.push({ pathname: '/' });
          } else {
            window.location.reload();
          }
        });
    }
  }

  postServices(servicesObj, promises) {
    if (!servicesObj) return;
    const newServices = [];
    Object.entries(servicesObj).forEach(([key, value]) => {
      const currentService = value;
      if (key < 0) {
        if (currentService.notesObj) {
          const notes = Object.values(currentService.notesObj.notes);
          delete currentService.notesObj;
          currentService.notes = notes;
        }

        currentService.schedule = createFullSchedule(currentService.scheduleObj);
        delete currentService.scheduleObj;

        if (!_.isEmpty(currentService)) {
          newServices.push(currentService);
        }
      } else {
        const uri = `/api/services/${key}/change_requests`;
        postNotes(currentService.notesObj, promises, { path: 'services', id: key });
        delete currentService.notesObj;
        postSchedule(currentService.scheduleObj, promises);
        delete currentService.scheduleObj;
        if (!_.isEmpty(currentService)) {
          promises.push(dataService.post(uri, { change_request: currentService }));
        }
      }
    });

    if (newServices.length > 0) {
      const uri = `/api/resources/${this.state.resource.id}/services`;
      promises.push(dataService.post(uri, { services: newServices }));
    }
  }

  prepServicesData(servicesObj) {
    const newServices = [];
    for (const key in servicesObj) {
      if (servicesObj.hasOwnProperty(key)) {
        const currentService = servicesObj[key];

        if (key < 0) {
          if (currentService.notesObj) {
            const notes = this.objToArray(currentService.notesObj.notes);
            delete currentService.notesObj;
            currentService.notes = notes;
          }
          currentService.schedule = createFullSchedule(currentService.scheduleObj);
          delete currentService.scheduleObj;

          if (!isEmpty(currentService)) {
            newServices.push(currentService);
          }
        }
      }
    }
    return newServices;
  }

  prepNotesData(notes) {
    const newNotes = [];
    for (const key in notes) {
      if (notes.hasOwnProperty(key)) {
        newNotes.push({ note: notes[key].note });
      }
    }
    return newNotes;
  }

  objToArray(obj) {
    const arr = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(obj[key]);
      }
    }

    return arr;
  }

  postSchedule(scheduleObj, promises, uriObj) {
    if (scheduleObj) {
      postObject(scheduleObj, 'schedule_days', promises);
    }
  }

  postNotes(notesObj, promises, uriObj) {
    if (notesObj) {
      const notes = notesObj.notes;
      const newNotes = [];
      for (const key in notes) {
        if (notes.hasOwnProperty(key)) {
          const currentNote = notes[key];
          if (key < 0) {
            const uri = `/api/${uriObj.path}/${uriObj.id}/notes`;
            promises.push(dataService.post(uri, { note: currentNote }));
          } else if (currentNote.isRemoved) {
            const uri = `/api/notes/${key}`;
            promises.push(dataService.APIDelete(uri));
          } else {
            const uri = `/api/notes/${key}/change_requests`;
            promises.push(dataService.post(uri, { change_request: currentNote }));
          }
        }
      }
    }
  }
  handlePhoneChange(phoneCollection) {
    this.setState({ phones: phoneCollection, inputsDirty: true });
  }

  handleResourceFieldChange(e) {
    const field = e.target.dataset.field;
    const value = e.target.value;
    const object = {};
    object[field] = value;
    object.inputsDirty = true;
    this.setState(object);
  }

  handleScheduleChange(scheduleObj) {
    this.setState({ scheduleObj, inputsDirty: true });
  }

  handleAddressChange(addressObj) {
    this.setState({ address: addressObj, inputsDirty: true });
  }

  handleServiceChange(servicesObj) {
    this.setState({ services: servicesObj, inputsDirty: true });
  }

  handleNotesChange(notesObj) {
    this.setState({ notes: notesObj, inputsDirty: true });
  }

  handleServiceNotesChange(notesObj) {
    this.setState({ serviceNotes: notesObj, inputsDirty: true });
  }

  certifyHAP() {
    dataService.post(`/api/resources/${this.state.resource.id}/certify`)
      .then((response) => {
        // TODO: Do not use alert() for user notifications.
        if (response.ok) {
          alert('HAP Certified. Thanks!');  // eslint-disable-line no-alert
          const resource = this.state.resource;
          resource.certified = response.ok;
          this.setState({ resource });
        } else {
          alert('Issue verifying resource. Please try again.');  // eslint-disable-line no-alert
        }
      });
  }

  formatTime(time) {
    // FIXME: Use full times once db holds such values.
    return time.substring(0, 2);
  }

  renderSectionFields() {
    const resource = this.state.resource;
    return (
      <section id="info" className="edit--section">
        <header className="edit--section--header">
          <h4>Info</h4>
        </header>
        <ul className="edit--section--list">

          <li key="name" className="edit--section--list--item">
            <label htmlFor="edit-name-input">Name</label>
            <input
              id="edit-name-input"
              type="text"
              className="input"
              placeholder="Name"
              data-field="name"
              defaultValue={resource.name}
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <li key="alternate_name" className="edit--section--list--item">
            <label htmlFor="edit-alternate-name-input">Alternate Name</label>
            <input
              id="edit-alternate-name-input"
              type="text"
              className="input"
              placeholder="Alternate Name"
              data-field="alternate_name"
              defaultValue={resource.alternate_name}
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <EditAddress
            address={this.state.resource.address}
            updateAddress={this.handleAddressChange}
          />

          <EditPhones
            collection={this.state.resource.phones}
            handleChange={this.handlePhoneChange}
          />

          <li key="website" className="edit--section--list--item email">
            <label htmlFor="edit-website-input">Website</label>
            <input
              id="edit-website-input"
              type="url"
              className="input"
              defaultValue={resource.website}
              data-field="website"
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <li key="email" className="edit--section--list--item email">
            <label htmlFor="edit-email-input">E-Mail</label>
            <input
              id="edit-email-input"
              type="email"
              className="input"
              defaultValue={resource.email}
              data-field="email"
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <li key="long_description" className="edit--section--list--item">
            <label htmlFor="edit-description-input">Description</label>
            <textarea
              id="edit-description-input"
              className="input"
              defaultValue={resource.long_description}
              data-field="long_description"
              onChange={this.handleResourceFieldChange}
            />
            <p>If you&#39;d like to add formatting to descriptions, we support <a href="https://github.github.com/gfm/" target="_blank" rel="noopener noreferrer">Github flavored markdown</a>.</p>
          </li>

          <li key="legal_status" className="edit--section--list--item email">
            <label htmlFor="edit-legal-status-input">Legal Status</label>
            <input
              id="edit-legal-status-input"
              type="text"
              className="input"
              defaultValue={resource.legal_status}
              data-field="legal_status"
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <EditSchedule
            schedule={this.state.resource.schedule}
            handleScheduleChange={this.handleScheduleChange}
          />

          <EditNotes
            notes={this.state.resource.notes}
            handleNotesChange={this.handleNotesChange}
          />

        </ul>
      </section>
    );
  }

  renderServices() {
    return (
      <section id="services" className="edit--section">
        <header className="edit--section--header">
          <h4>Services</h4>
        </header>
        <ul className="edit--section--list">
          <EditServices
            services={this.state.resource.services}
            handleServiceChange={this.handleServiceChange}
            handleDeactivation={this.handleDeactivation}
          />
        </ul>
      </section>
    );
  }

  render() {
    const resource = this.state.resource;

    return (!resource && !this.state.newResource ? <Loader /> :
    <div className="edit">
      <EditSidebar
        createResource={this.createResource}
        handleSubmit={this.handleSubmit}
        handleCancel={this.handleCancel}
        handleDeactivation={this.handleDeactivation}
        resource={this.state.resource}
        submitting={this.state.submitting}
        certifyHAP={this.certifyHAP}
        newServices={this.state.services.services}
        newResource={this.state.newResource}
      />
      <div className="edit--main">
        <header className="edit--main--header">
          <h1 className="edit--main--header--title">{resource.name}</h1>
        </header>
        <div className="edit--sections">
          {this.renderSectionFields()}
          {this.state.newResource ? null : this.renderServices()}
        </div>
      </div>
    </div>
    );
  }
}

function isEmpty(map) {
  for (const key in map) {
    return !map.hasOwnProperty(key);
  }
  return true;
}

EditSections.propTypes = {
  // TODO: location is only ever used to get the resourceid; we should just pass
  // in the resourceid directly as a prop
  location: PropTypes.shape({
    query: PropTypes.shape({
      resourceid: PropTypes.string,
    }).isRequired,
  }).isRequired,
  // TODO: Figure out what type router actually is
  router: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(EditSections);
