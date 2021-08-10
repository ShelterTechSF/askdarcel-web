import { ReactSelector } from 'testcafe-react-selectors';
import config from '../config';

export default class ServicePage {
  constructor() {
    const baseSelectorName = 'ServicePage';
    const baseSelector = ReactSelector(baseSelectorName);
    this.address = baseSelector.find('.listing--main--left--hours header strong');
    this.appProcess = baseSelector.find('.listing--main--left--details tr').nth(0).find('td');
    this.cost = baseSelector.find('.listing--main--left--details tr').nth(2).find('td');
    this.description = baseSelector.find('.listing--main--left--about div');
    this.details = baseSelector.find('.listing--main--left--details');
    this.directionsButton = baseSelector.find('.action-sidebar--directions');
    this.email = baseSelector.find('.listing--main--left--contact tr').nth(1).find('td');
    this.name = baseSelector.find('.listing--main--left > header h1');
    this.note = this.details.find('tbody td');
    this.phone = baseSelector.find('.listing--main--left--contact tbody td');
    this.printButton = baseSelector.find('.action-sidebar--print');
    this.requiredDocs = baseSelector.find('.listing--main--left--details tr').nth(1).find('td');
    this.schedule = baseSelector.findReact('TableOfOpeningTimes tbody tr');
    this.url = serviceId => `${config.baseUrl}/services/${serviceId}`;
  }

  /**
   * Wait until the page is fully loaded.
   *
   * Some TestCafe actions may attempt to run before a page is fully loaded, so
   * this method can be called to force us to wait until the page is loaded
   * first.
   *
   * @param t - A TestCafe test Promise.
   */
  async waitUntilPageLoaded(t) {
    await t.hover(this.name);
  }
}
