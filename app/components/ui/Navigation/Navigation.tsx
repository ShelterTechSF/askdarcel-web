import React from "react";
import { Link } from "react-router-dom";
import styles from "components/ui/Navigation/Navigation.module.scss";
import desktopNavigationStyles from "components/ui/Navigation/DesktopNavigation.module.scss";
import DropdownMenu from "components/ui/Navigation/DropdownMenu";
import { MobileNavigation } from "components/ui/Navigation/MobileNavigation";
import {
  ExtractedNavigationMenusFromNavigationResponse,
  extractLogoFromNavigationResponse,
  extractNavigationMenusFromNavigationResponse,
  NavigationMenu,
} from "models/Strapi";
import { useNavigationData } from "hooks/StrapiAPI";
import { Router } from "../../../Router";
import NavigationFocusReset from "./NavigationFocusReset";
import SkipButton from "./SkipButton";
import TopBanner from "./TopBanner";
import { SiteSearchInput } from "components/ui/SiteSearchInput";
import { InstantSearch } from "react-instantsearch-core";
import { liteClient } from "algoliasearch/lite";
import config from "./../../../config";
import { history as historyRouter } from "instantsearch.js/es/lib/routers";
import { Loader } from "components/ui/Loader";

const searchClient = liteClient(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY
);

const INDEX_NAME = `${config.ALGOLIA_INDEX_PREFIX}_services_search`;

export const Navigation = () => {
  const { data: navigationResponse } = useNavigationData();

  const logoData = extractLogoFromNavigationResponse(navigationResponse);
  const menuData =
    extractNavigationMenusFromNavigationResponse(navigationResponse);

  function menuItemHasLinks(
    menuItem: ExtractedNavigationMenusFromNavigationResponse[number]
  ): menuItem is NavigationMenu {
    return "link" in menuItem;
  }

  if (!menuData) {
    return <Loader />;
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={INDEX_NAME}
      routing={{
        router: historyRouter({
          windowTitle(routeState) {
            const query = routeState[INDEX_NAME]?.query;

            const queryTitle = query
              ? `Our415 - Search results for "${query}" in San Francisco`
              : "Our415 - Services in San Francisco";

            return queryTitle;
          },
        }),
      }}
    >
      <NavigationFocusReset />
      <SkipButton />
      <TopBanner />
      <div>
        <nav className={styles.siteNav}>
          <div className={styles.primaryRow}>
            <Link className={`${styles.navLogo}`} to="/">
              <img src={logoData?.url} alt={logoData?.alternativeText} />
            </Link>
            <SiteSearchInput />

            <MobileNavigation menuData={menuData} />
            <div className={styles.desktopNavigationContainer}>
              {menuData.map((menuDataItem) => {
                if (menuItemHasLinks(menuDataItem)) {
                  const links = menuDataItem.link.map((linkItem) => ({
                    id: linkItem.id,
                    url: linkItem.url,
                    text: linkItem.text,
                  }));

                  const uniqueKey = crypto.randomUUID();

                  return (
                    <DropdownMenu
                      key={uniqueKey}
                      id={uniqueKey}
                      title={menuDataItem.title}
                      links={links}
                    />
                  );
                }

                const uniqueKey = crypto.randomUUID();
                return (
                  <Link
                    key={uniqueKey}
                    to={menuDataItem.url}
                    className={desktopNavigationStyles.navigationMenuLink}
                  >
                    {menuDataItem.text}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
        <main className="container" id="main">
          <Router />
        </main>
      </div>
    </InstantSearch>
  );
};

export default Navigation;
