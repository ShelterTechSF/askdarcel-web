import { ReactSelector } from 'testcafe-react-selectors';

export default class SearchPage {
  constructor() {
    const baseSelector = ReactSelector('ResourcesTable');
    this.resultsCount = baseSelector.find('.results-count');
    this.resultEntry = baseSelector.findReact('ResourcesRow');
    this.firstServiceName = baseSelector.find('.entry-organization');
    this.firstServiceDesc = baseSelector.find('.entry-description');
    this.firstResultName = baseSelector.find('.entry-headline');
    this.firstResultAddress = baseSelector.find('.entry-distance');
    this.openHours = baseSelector.find('.entry-hours');
    this.pagination = ReactSelector('InstantSearch').find('.ais-Pagination');
    this.serviceEntry = ReactSelector('Hits ServiceEntry');
    this.resourceEntry = ReactSelector('Hits ResourceEntry');
  }
}
