import React from 'react';

interface DatatableProps<T = any> {
  rows: T[];
  rowRenderer: (row: T) => JSX.Element;
}

export function Datatable<T extends unknown>({ rows, rowRenderer }: DatatableProps<T>) {
  return (
    <table>
      <tbody>
        { rows.map(row => rowRenderer(row)) }
      </tbody>
    </table>
  );
}
