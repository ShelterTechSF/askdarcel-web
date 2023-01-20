import { ReactSelector } from "testcafe-react-selectors";

export default class SearchPage {
  constructor() {
    const baseSelector = ReactSelector("SearchTable");
    this.searchRows = baseSelector.findReact("SearchRow");

    this.firstOrganization = baseSelector.find(".resource-entry");
    this.firstOrganizationName = this.firstOrganization.find(".entry-headline");
    this.firstOrganizationDesc =
      this.firstOrganization.find(".search-entry-body");

    this.firstService = baseSelector.find(".service-entry");
    this.firstServiceName = this.firstService.find(".entry-headline");
    this.firstServiceDesc = this.firstService.find(".search-entry-body");

    this.openHours = baseSelector.find(".entry-hours");
    this.pagination = ReactSelector("InstantSearch").find(".ais-Pagination");
  }
}
