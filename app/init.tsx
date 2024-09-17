import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CookiesProvider } from "react-cookie";

import { App } from "./App";

require("instantsearch.css/themes/reset.css");
require("./styles/main.scss");

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);
root.render(
  <BrowserRouter>
    <HelmetProvider>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </HelmetProvider>
  </BrowserRouter>
);
