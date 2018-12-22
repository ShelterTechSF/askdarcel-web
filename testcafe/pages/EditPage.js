import { ReactSelector } from 'testcafe-react-selectors';

class EditAddress {
  constructor() {
    const baseSelector = ReactSelector('EditAddress');
    this.address1 = baseSelector.find('input').withAttribute('data-field', 'address_1');
    this.address2 = baseSelector.find('input').withAttribute('data-field', 'address_2');
    this.address3 = baseSelector.find('input').withAttribute('data-field', 'address_3');
    this.address4 = baseSelector.find('input').withAttribute('data-field', 'address_4');
    this.city = baseSelector.find('input').withAttribute('data-field', 'city');
    this.stateOrProvince = baseSelector.find('input').withAttribute('data-field', 'state_province');
    this.country = baseSelector.find('input').withAttribute('data-field', 'country');
    this.postalCode = baseSelector.find('input').withAttribute('data-field', 'postal_code');
  }
}

class EditPhone {
  constructor(index) {
    const baseSelector = ReactSelector('EditPhone').nth(index);
    this.number = baseSelector.find('input').withAttribute('data-field', 'number');
    this.serviceType = baseSelector.find('input').withAttribute('data-field', 'service_type');
  }
}

class EditScheduleDay {
  constructor(parentSelector, index) {
    const baseSelector = parentSelector.find(`.day-group:nth-child(${index})`);
    this.addButton = baseSelector.find('.add-time');
    this.removeButton = baseSelector.find('.remove-time');
    this.times = baseSelector.find('input').withAttribute('type', 'time');
    this.start = this.times.withAttribute('data-field', 'opens_at');
    this.lastStart = baseSelector.find('.hours li:last-child input').nth(0);
    this.end = this.times.withAttribute('data-field', 'closes_at');
    this.lastEnd = baseSelector.find('.hours li:last-child input').nth(1);
  }
}

class EditSchedule {
  constructor(parentSelector) {
    const baseSelector = parentSelector.findReact('EditSchedule');
    this.tuesday = new EditScheduleDay(baseSelector, 2);
  }
}

class EditService {
  constructor(serviceId) {
    const baseSelector = ReactSelector('ProvidedService').withAttribute('id', `${serviceId}`);
    this.baseSelector = baseSelector;
    this.monday = baseSelector.find('.edit-hours-list .day-group:nth-child(1)');
    this.tuesday = baseSelector.find('.edit-hours-list .day-group:nth-child(2)');
    this.wednesday = baseSelector.find('.edit-hours-list .day-group:nth-child(3)');
    this.thursday = baseSelector.find('.edit-hours-list .day-group:nth-child(4)');
    this.friday = baseSelector.find('.edit-hours-list .day-group:nth-child(5)');
    this.saturday = baseSelector.find('.edit-hours-list .day-group:nth-child(6)');
    this.sunday = baseSelector.find('.edit-hours-list .day-group:nth-child(7)');
    this.schedule = new EditSchedule(baseSelector);
  }

  static getSchedule() {
    return new EditSchedule(this.baseSelector);
  }
}

export default class EditPage {
  constructor() {
    const baseSelectorName = 'OrganizationEditPage';
    const baseSelector = ReactSelector(baseSelectorName);
    this.name = baseSelector.find('#edit-name-input');
    this.address = new EditAddress();
    this.addPhoneButton = ReactSelector('EditPhones').find('.edit--section--list--item--button');
    this.website = baseSelector.find('#edit-website-input');
    this.email = baseSelector.find('#edit-email-input');
    this.description = baseSelector.find('#edit-description-input');
    this.deletePhoneButton = ReactSelector('EditPhones').find('.trash-button');
    this.saveButton = baseSelector.find('.sidebar--actions--button');
    this.addServiceButton = baseSelector.find('.new-service');
    this.removeFirstServiceButton = baseSelector.find('.remove-item:nth-last-of-type(1)');
    this.services = baseSelector.find('.edit--service');
    this.newServiceName = baseSelector.find('.edit--service--list .edit--section:last-child .edit--section--list--item:first-child input');
  }

  static getPhone(index) {
    return new EditPhone(index);
  }

  static getService(serviceId) {
    return new EditService(serviceId);
  }
}
