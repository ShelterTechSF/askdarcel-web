import { Selector } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';

class EditAddressModal {
  constructor() {
    const baseSelector = ReactSelector('EditAddressModal');
    this.name = baseSelector.find('input[name="name"]');
    this.address1 = baseSelector.find('input[name="address_1"]');
    this.address2 = baseSelector.find('input[name="address_2"]');
    this.city = baseSelector.find('input[name="city"]');
    this.stateOrProvince = baseSelector.find('input[name="state_province"]');
    this.postalCode = baseSelector.find('input[name="postal_code"]');
    this.cancelButton = baseSelector.find('button').withText(/cancel/i);
    this.saveButton = baseSelector.find('input[type="submit"]');
  }
}

class EditPhone {
  constructor(index) {
    const baseSelector = ReactSelector('EditPhone').nth(index);
    this.number = baseSelector.find('input').withAttribute('data-field', 'number');
    this.serviceType = baseSelector.find('input').withAttribute('data-field', 'service_type');
  }
}

class EditResourceNote {
  constructor(index) {
    const baseSelector = ReactSelector('EditNotes').nth(0);
    this.content = baseSelector.findReact('EditNote').nth(index).find('textarea');
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

/* eslint-disable quotes */
class NewService {
  constructor() {
    const baseSelector = Selector('.edit--service--list .edit--section:last-child');
    this.name = baseSelector.find('.edit--section--list--item:first-child input');
    this.nickname = baseSelector.find(`[placeholder="What it's known as in the community"]`);
    this.email = baseSelector.find('.email input');
    this.description = baseSelector.find(`[placeholder="Describe what you'll receive from this service in a few sentences."]`);
    this.appProcess = baseSelector.find(`[placeholder="How do you apply for this service?"]`);
    this.requiredDocs = baseSelector.find(`[placeholder="What documents do you need to bring to apply?"]`);
    this.interpServices = baseSelector.find(`[placeholder="What interpretation services do they offer?"]`);
    this.cost = baseSelector.find(`[placeholder="How much does this service cost?"]`);
    this.waitTime = baseSelector.find(`[placeholder="Is there a waiting list or wait time?"]`);
    this.website = baseSelector.find(`[placeholder="http://"]`);
  }
}
/* eslint-enable quotes */

export default class EditPage {
  constructor() {
    const baseSelectorName = 'OrganizationEditPage';
    const baseSelector = ReactSelector(baseSelectorName);
    this.name = baseSelector.find('#edit-name-input');
    this.addressModal = new EditAddressModal();
    this.addAddressButton = ReactSelector('EditAddresses').find('button').withText(/add location/i);
    this.addNoteButton = ReactSelector('EditNotes').find('.edit--section--list--item--button');
    this.addPhoneButton = ReactSelector('EditPhones').find('.edit--section--list--item--button');
    this.website = baseSelector.find('#edit-website-input');
    this.email = baseSelector.find('#edit-email-input');
    this.description = baseSelector.find('#edit-description-input');
    this.deleteNoteButton = ReactSelector('EditNotes').find('.delete-note');
    this.deletePhoneButton = ReactSelector('EditPhones').find('.trash-button');
    this.saveButton = baseSelector.findReact('EditSidebar').findReact('SaveButton');
    this.addServiceButton = baseSelector.find('.new-service');
    this.removeFirstServiceButton = baseSelector.find('.remove-item:nth-last-of-type(1)');
    this.services = baseSelector.find('.edit--service');
    this.newService = new NewService();
  }

  static getAddressEditButton(index) {
    return ReactSelector('EditAddresses AddressListItem').nth(index).find('button').withText(/edit/i);
  }

  static getPhone(index) {
    return new EditPhone(index);
  }

  static getResourceNote(index) {
    return new EditResourceNote(index);
  }

  static getService(serviceId) {
    return new EditService(serviceId);
  }
}
