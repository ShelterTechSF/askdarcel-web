import { ReactSelector } from 'testcafe-react-selectors';
import config from '../config';

export default class ResourcePage {
  constructor() {
    const baseSelectorName = 'ServicePage';
    const baseSelector = ReactSelector(baseSelectorName);
    this.serviceName = baseSelector.find('header h1');
    this.description = baseSelector.find('.listing--main--left--about');
    this.details = baseSelector.find('.listing--main--left--details');
    this.editButton = baseSelector.find('.action-sidebar--edit');
    this.printButton = baseSelector.find('.action-sidebar--print');
    this.directionsButton = baseSelector.find('.action-sidebar--directions');
    this.schedule = baseSelector.findReact('TableOfOpeningTimes tbody tr');
    this.url = serviceId => `${config.baseUrl}/services/${serviceId}`;
  }
}
