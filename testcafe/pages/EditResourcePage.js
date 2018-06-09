import config from '../config';
import EditPage from './EditPage';


export default class EditResourcePage extends EditPage {
  static url(resourceId) {
    return `${config.baseUrl}/resource?id=${resourceId}`;
  }
}
