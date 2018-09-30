import React from 'react';
import ServiceEntry from './ServiceEntry';
import ResourceEntry from './ResourceEntry';

const SearchRow = ({ hit }) => {
  let entry = null;
  switch (hit.type) {
    case 'service':
      entry = <ServiceEntry hit={hit} />;
      break;
    case 'resource':
      entry = <ResourceEntry hit={hit} />;
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
