import React from 'react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { whiteLabel } from '../../utils';

const INCLUDED_LANGUAGES = ['en', 'es', 'tl', 'zh-TW'];
const INCLUDED_LANGUAGES_STR = INCLUDED_LANGUAGES.join(',');

const Translate = () => {
  const [, setCookie] = useCookies(['googtrans']);
  const { search } = useLocation();

  if (whiteLabel.enableTranslation) {
    // Google Translate determines translation source and target
    // with a "googtrans" cookie.
    // When the user navigates with a `lang` query param,
    // interpret that as an explicit ask to translate the site
    // into that target language.
    const params = new URLSearchParams(search);
    const targetLangCode = params.get('lang');
    if (targetLangCode && INCLUDED_LANGUAGES.includes(targetLangCode)) {
      setCookie('googtrans', `/en/${targetLangCode}`, { path: '/' });
    }

    return (
      <li>
        <Helmet>
          <script type="text/javascript">
            {`
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  includedLanguages: '${INCLUDED_LANGUAGES_STR}',
                  pageLanguage: 'en',
                }, 'google_translate_element');
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
