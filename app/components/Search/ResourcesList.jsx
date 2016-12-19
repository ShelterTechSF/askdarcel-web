import React from 'react';
import ResourcesRow from './ResourcesRow';


const ResourcesList = function ResourcesList({ location, resources, resultsPerPage, page }) {
  let resourcesRows = resources.map((resource, index) => {
    return (
        <ResourcesRow resource={resource} key={index} number={index + 1 + (resultsPerPage * page)} location={location || {}}/>
    );
  });

  return (
    <ul className="results-table-entries">
      {resourcesRows}
    </ul>
  );
}

export default ResourcesList;
