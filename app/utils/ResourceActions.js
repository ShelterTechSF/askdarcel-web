import _ from 'lodash';

export const getResourceActions = resource => ({
  // TODO Edit should add service ID header
  edit: {
    name: 'Edit',
    icon: 'edit',
    to: `/resource/edit?resourceid=${resource.id}`,
  }, // TODO Update with path to /resource/:id
  print: {
    name: 'Print',
    icon: 'print',
    handler: () => {
      window.print();
    },
  },
  directions: {
    name: 'Directions',
    icon: 'directions',
    link: `http://google.com/maps/dir/?api=1&destination=${
      resource.address.latitude
    },${resource.address.longitude}`,
  },
  phone: {
    name: 'Call',
    icon: 'call',
    link: `tel:${_.get(resource, 'phones[0].number')}`,
  },
  // TODO Integrate with mobile share, how to handle shares
  // { name: 'Share', icon: 'share' },
  // { name: 'Save', icon: 'save' }, TODO We have no save mechanism yet
});
