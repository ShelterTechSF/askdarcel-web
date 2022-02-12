import React from 'react';
import SearchEntry from './SearchEntry';

const SearchRow = ({
  hit, index, page, hitsPerPage,
}) => {
  const hitNumber = `${page * hitsPerPage + index + 1}`;
  let entry = null;
  switch (hit.type) {
    case 'service':
      entry = <SearchEntry hitNumber={hitNumber} hit={hit} />;
      break;
    case 'resource':
      entry = <SearchEntry hitNumber={hitNumber} hit={hit} />;
      break;
    default:
    // eslint-disable-next-line no-console
      console.log('Support for the following entry is not supported yet:', hit.type);
  }

  return (
    <ul>
      {entry}
    </ul>
  );
};


export default SearchRow;
