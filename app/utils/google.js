/* eslint-disable */

import config from '../config';

(function () {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `https://maps.googleapis.com/maps/api/js?v=3&key=${config.GOOGLE_API_KEY}`;
  document.body.appendChild(script);
})();
