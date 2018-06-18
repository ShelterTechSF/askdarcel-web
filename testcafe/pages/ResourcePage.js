import { ReactSelector } from 'testcafe-react-selectors';
import config from '../config';

export default class ResourcePage {
  constructor() {
    const baseSelectorName = 'Resource';
    const baseSelector = ReactSelector(baseSelectorName);
    this.resourceName = baseSelector.find('.org--main--header--title');
    this.description = baseSelector.find('.org--main--header--description');
    this.address = ReactSelector(`${baseSelectorName} AddressInfo`);
    // TODO: Can't use nested React component name PhoneNumber because it is
    // instantiated in both the header and the body of the page and because the
    // testcafe-react-selectors plugin is currently unable to mix CSS selectors
    // in between React component names.
    // https://github.com/DevExpress/testcafe-react-selectors/issues/51
    this.phones = baseSelector.find('.org--main--header--phone .phone p');
    this.editButton = baseSelector.find('.edit-button');
  }

  static url(resourceId) {
    return `${config.baseUrl}/resource?id=${resourceId}`;
  }
}
