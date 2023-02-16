import React from "react";

interface DatatableProps<T = any> {
  rows: T[];
  rowRenderer: (row: T) => JSX.Element;
}

export const Datatable = <T extends unknown>({
  rows,
  rowRenderer,
}: DatatableProps<T>) => (
  <table>
    <tbody>{rows.map((row) => rowRenderer(row))}</tbody>
  </table>
);
