import React from 'react';

interface DatatableProps<T = any> {
  rows: T[];
  rowRenderer: (row: T) => JSX.Element;
}

export const Datatable = ({ rows, rowRenderer }: DatatableProps) => {
  return (
    <table>
      <tbody>
        { rows.map(row => rowRenderer(row)) }
      </tbody>
    </table>
  );
};
