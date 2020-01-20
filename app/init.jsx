import React from 'react';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import * as Sentry from '@sentry/browser';
import configureStore, { history } from './store/configureStore';
import config from './config';
import App from './components/App';
import ScrollToTop from './components/layout/ScrollToTop';

require('instantsearch.css/themes/reset.css');
require('./styles/main.scss');

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: `https://${config.SENTRY_PUBLIC_KEY}@sentry.io/${config.SENTRY_PROJECT_ID}` });
} else {
  // If Sentry is not enabled, use console instead.
  Sentry.captureException = e => console.error(e);
  Sentry.captureMessage = m => console.error(m);
}

const store = configureStore();
const googleAnalyticsId = (process.env.NODE_ENV === 'production' || window.location.host === 'www.askdarcel.org') ? 'UA-116318550-1' : 'UA-116318550-2';

ReactGA.initialize(googleAnalyticsId);
history.listen(loc => {
  const page = loc.pathname + loc.search;
  ReactGA.set({ page });
  ReactGA.pageview(loc.pathname);
});

ReactDOM.render((
  <Provider store={store} key="provider">
    <ConnectedRouter history={history}>
      <ScrollToTop>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ScrollToTop>
    </ConnectedRouter>
  </Provider>
), document.getElementById('root'));
