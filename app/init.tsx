import React from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CookiesProvider } from "react-cookie";

import { App } from "./App";

require("instantsearch.css/themes/reset.css");
require("./styles/main.scss");

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
