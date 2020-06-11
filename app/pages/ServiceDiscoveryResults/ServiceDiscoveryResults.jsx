import React, { Component } from 'react';
import { InstantSearch } from 'react-instantsearch/dom';
import config from '../../config';

import SearchResults from './SearchResults/SearchResults';
import styles from './ServiceDiscoveryResults.scss';


export default class ServiceDiscoveryResults extends Component {
  constructor(props) {
    super(props);

    const {
      selectedEligibilities,
      // selectedSubcategories,
    } = props;

    this.state = {
      openNow: false,
      selectedEligibilities,
      // TODO: will we have a subcategory filter too?
      // selectedSubcategories,
      searchState: { query: 'food' },
    };

    this.handleClearAllClick = this.handleClearAllClick.bind(this);
    this.handleEligibilityClick = this.handleEligibilityClick.bind(this);
    this.handleOpenNowClick = this.handleOpenNowClick.bind(this);
  }

  handleClearAllClick() {
    this.setState({
      openNow: false,
      selectedEligibilities: {},
    });
  }

  handleOpenNowClick() {
    const { openNow } = this.state;
    this.setState({
      openNow: !openNow,
    });
  }

  handleEligibilityClick(optionId) {
    const { selectedEligibilities } = this.state;
    this.setState({
      selectedEligibilities: {
        ...selectedEligibilities,
        [optionId]: !selectedEligibilities[optionId],
      },
    });
  }

  render() {
    const { eligibilities } = this.props;

    const {
      openNow,
      selectedEligibilities,
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
            <div
              role="button"
              tabIndex="0"
              className={styles.clearAll}
              onClick={this.handleClearAllClick}
            >
              Clear all
            </div>
            <div className={styles.filterGroup}>
              <div className={styles.filterTitle}>Availability</div>
              <label key="openNow" className={styles.checkBox}>
                Open Now
                <input type="checkbox" name="openNow" id="openNow" checked={openNow} onChange={this.handleOpenNowClick} />
              </label>
            </div>

            <div className={styles.filterGroup}>
              <div className={styles.filterTitle}>Eligibilities</div>
              {eligibilities.map(eligibility => (
                <label key={eligibility.id} className={styles.checkBox}>
                  {eligibility.name}
                  <input
                    type="checkbox"
                    name={eligibility.name}
                    id={eligibility.id}
                    checked={selectedEligibilities[eligibility.id]}
                    onChange={() => this.handleEligibilityClick(eligibility.id)}
                  />
                </label>
              ))}
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
