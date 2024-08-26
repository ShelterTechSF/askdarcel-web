import React from "react";
import { Link } from "react-router-dom";
import desktopNavigationStyles from "components/ui/Navigation/DesktopNavigation.module.scss";
import DropdownMenu from "./DropdownMenu";

import {
  StrapiModel,
  ExtractedNavigationMenusFromNavigationResponse,
} from "../../../models/Strapi";

function menuItemHasLinks(
  menuItem: ExtractedNavigationMenusFromNavigationResponse[number]
): menuItem is StrapiModel.NavigationMenu {
  return "link" in menuItem;
}

const DesktopMenuItems = ({
  menuItem,
}: {
  menuItem: ExtractedNavigationMenusFromNavigationResponse[number];
}) => {
  if (menuItemHasLinks(menuItem)) {
    const uniqueKey = menuItem.title;
    const links = menuItem.link.map((linkItem) => ({
      id: linkItem.id,
      url: linkItem.url,
      text: linkItem.text,
    }));

    return (
      <DropdownMenu
        title={menuItem.title}
        links={links}
        uniqueKey={uniqueKey}
      />
    );
  }

  const uniqueKey = menuItem.url;
  return (
    <Link
      key={uniqueKey}
      to={menuItem.url}
      className={desktopNavigationStyles.navigationMenuLink}
    >
      {menuItem.text}
    </Link>
  );
};

export default DesktopMenuItems;
