import { ReactSelector } from 'testcafe-react-selectors';
import config from '../config';

export class ServicePageTestHelper {
  private baseSelectorName = 'ServicePage';
  private baseSelector = ReactSelector(this.baseSelectorName);

  address = this.baseSelector.find('.listing--main--left--hours header strong');
  appProcess = this.baseSelector.find('.listing--main--left--details tr').nth(0).find('td');
  cost = this.baseSelector.find('.listing--main--left--details tr').nth(2).find('td');
  description = this.baseSelector.find('.listing--main--left--about div');
  details = this.baseSelector.find('.listing--main--left--details');
  directionsButton = this.baseSelector.find('.action-sidebar--directions');
  email = this.baseSelector.find('.listing--main--left--contact tr').nth(1).find('td');
  name = this.baseSelector.find('.listing--main--left > header h1');
  note = this.details.find('tbody td');
  phone = this.baseSelector.find('.listing--main--left--contact tbody td');
  printButton = this.baseSelector.find('.action-sidebar--print');
  requiredDocs = this.baseSelector.find('.listing--main--left--details tr').nth(1).find('td');
  schedule = this.baseSelector.findReact('TableOfOpeningTimes tbody tr');

  url = serviceId => `${config.baseUrl}/services/${serviceId}`;

  /**
   * Wait until the page is fully loaded.
   *
   * Some TestCafe actions may attempt to run before a page is fully loaded, so
   * this method can be called to force us to wait until the page is loaded
   * first.
   *
   * @param t - A TestCafe test Promise.
   */
  async waitUntilPageLoaded(t: TestController) {
    await t.hover(this.name);
  }
}
