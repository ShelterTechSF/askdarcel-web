import React, { ReactNode } from "react";
import styles from "./InfoTable.module.scss";

interface InfoTableProps<T = unknown> {
  rows?: T[];
  rowRenderer?: (row: T) => JSX.Element;
  children?: ReactNode;
}

export const InfoTable = <T,>({
  rows,
  rowRenderer,
  children,
}: InfoTableProps<T>) => {
  const useRowRenderer = !children && rows && rowRenderer;

  return (
    <table className={styles.infoTable}>
      <tbody>
        {children}
        {useRowRenderer && rows.map((row) => rowRenderer(row))}
      </tbody>
    </table>
  );
};
