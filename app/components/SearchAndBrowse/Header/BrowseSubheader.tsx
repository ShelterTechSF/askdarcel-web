import React from "react";

import { Button } from "components/ui/inline/Button/Button";
import websiteConfig from "utils/websiteConfig";
import { CATEGORIES } from "pages/constants";
import DropdownMenu from "components/ui/Navigation/DropdownMenu";
import classNames from "classnames";

import styles from "./BrowseSubheader.module.scss";

const { showPrintResultsBtn } = websiteConfig;

interface Props {
  currentCategory: string;
}

// TODO: This should be the same as the dropdown links in the Navigation dropdown (which comes from Strapi)
const DROPDOWN_LINKS = CATEGORIES.map((category) => ({
  id: category.slug,
  url: `/${category.slug}/results`,
  text: category.name,
}));

export const BrowseSubheader = ({ currentCategory }: Props) => {
  const title = currentCategory;

  const uuid = crypto.randomUUID();

  return (
    <div className={classNames(styles.header, "no-print")}>
      <div className={styles.headerInner}>
        <div>
          <h1 className="sr-only">{title}</h1>
          <DropdownMenu
            id={uuid}
            title={title}
            links={DROPDOWN_LINKS}
            variant="category"
          />
        </div>
        <Button
          iconName="fas fa-print"
          iconVariant="before"
          variant="secondary"
          size="lg"
          onClick={() => {
            window.print();
          }}
          addClass={`${styles.printAllBtn} ${
            showPrintResultsBtn ? styles.showBtn : ""
          }`}
        >
          Print this page
        </Button>
      </div>
    </div>
  );
};
