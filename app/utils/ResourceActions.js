import _ from 'lodash';

export const getResourceActions = resource => {
  const phoneNumber = _.get(resource, 'phones[0].number');
  const latitude = _.get(resource, 'address.latitude');
  const longitude = _.get(resource, 'address.longitude');

  let actions = {
    edit: {
      name: 'Edit',
      icon: 'edit',
      to: `/resource/edit?resourceid=${resource.id}`,
    },
    print: {
      name: 'Print',
      icon: 'print',
      handler: () => { window.print(); },
    },
  };

  if (phoneNumber) {
    actions = {
      ...actions,
      phone: {
        name: 'Call',
        icon: 'call',
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
