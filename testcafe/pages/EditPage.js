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
}
