import { ReactSelector } from 'testcafe-react-selectors';
import config from '../config';

export default class ResourcePage {
  constructor() {
    const baseSelectorName = 'OrganizationListingPage';
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
    this.website = baseSelector.findReact('Website');
    this.email = baseSelector.findReact('Email');
    this.noteContainer = baseSelector.findReact('Notes');
    this.notes = baseSelector.find('#notes .service--section--list li');
    this.editButton = baseSelector.find('.action-sidebar--edit');
    this.services = baseSelector.find('#services.service--section .service');
  }

  // There's a bug in TestCafe where if you are partially scrolled down the
  // Resource Page, where the edit button is still visible yet its center is
  // covered by the nav bar (which uses position: sticky), then TestCafe will
  // attempt to click it and will not notice that the nav bar is obscuring it.
  // This is a workaround to scroll to the top of the page, ensuring that the
  // edit button is completely unobscured, before clicking.
  async clickEditButton(t) {
    await t.eval(() => window.scrollTo(0, 0));
    return t.click(this.editButton);
  }

  static url(resourceId) {
    return `${config.baseUrl}/resource?id=${resourceId}`;
  }
}
