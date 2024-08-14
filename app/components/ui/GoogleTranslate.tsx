/* eslint-disable react-hooks/exhaustive-deps -- allows empty array argument in useEffect */
/* eslint-disable no-new -- allows calling `new` for initializer */

import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";

/**
 * A Google translate widget component for use across multiple components
 *
 * Normally it is difficult to mount a widget like this into multiple components or HTML targets. By dynamically
 * adding the third-party scripts and initializing on demand, we can render the widget into both desktop and mobile
 * navigation view.
 */

declare const window: {
  googleTranslateElementInit: () => void;
} & Window;

const SUPPORTED_LANGUAGES = ["en", "es", "tl", "zh-TW"];
const GOOGLE_TRANSLATE_CONFIG = {
  includedLanguages: `${SUPPORTED_LANGUAGES.join(",")}`,
  pageLanguage: "auto/en",
};

export const GoogleTranslate = () => {
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const targetLangCode = params.get("lang");
  const [, setCookie] = useCookies(["googtrans"]);

  useEffect(() => {
    function googleTranslateElementInit() {
      new (window as any).google.translate.TranslateElement(
        GOOGLE_TRANSLATE_CONFIG,
        "google_translate_element"
      );
    }

    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  // TODO @rosschapman: Let's explore this use case, this may not be something we care about supporting?
  // Google Translate determines translation source and target
  // with a "googtrans" cookie.
  // When the user navigates with a `lang` query param,
  // interpret that as an explicit ask to translate the site
  // into that target language.
  if (targetLangCode && SUPPORTED_LANGUAGES.includes(targetLangCode)) {
    setCookie("googtrans", `/en/${targetLangCode}`, { path: "/" });
  }

  return <div id="google_translate_element" />;
};
