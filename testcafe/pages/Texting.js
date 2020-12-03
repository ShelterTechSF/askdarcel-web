import { ReactSelector } from 'testcafe-react-selectors';

export default class Texting {
  constructor() {
    const baseSelector = ReactSelector('Texting');
    this.name = baseSelector.find('input').withAttribute('datafield', 'user_name');
    this.phone = baseSelector.find('input').withAttribute('datafield', 'phone_number');
    this.agree = baseSelector.find('input').withAttribute('datafield', 'agree');
    this.submitButton = baseSelector.find('button').withAttribute('datafield', 'submit');
    this.sent = baseSelector.find('h1').withAttribute('datafield', 'sent');
  }
}
