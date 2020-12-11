import { ReactSelector } from 'testcafe-react-selectors';

export default class Texting {
  constructor() {
    const baseSelector = ReactSelector('Texting');
    this.recipientName = baseSelector.find('input').withAttribute('data-field', 'recipientName');
    this.phoneNumber = baseSelector.find('input').withAttribute('data-field', 'phoneNumber');
    this.agree = baseSelector.find('input').withAttribute('data-field', 'agree');
    this.submitButton = baseSelector.find('button').withAttribute('data-field', 'submit');
    this.sent = baseSelector.find('h1').withAttribute('data-field', 'sent');
  }
}
