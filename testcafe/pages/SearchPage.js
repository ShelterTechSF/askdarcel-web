import ReactSelector from 'testcafe-react-selectors';

export default class SearchPage {
  constructor() {
    this.resultsCount = ReactSelector('ResourcesTable').find('.results-count');
    this.pagination = ReactSelector('InstantSearch').find('.ais-Pagination');
    this.serviceEntry = ReactSelector('Hits ServiceEntry');
    this.resourceEntry = ReactSelector('Hits ResourceEntry');
    this.resultEntry = ReactSelector('ResourcesTable ResourcesRow');
  }
}
