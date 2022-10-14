import React from 'react';
import { Helmet } from 'react-helmet-async';
import { whiteLabel } from '../../utils';

const Translate = () => {
  if (whiteLabel.enableTranslation) {
    return (
      <li>
        <Helmet>
          <script type="text/javascript">
            {`
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({includedLanguages: 'en,es,tl,zh-TW'}, 'google_translate_element');
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
