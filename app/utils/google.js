/* eslint-disable */
(function () {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `https://maps.googleapis.com/maps/api/js?v=3&key=${CONFIG.GOOGLE_API_KEY}`;
  document.body.appendChild(script);
}());
