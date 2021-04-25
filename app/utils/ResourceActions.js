import _ from 'lodash';
import * as dataService from './DataService';

const verifyItem = (item, itemType) => {
  const { id } = item;
  const changeRequest = { verified_at: new Date().toISOString() };
  return dataService.post(`/api/${itemType}s/${id}/change_requests`, { change_request: changeRequest })
    .then(response => {
      // TODO: Do not use alert() for user notifications.
      if (response.ok) {
        alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} verified. Thanks!`); // eslint-disable-line no-alert
      } else {
        alert(`Issue verifying ${itemType}. Please try again.`); // eslint-disable-line no-alert
      }
    });
};

export const getResourceActions = (resource, service) => {
  const phoneNumber = _.get(resource, 'phones[0].number');
  const latitude = _.get(resource, 'addresses[0].latitude');
  const longitude = _.get(resource, 'addresses[0].longitude');

  let actions = {
    edit: {
      name: 'Edit',
      icon: 'edit',
      to: `/organizations/${resource.id}/edit`,
    },
    print: {
      name: 'Print',
      icon: 'print',
      handler: () => { window.print(); },
    },
    verify: {
      name: 'Mark Correct',
      icon: 'verify',
      handler: () => (service ? verifyItem(service, 'service') : verifyItem(resource, 'resource')),
    },
    feedback: {
      name: 'Share Feedback',
      icon: 'feedback',
      feedback: true,
    },
  };

  if (phoneNumber) {
    actions = {
      ...actions,
      phone: {
        name: 'Call',
        icon: 'phone',
        link: `tel:${phoneNumber}`,
      },
    };
  }

  if (latitude && longitude) {
    actions = {
      ...actions,
      directions: {
        name: 'Directions',
        icon: 'directions',
        link: `http://google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      },
    };
  }

  return actions;
};
