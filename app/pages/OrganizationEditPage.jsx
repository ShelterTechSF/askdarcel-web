import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter, browserHistory } from 'react-router';
import _ from 'lodash';

import { Loader } from 'components/ui';
import EditAddress from '../components/edit/EditAddress';
import EditServices from '../components/edit/EditServices';
import EditNotes from '../components/edit/EditNotes';
import EditSchedule from '../components/edit/EditSchedule';
import EditPhones from '../components/edit/EditPhones';
import EditSidebar from '../components/edit/EditSidebar';
import * as dataService from '../utils/DataService';

import { withPopUpMessages } from '../actions/popUpMessageActions';

import './OrganizationEditPage.scss';

/**
 * Apply a set of changes to a base array of items.
 *
 * Constraints:
 * - Original ordering of base array should be preserved
 * - New items should be pushed to the end ordered by ID in descending order.
 *   This assumes that the IDs for new items start with -1 and decrement for
 *   each new item
 *
 * @param {object[]} baseItems - An array of items, each with an `id` field
 * @param {object} changesById - An object mapping IDs to changes
 * @param {set} deletedIds - Optional. A set of IDs of items to delete
 *
 * @return {object[]} An array of items with the changes applied
 */
const applyChanges = (baseItems, changesById, deletedIds = undefined) => {
  const baseItemIds = new Set(baseItems.map(i => i.id));
  // Order the new IDs in decreasing order, since that's the order they should
  // appear on the page.
  // We use lodash's sortBy because JavaScript's sort does a lexicographic sort,
  // even on numbers.
  const newIds = _.sortBy(
    Object.keys(changesById)
      .map(idStr => parseInt(idStr, 10))
      .filter(id => !baseItemIds.has(id)),
  ).reverse();
  // Prepopulate an array with all the items, including the new ones in the
  // right position.
  const prechangedItems = [...baseItems, ...newIds.map(id => ({ id }))];
  let transformedItems = prechangedItems.map(item => {
    if (item.id in changesById) {
      return { ...item, ...changesById[item.id] };
    }
    return item;
  });
  if (deletedIds) {
    transformedItems = transformedItems.filter(item => !deletedIds.has(item.id));
  }
  return transformedItems;
};

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

/** Build UI state schedule from API schedule.
 *
 * The difference between the schedule that comes from the API and the schedule
 * that is saved as React UI state is that the UI state schedule's schema groups
 * ScheduleDays by day of week. This allows us to represent blank ScheduleDays
 * when a new, blank time is added but before an open time or a close time is
 * set. The API schedule schema does not support having a ScheduleDay that has
 * no open and close time but that is attached to a day of week. This feature is
 * required for the UI because the blank time needs to appear under a day of
 * week before an open and close time is set.
 */
const buildScheduleDays = schedule => {
  const scheduleId = schedule ? schedule.id : null;
  const currSchedule = {};
  let finalSchedule = {};

  const is24Hours = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  };

  const tempSchedule = {
    Monday: [{ opens_at: null, closes_at: null, scheduleId }],
    Tuesday: [{ opens_at: null, closes_at: null, scheduleId }],
    Wednesday: [{ opens_at: null, closes_at: null, scheduleId }],
    Thursday: [{ opens_at: null, closes_at: null, scheduleId }],
    Friday: [{ opens_at: null, closes_at: null, scheduleId }],
    Saturday: [{ opens_at: null, closes_at: null, scheduleId }],
    Sunday: [{ opens_at: null, closes_at: null, scheduleId }],
  };

  if (schedule) {
    schedule.schedule_days.forEach(day => {
      const currDay = day.day;
      if (!is24Hours[currDay]) {
        // Check to see if any of the hour pairs for the day
        // indicate the resource/service is open 24 hours
        // if there is a pair only have that in the day obj
        if (day.opens_at === 0 && day.closes_at === 2359) {
          is24Hours[currDay] = true;
          // Since this record already exists in our DB, we only need the id
          // scheduleID is needed when creating no data
          currSchedule[currDay] = [{ opens_at: 0, closes_at: 2359, id: day.id }];
        } else {
          Object.assign(day, { openChanged: false, closeChanged: false });
          if (currSchedule[currDay]) {
            currSchedule[day.day].unshift(day);
          } else {
            currSchedule[day.day] = [day];
          }
        }
      }
    });
  }
  finalSchedule = Object.assign({}, tempSchedule, currSchedule);
  return finalSchedule;
};
export { buildScheduleDays };

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
  Object.keys(scheduleObj).forEach(day => {
    currDay = scheduleObj[day];
    currDay.forEach(curr => {
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
    const { notes } = notesObj;
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

// THis is only called for schedules for new services, not for resources nor for
// existing services.
function createFullSchedule(scheduleObj) {
  if (scheduleObj) {
    const newSchedule = [];
    let tempDay = {};
    Object.keys(scheduleObj).forEach(day => {
      scheduleObj[day].forEach(curr => {
        if (curr.opens_at === null || curr.closes_at === null) {
          return;
        }
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

const prepNotesData = notes => Object.values(notes).map(note => ({ note }));

const prepSchedule = scheduleObj => {
  const newSchedule = [];
  let tempDay = {};
  Object.keys(scheduleObj).forEach(day => {
    scheduleObj[day].forEach(curr => {
      tempDay = {};
      tempDay.day = day;
      tempDay.opens_at = curr.opens_at;
      tempDay.closes_at = curr.closes_at;
      newSchedule.push(tempDay);
    });
  });
  return newSchedule;
};

const handleCancel = () => {
  browserHistory.goBack();
};

const deepClone = obj => JSON.parse(JSON.stringify(obj));

class OrganizationEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scheduleObj: {},
      address: {},
      services: {},
      deactivatedServiceIds: new Set(),
      notes: {},
      phones: [],
      submitting: false,
      newResource: false,
      inputsDirty: false,
      latestServiceId: -1,
    };

    this.certifyHAP = this.certifyHAP.bind(this);
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.keepOnPage = this.keepOnPage.bind(this);
    this.handleResourceFieldChange = this.handleResourceFieldChange.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeactivation = this.handleDeactivation.bind(this);
    this.createResource = this.createResource.bind(this);
    this.sidebarAddService = this.sidebarAddService.bind(this);
  }

  componentWillMount() {
    const { route, router } = this.props;
    router.setRouteLeaveHook(
      route,
      this.routerWillLeave,
    );
  }

  componentDidMount() {
    const { location: { query, pathname } } = this.props;
    const splitPath = pathname.split('/');
    window.addEventListener('beforeunload', this.keepOnPage);
    if (splitPath[splitPath.length - 1] === 'new') {
      this.setState({
        newResource: true, resource: { schedule: {}, scheduleObj: buildScheduleDays(undefined) },
      });
    }
    const resourceID = query.resourceid;
    if (resourceID) {
      const url = `/api/resources/${resourceID}`;
      fetch(url).then(r => r.json())
        .then(data => this.handleAPIGetResource(data.resource));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.keepOnPage);
  }

  handleAPIGetResource = resource => {
    const services = (resource.services || []).reduce(
      (acc, service) => ({
        ...acc,
        [service.id]: {
          scheduleObj: buildScheduleDays(service.schedule),
          // If the service doesn't have a schedule associated with it, and can
          // inherit its schedule from its parent, inherit the parent resource's
          // schedule.
          shouldInheritScheduleFromParent: !(_.get(service.schedule, 'schedule_days.length', false)),
        },
      }),
      {},
    );
    this.setState({
      resource,
      services,
      scheduleObj: buildScheduleDays(resource.schedule),
    });
  }

  postServices = (servicesObj, promises) => {
    if (!servicesObj) return;
    const { resource } = this.state;
    const newServices = [];
    Object.entries(servicesObj).forEach(([key, value]) => {
      const currentService = deepClone(value);
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
        delete currentService.shouldInheritScheduleFromParent;
        if (!_.isEmpty(currentService)) {
          promises.push(dataService.post(uri, { change_request: currentService }));
        }
      }
    });

    if (newServices.length > 0) {
      const uri = `/api/resources/${resource.id}/services`;
      promises.push(dataService.post(uri, { services: newServices }));
    }
  }

  /** @method editServiceById
   * @description Updates the service with any changes made
   * @param {number} id a unique identifier to find a service
   * @param {object} service the service to be updated
   * @returns {void}
   */
  editServiceById = (id, changes) => {
    this.setState(({ services }) => {
      const oldService = services[id] || {};
      const newService = { ...oldService, ...changes };
      return {
        services: { ...services, [id]: newService },
        inputsDirty: true,
      };
    });
  }

  /** @method addService
   * @description Creates a brand new service
   */
  addService = () => {
    const { services, latestServiceId } = this.state;
    const nextServiceId = latestServiceId - 1;

    const newService = {
      id: nextServiceId,
      notes: [],
      schedule: {
        schedule_days: [],
      },
      scheduleObj: buildScheduleDays(undefined),
      shouldInheritScheduleFromParent: true,
    };
    this.setState({
      services: { ...services, [nextServiceId]: newService },
      latestServiceId: nextServiceId,
    });
  }

  keepOnPage(e) {
    const { inputsDirty } = this.state;
    if (inputsDirty) {
      const message = 'Are you sure you want to leave? Any changes you have made will be lost.';
      e.returnValue = message;
    }
  }

  routerWillLeave() {
    const { inputsDirty, submitting } = this.state;
    if (inputsDirty && !submitting) {
      return 'Are you sure you want to leave? Any changes you have made will be lost.';
    }
    return null;
  }

  createResource() {
    const {
      scheduleObj,
      notes,
      phones,
      name,
      long_description,
      website,
      email,
      address,
    } = this.state;
    const schedule = prepSchedule(scheduleObj);
    const newResource = {
      name,
      address,
      long_description,
      email,
      website,
      notes: notes.notes ? prepNotesData(notes.notes) : [],
      schedule: { schedule_days: schedule },
      phones,
    };
    const requestString = '/api/resources';

    this.setState({ submitting: true });
    const setNotSubmitting = () => {
      this.setState({ submitting: false });
    };
    dataService.post(requestString, { resources: [newResource] })
      .then(response => {
        if (response.ok) {
          alert('Resource successfuly created. Thanks!');
          response.json().then(res => browserHistory.push(`/resource?id=${res.resources[0].resource.id}`));
        } else {
          Promise.reject(response);
        }
      })
      .catch(error => {
        alert('Issue creating resource, please try again.');
        console.log(error);
        setNotSubmitting();
      });
  }

  handleSubmit() {
    const { showPopUpMessage } = this.props;
    this.setState({ submitting: true });
    const {
      address,
      alternate_name,
      email,
      legal_status,
      long_description,
      name,
      notes,
      phones,
      resource,
      scheduleObj,
      services,
      short_description,
      website,
    } = this.state;
    const promises = [];

    // Resource
    const resourceChangeRequest = {};
    let resourceModified = false;
    if (name !== resource.name) {
      resourceChangeRequest.name = name;
      resourceModified = true;
    }
    if (long_description !== resource.long_description) {
      resourceChangeRequest.long_description = long_description;
      resourceModified = true;
    }
    if (short_description !== resource.short_description) {
      resourceChangeRequest.short_description = short_description;
      resourceModified = true;
    }
    if (website !== resource.website) {
      resourceChangeRequest.website = website;
      resourceModified = true;
    }
    if (name !== resource.name) {
      resourceChangeRequest.name = name;
      resourceModified = true;
    }
    if (email !== resource.email) {
      resourceChangeRequest.email = email;
      resourceModified = true;
    }
    if (alternate_name !== resource.alternate_name) {
      resourceChangeRequest.alternate_name = alternate_name;
      resourceModified = true;
    }
    if (legal_status !== resource.legal_status) {
      resourceChangeRequest.legal_status = legal_status;
      resourceModified = true;
    }
    // fire off resource request
    if (resourceModified) {
      promises.push(dataService.post(`/api/resources/${resource.id}/change_requests`, { change_request: resourceChangeRequest }));
    }

    // Fire off phone requests
    postCollection(phones, resource.phones, 'phones', promises, resource.id);

    // schedule
    postSchedule(scheduleObj, promises);

    // address
    if (!_.isEmpty(address) && resource.address) {
      promises.push(dataService.post(`/api/addresses/${resource.address.id}/change_requests`, {
        change_request: address,
      }));
    }

    // Services
    this.postServices(services, promises);

    // Notes
    postNotes(notes, promises, { path: 'resources', id: resource.id });

    const that = this;
    Promise.all(promises).then(() => {
      that.props.router.push({ pathname: '/resource', query: { id: that.state.resource.id } });
      showPopUpMessage({
        type: 'success',
        message: 'Successfully saved your changes.',
      });
    }).catch(err => {
      console.log(err);
      showPopUpMessage({
        type: 'error',
        message: 'Sorry! An error occurred.',
      });
    });
  }

  handleDeactivation(type, id) {
    const { router } = this.props;
    // eslint-disable-next-line no-restricted-globals
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
            // Resource successfully deactivated. Redirect to home.
            router.push({ pathname: '/' });
          } else {
            // Service successfully deactivated. Mark deactivated in local state.
            this.setState(state => {
              state.deactivatedServiceIds.add(id);
              return state;
            });
          }
        });
    }
  }

  handlePhoneChange(phoneCollection) {
    this.setState({ phones: phoneCollection, inputsDirty: true });
  }

  handleResourceFieldChange(e) {
    const { field } = e.target.dataset;
    const { value } = e.target;
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

  handleNotesChange(notesObj) {
    this.setState({ notes: notesObj, inputsDirty: true });
  }

  certifyHAP() {
    const { resource: { id: resourceId } } = this.state;
    dataService.post(`/api/resources/${resourceId}/certify`)
      .then(response => {
        // TODO: Do not use alert() for user notifications.
        if (response.ok) {
          alert('HAP Certified. Thanks!'); // eslint-disable-line no-alert
          const { resource } = this.state;
          resource.certified = response.ok;
          this.setState({ resource });
        } else {
          alert('Issue verifying resource. Please try again.'); // eslint-disable-line no-alert
        }
      });
  }

  sidebarAddService() {
    this.addService();
    const newService = document.getElementById('new-service-button');
    // eslint-disable-next-line react/no-find-dom-node
    const domNode = ReactDOM.findDOMNode(newService);
    domNode.scrollIntoView({ behavior: 'smooth' });
  }

  renderSectionFields() {
    const { resource, scheduleObj } = this.state;
    return (
      <section id="info" className="edit--section">
        <ul className="edit--section--list">

          <li key="name" className="edit--section--list--item">
            <label htmlFor="edit-name-input">Name of the Organization</label>
            <input
              id="edit-name-input"
              type="text"
              className="input"
              placeholder="Organization Name"
              data-field="name"
              defaultValue={resource.name}
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <li key="alternate_name" className="edit--section--list--item">
            <label htmlFor="edit-alternate-name-input">Nickname</label>
            <input
              id="edit-alternate-name-input"
              type="text"
              className="input"
              placeholder="What it's known as in the community"
              data-field="alternate_name"
              defaultValue={resource.alternate_name}
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <EditAddress
            address={resource.address}
            updateAddress={this.handleAddressChange}
          />

          <EditPhones
            collection={resource.phones}
            handleChange={this.handlePhoneChange}
          />

          <li key="website" className="edit--section--list--item email">
            <label htmlFor="edit-website-input">Website</label>
            <input
              id="edit-website-input"
              type="url"
              className="input"
              placeholder="http://"
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
              placeholder="Describe the organization in 1-2 sentences. Avoid listing the services it provides and instead explaint the organization's mission."
              defaultValue={resource.long_description}
              data-field="long_description"
              onChange={this.handleResourceFieldChange}
            />
            <p>
If you&#39;d like to add formatting to descriptions, we support
              <a href="https://github.github.com/gfm/" target="_blank" rel="noopener noreferrer">Github flavored markdown</a>
.
            </p>
          </li>

          <li key="legal_status" className="edit--section--list--item email">
            <label htmlFor="edit-legal-status-input">Legal Status</label>
            <input
              id="edit-legal-status-input"
              type="text"
              className="input"
              placeholder="ex. non-profit, government, business"
              defaultValue={resource.legal_status}
              data-field="legal_status"
              onChange={this.handleResourceFieldChange}
            />
          </li>

          <EditSchedule
            scheduleDaysByDay={scheduleObj}
            scheduleId={resource.schedule.id}
            canInheritFromParent={false}
            shouldInheritFromParent={false}
            handleScheduleChange={this.handleScheduleChange}
          />

          <EditNotes
            notes={resource.notes}
            handleNotesChange={this.handleNotesChange}
          />

        </ul>
      </section>
    );
  }

  renderServices() {
    const {
      resource: { services },
      services: serviceChanges,
      deactivatedServiceIds: serviceDeletions,
    } = this.state;
    const flattenedServices = applyChanges(services, serviceChanges, serviceDeletions);
    return (
      <ul className="edit--section--list">
        <EditServices
          services={flattenedServices}
          editServiceById={this.editServiceById}
          addService={this.addService}
          handleDeactivation={this.handleDeactivation}
        />
      </ul>
    );
  }

  render() {
    const {
      newResource,
      resource,
      services,
      submitting,
    } = this.state;

    return (!resource && !newResource ? <Loader />
      : (
        <div className="edit">
          <EditSidebar
            createResource={this.createResource}
            handleSubmit={this.handleSubmit}
            handleCancel={handleCancel}
            handleDeactivation={this.handleDeactivation}
            resource={resource}
            submitting={submitting}
            certifyHAP={this.certifyHAP}
            newServices={services}
            newResource={newResource}
            addService={this.sidebarAddService}
          />
          <div className="edit--main">
            <header className="edit--main--header">
              <h1 className="edit--main--header--title">Let&apos;s start with the basics</h1>
            </header>
            <div className="edit--sections">
              {this.renderSectionFields()}
            </div>
            {!newResource && (
              <div className="edit--services">
                <header className="edit--main--header">
                  <h1 className="edit--main--header--title">Services</h1>
                </header>
                <div className="edit--sections">
                  {this.renderServices()}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    );
  }
}

OrganizationEditPage.propTypes = {
  // TODO: location is only ever used to get the resourceid; we should just pass
  // in the resourceid directly as a prop
  location: PropTypes.shape({
    query: PropTypes.shape({
      resourceid: PropTypes.string,
    }).isRequired,
  }).isRequired,
  // TODO: Figure out what type router actually is
  router: PropTypes.instanceOf(Object).isRequired,
  showPopUpMessage: PropTypes.func.isRequired,
};

export default withRouter(withPopUpMessages(OrganizationEditPage));
