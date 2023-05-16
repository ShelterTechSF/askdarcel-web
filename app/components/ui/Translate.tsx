import React from "react";
import { useLocation } from "react-router-dom";
import { whiteLabel } from "../../utils";
import { WeGlot } from "./WeGlot";
import { GoogleTranslate } from "./GoogleTranslate";

const Translate = () => {
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const targetLangCode = params.get("lang");

  if (whiteLabel.weGlot) {
    /**
     * Use WeGlot instead of Google Translate if configured.
     *
     * NOTE: checking `whiteLabel.availableLanguages` is not useful here,
     * the available languages are entirely pre-determined by the site's WeGlot config.
     */
    return (
      <WeGlot
        apiKey={whiteLabel.weGlot.apiKey}
        queryLangCode={targetLangCode}
      />
    );
  }
  // May return null if no translations enabled.
  return (
    <GoogleTranslate
      languages={whiteLabel.enabledTranslations}
      queryLangCode={targetLangCode}
    />
  );
};

export default Translate;
