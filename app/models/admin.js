export const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS';
export const ADMIN_LOGIN_ERROR = 'ADMIN_LOGIN_ERROR';
export const ADMIN_LOGIN_REQUEST = 'ADMIN_LOGIN_REQUEST';

// TODO These aren't actual redux actions yet, just removing them from component logic
export function getExistingValueFromChangeRequest(changeRequest, fieldName, fieldValue) {
  const { resource } = changeRequest;
  switch (changeRequest.type) {
    case 'ResourceChangeRequest':
    case 'AddressChangeRequest':
    case 'PhoneChangeRequest':
    case 'NoteChangeRequest':
      return resource[fieldName] ? resource[fieldName] : false;
    case 'ScheduleDayChangeRequest':
      return 'date change';
    case 'ServiceChangeRequest':
      return resource.services.find(service => service.id === changeRequest.object_id)[fieldName];
    default:
      console.log('unknown type', changeRequest, fieldName, fieldValue);
      return '<Some Change>';
  }
}

const forms = {
  resource: {},
};

export default forms;

