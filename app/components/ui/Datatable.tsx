import React from 'react';

interface DatatableProps<T = any> {
  rows: T[];
  rowRenderer: (row: T) => JSX.Element;
}

export const Datatable = ({ rows, rowRenderer }: DatatableProps) => (
  <table>
    <tbody>
      { rows.map(row => rowRenderer(row)) }
    </tbody>
  </table>
);
