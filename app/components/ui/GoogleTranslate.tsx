import React from "react";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet-async";

export const GoogleTranslate = ({
  languages,
  queryLangCode,
}: {
  languages: readonly string[];
  queryLangCode: string | null;
}) => {
  const [, setCookie] = useCookies(["googtrans"]);

  if (languages.length > 0) {
    // Google Translate determines translation source and target
    // with a "googtrans" cookie.
    // When the user navigates with a `lang` query param,
    // interpret that as an explicit ask to translate the site
    // into that target language.
    if (queryLangCode && languages.includes(queryLangCode)) {
      setCookie("googtrans", `/en/${queryLangCode}`, { path: "/" });
    }

    return (
      <li>
        <Helmet>
          <script type="text/javascript">
            {`
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  includedLanguages: '${languages.join(",")}',
                  pageLanguage: 'en',
                }, 'google_translate_element');
              }
            `}
          </script>
          <script
            type="text/javascript"
            src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          />
        </Helmet>
        <div id="google_translate_element" />
      </li>
    );
  }

  return null;
};
