import { ReactSelector } from "testcafe-react-selectors";
import config from "../config";

export default class ResourcePage {
  constructor() {
    const baseSelectorName = "BaseOrganizationListingPage";
    const baseSelector = ReactSelector(baseSelectorName);
    this.address = ReactSelector(`${baseSelectorName} AddressInfo`);
    this.description = baseSelector.find(".org--main--header--description div");
    this.email = baseSelector.findReact("Email");
    // TODO: Can't use nested React component name PhoneNumber because it is
    // instantiated in both the header and the body of the page and because the
    // testcafe-react-selectors plugin is currently unable to mix CSS selectors
    // in between React component names.
    // https://github.com/DevExpress/testcafe-react-selectors/issues/51
    this.phones = baseSelector.find(".org--main--header--phone .phone p");
    this.resourceName = baseSelector.find(".org--main--header--title");
    this.noteContainer = baseSelector.findReact("Notes");
    this.notes = baseSelector.find("#notes .service--section--list li");
    this.services = baseSelector.find("#services.service--section .service");
    this.servicesHeader = this.services.find("a");
    this.website = baseSelector.findReact("Website");
  }

  static url(resourceId) {
    return `${config.baseUrl}/organizations/${resourceId}`;
  }
}
