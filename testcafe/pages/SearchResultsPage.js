import { ReactSelector } from 'testcafe-react-selectors';
import config from '../config';

export default class SearchResults {
  constructor(){
    this.textMeInfo = ReactSelector('SearchResults').find('.sideLink:nth-child(3)');
  }

  static url() {
    return `${config.baseUrl}/food-resources/results`;
  }
}
