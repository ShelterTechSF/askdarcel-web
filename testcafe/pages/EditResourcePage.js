import config from '../config';
import EditPage from './EditPage';

export default class EditResourcePage extends EditPage {
  constructor() {
    super();
    this.url = (resourceId) =>
      `${config.baseUrl}/organizations/${resourceId}/edit`;
  }
}
