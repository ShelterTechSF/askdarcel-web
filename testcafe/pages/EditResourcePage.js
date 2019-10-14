import config from '../config';
import EditPage from './EditPage';


export default class EditResourcePage extends EditPage {
  static url(resourceId) {
    return `${config.baseUrl}/organizations/${resourceId}/edit`;
  }
}
