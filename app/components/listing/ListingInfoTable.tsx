import React from "react";
import styles from "./ListingInfoTable.module.scss";

interface ListingInfoTableProps<T = any> {
  rows: T[];
  rowRenderer: (row: T) => JSX.Element;
}

export const ListingInfoTable = <T extends unknown>({
  rows,
  rowRenderer,
}: ListingInfoTableProps<T>) => {
  return (
    <table className={styles.ListingInfoTable}>
      <tbody>{rows.map((row) => rowRenderer(row))}</tbody>
    </table>
  );
};
