import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const onLoad = (apiKey: string, targetLangCode: string | null) => {
  // HACK: suppress TS compile errors when accessing the global WeGlot instance created by the script.
  const weglot = (window as any).Weglot;
  weglot.initialize({
    api_key: apiKey,
    auto_switch: false,
    // Force WeGlot to avoid translating elements with this class
    excluded_blocks: [
      {
        value: ".notranslate",
      },
    ],
  });
  weglot.on("initialized", () => {
    /** `lang` query param should explicitly switch to the target language code.
     * NOTE that WeGlot uses their own two-char language codes [1]
     * instead of adhering to ISO 639-1 like Google does,
     * so the Referrers will need to know which codes to use.
     *
     * [1]: https://weglot.com/documentation/available-languages/
     */
    if (targetLangCode) {
      weglot.switchTo(targetLangCode);
    }
  });
  // NOTE: for debugging, try adding a `weglot.on("languageChanged", (newLang, prevLang) => {}) hook.
};

const WEGLOT_SRC = "https://cdn.weglot.com/weglot.min.js";

export const WeGlot = ({
  apiKey,
  queryLangCode,
}: {
  apiKey: string;
  queryLangCode: string | null;
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  /**
   * See the issue and the workaround: https://github.com/nfl/react-helmet/issues/146#issuecomment-513793628
   * Basically: the WeGlot logic depends on loading a cdn.weglot.com script
   * which sets a `Weglot` variable in the global window context.
   * WeGlot's official guidance is to place that script and any init logic directly into the <head> like so:
   *
   * <script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
   * <script>
   *   // initialization logic
   *   Weglot.initialize({
         api_key: API_KEY,
   *   });
   * </script>
   *
   * because <head> normally loads and executes scripts sequentially, so the global Weglot object will actually be usable in our custom init logic.
   * However, React Helmet assumes it can async load the scripts
   * and doesn't offer an API for script dependencies inside the <head>.
   * Instead, when the cdn.weglot.com script is added on the client, add an event listener when it loads
   * to trigger a React effect to run the Weglot initialization logic above.
   */
  const handleChangeClientState = (newState, addedTags) => {
    if (addedTags && addedTags.scriptTags) {
      const foundScript = addedTags.scriptTags.find(
        ({ src }) => src === WEGLOT_SRC
      );
      if (foundScript) {
        foundScript.addEventListener(
          "load",
          () => {
            setScriptLoaded(true);
          },
          { once: true }
        );
      }
    }
  };

  useEffect(() => {
    if (scriptLoaded) {
      onLoad(apiKey, queryLangCode);
    }
  }, [scriptLoaded, apiKey, queryLangCode]);

  return (
    <Helmet onChangeClientState={handleChangeClientState}>
      <script type="text/javascript" src={WEGLOT_SRC} />
    </Helmet>
  );
};
