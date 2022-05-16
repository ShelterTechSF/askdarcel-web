import React from 'react';
import { Helmet } from 'react-helmet-async';

// This is a prototype component for testing out the Google Translate widget. The logic below
// dictates that this component only be displayed on staging; i.e. the widget will be displayed IF
// location.hostname === 'staging.sfserviceguide.org'. To test locally point
// staging.sfserviceguide.org to your local host IP in your /etc/hosts file; i.e.,
// 127.0.0.1       staging.sfserviceguide.org
// Then, navigate to http://staging.sfserviceguide.org:8080 to see the widget.
//
// Note: At least while testing, this is an <li> element as it strictly goes within the
// nav <ul> site links element.

const Translate = () => {
  const isStaging = window.location.hostname === 'staging.sfserviceguide.org';
  if (isStaging) {
    return (
      <li className="googleTranslateContainer">
        {/* todo: When we go live with Google Translate OR we have a dedicated test environment,
                  the scripts within this Helmet snippet should be moved to index.html  */}
        <Helmet>
          <script type="text/javascript">{`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'es,tl,zh-TW'}, 'google_translate_element');
            }
          `}</script>
          <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        </Helmet>
        <div id="google_translate_element"></div>
      </li>
    );
  }

  return null
};

export default Translate;
