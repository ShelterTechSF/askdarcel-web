import React from 'react';
import { Helmet } from 'react-helmet-async';

// This is a prototype component for testing out the Google Translate widget. The logic below
// dictates that this component only be displayed on staging; i.e. the widget will be displayed IF
// location.hostname === 'staging.sfserviceguide.org'.
//
// Note: At least while testing, this is a <li> element as it goes within the
// nav <ul> site links element.

const Translate = () => {
  const isStaging = window.location.hostname === 'staging.sfserviceguide.org';
  if (isStaging) {
    return (
      <li className="googleTranslateContainer">
        {/* todo: When we go live with Google Translate the scripts within this Helmet snippet
         /* maybe should be moved to index.html, depending on specific whitelabel needs too  */}
        <Helmet>
          <script type="text/javascript">
            {`
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'es,tl,zh-TW'}, 'google_translate_element');
              }
            `}
          </script>
          <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" />
        </Helmet>
        <div id="google_translate_element" />
      </li>
    );
  }

  return null;
};

export default Translate;
