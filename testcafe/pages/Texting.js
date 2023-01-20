import { ReactSelector } from "testcafe-react-selectors";

export default class Texting {
  constructor() {
    const baseSelector = ReactSelector("Texting");
    this.recipientName = baseSelector
      .find("input")
      .withAttribute("name", "recipientName");
    this.phoneNumber = baseSelector
      .find("input")
      .withAttribute("name", "phoneNumber");
    this.agree = baseSelector.find("input").withAttribute("name", "agreed");
    this.submitButton = baseSelector
      .find("button")
      .withAttribute("type", "submit");
    this.sent = baseSelector.find("h1").withAttribute("name", "sent");
  }
}
