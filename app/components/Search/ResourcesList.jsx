import React from 'react';
import ResourcesRow from './ResourcesRow';


const ResourcesList = function ResourcesList({ location, resources, resultsPerPage, page, categoryId }) {
  let resourcesRows = resources.map((resource, index) => {
    return (
        <ResourcesRow resource={resource} key={index} number={index + 1 + (resultsPerPage * page)} location={location || {}} categoryId={categoryId} />
    );
  });

  return (
    <ul className="results-table-entries">
      {resourcesRows}
    </ul>
  );
}

export default ResourcesList;
