import React, { Component } from 'react';
import { InstantSearch } from 'react-instantsearch/dom';
import config from '../../config';

import SearchResults from './SearchResults/SearchResults';
import styles from './ServiceDiscoveryResults.scss';


export default class ServiceDiscoveryResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openNow: false,
      experiencingHomelessness: false,
      childrenYouthOrFamily: false,
      seniorOrPersonsWithDisabilities: false,
      lowIncome: false,
      searchState: { query: 'food' },
    };
  }

  render() {
    const {
      openNow,
      experiencingHomelessness,
      childrenYouthOrFamily,
      seniorOrPersonsWithDisabilities,
      lowIncome,
      searchState,
    } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Food resources</h1>
        </div>
        <div className={styles.flexContainer}>
          <div className={styles.sidebar}>
            <div className={styles.filterResourcesTitle}>Filter Resources</div>
            <div className={styles.clearAll}>Clear all</div>

            <div className={styles.filterGroup}>
              <div className={styles.filterTitle}>Availability</div>
              <label key="openNow" className={styles.checkBox}>
                Open Now
                <input type="checkbox" name="openNow" id="openNow" checked={openNow} />
              </label>
            </div>

            <div className={styles.filterGroup}>
              <div className={styles.filterTitle}>Eligibilities</div>
              <label key="experiencingHomelessness" className={styles.checkBox}>
               Experiencing homelessness
                <input type="checkbox" name="experiencingHomelessness" id="experiencingHomelessness" checked={experiencingHomelessness} />
              </label>
              <label key="childrenYouthOrFamily" className={styles.checkBox}>
            Children, youth, or family
                <input type="checkbox" name="childrenYouthOrFamily" id="childrenYouthOrFamily" checked={childrenYouthOrFamily} />
              </label>
              <label key="seniorOrPersonsWithDisabilities" className={styles.checkBox}>
                <div>
                  {"Senior or person's with disabilities"}
                </div>
                <input type="checkbox" name="seniorOrPersonsWithDisabilities" id="seniorOrPersonsWithDisabilities" checked={seniorOrPersonsWithDisabilities} />
              </label>
              <label key="lowIncome" className={styles.checkBox}>
                Low-income
                <input type="checkbox" name="lowIncome" id="lowIncome" checked={lowIncome} />
              </label>
            </div>

          </div>
          <div className={styles.results}>
            <InstantSearch
              appId={config.ALGOLIA_APPLICATION_ID}
              apiKey={config.ALGOLIA_READ_ONLY_API_KEY}
              indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
              searchState={searchState}
            >
              <SearchResults />
            </InstantSearch>
          </div>
        </div>
      </div>
    );
  }
}
