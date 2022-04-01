import React from 'react';
import { Helmet } from 'react-helmet-async';

const Translate = () => {
  return <div className="googleTranslateContainer">
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
  </div>
};

export default Translate;
