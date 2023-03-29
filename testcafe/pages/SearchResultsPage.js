import { ReactSelector } from "testcafe-react-selectors";
import config from "../config";

export default class SearchResults {
  constructor() {
    const baseSelector = ReactSelector("SearchResults");
    this.textMeInfo = baseSelector
      .find("div")
      .withAttribute("data-field", "text-me")
      .nth(0);
  }

  static url() {
    return `${config.baseUrl}/food-resources/results`;
  }
}
