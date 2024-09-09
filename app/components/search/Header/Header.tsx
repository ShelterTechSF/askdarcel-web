import React from "react";

import { Button } from "components/ui/inline/Button/Button";
import websiteConfig from "utils/websiteConfig";
import { CATEGORIES } from "pages/constants";
import DropdownMenu from "components/ui/Navigation/DropdownMenu";

import styles from "./Header.module.scss";

const { showPrintResultsBtn } = websiteConfig;

interface Props {
  currentCategory?: string;
}

const DROPDOWN_LINKS = [
  {
    id: "all-categories",
    url: "/search",
    text: "All categories",
  },
  ...CATEGORIES.map((category) => ({
    id: category.slug,
    url: `/${category.slug}/results`,
    text: category.name,
  })),
];
export const Header = ({ currentCategory }: Props) => {
  const title = currentCategory || "All categories";

  const uuid = crypto.randomUUID();

  return (
    <div className={styles.header}>
      <div className={styles.headerInner}>
        <div>
          <h1 className="sr-only">
            {title === currentCategory ?? "Search results"}
          </h1>
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
