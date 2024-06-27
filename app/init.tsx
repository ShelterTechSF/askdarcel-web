import React from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CookiesProvider } from "react-cookie";
import * as Sentry from "@sentry/browser";

import config from "./config";
import { App } from "./App";

require("instantsearch.css/themes/reset.css");
require("./styles/main.scss");
// Force this to be included so that we can reference it from emails.
require("./assets/img/sf-service-email.png");

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: `https://${config.SENTRY_PUBLIC_KEY}@sentry.io/${config.SENTRY_PROJECT_ID}`,
  });
} else {
  /* eslint-disable no-console */
  (Sentry as any).captureException = (e: any) => console.error(e);
  (Sentry as any).captureMessage = (m: any) => console.error(m);
  /* eslint-enable no-console */
}

const rootElement = document.getElementById("root")!;
ReactModal.setAppElement(rootElement);

ReactDOM.render(
  <BrowserRouter>
    <HelmetProvider>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </HelmetProvider>
  </BrowserRouter>,
  rootElement
);
