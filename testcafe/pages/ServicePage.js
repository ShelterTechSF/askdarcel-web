import { ReactSelector } from 'testcafe-react-selectors';
import config from '../config';

export default class ResourcePage {
  constructor() {
    const baseSelectorName = 'ServicePage';
    const baseSelector = ReactSelector(baseSelectorName);
    this.serviceName = baseSelector.find('header');
    this.description = baseSelector.find('.listing--main--left--about');
    this.details = baseSelector.find('.listing--main--left--details');
    this.editButton = baseSelector.find('.listing--aside--edit');
    this.printButton = baseSelector.find('.listing--aside--print');
    this.directionsButton = baseSelector.find('.listing--aside--directions');
    this.url = serviceId => `${config.baseUrl}/services/${serviceId}`;
  }

}
