import config from '../config';
import EditPage from './EditPage';

export default class NewResourcePage extends EditPage {
  static url() {
    return `${config.baseUrl}/organizations/new`;
  }
}
