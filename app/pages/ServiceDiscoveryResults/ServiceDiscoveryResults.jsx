import React, { Component } from 'react';
import { InstantSearch } from 'react-instantsearch/dom';
import config from '../../config';
import OpenNowFilter from './OpenNowFilter';
import EligibilitiesListFilter from './EligibilitiesListFilter';

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
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
  }

  onSearchStateChange(nextSearchState) {
    this.setState({ searchState: nextSearchState });
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
      selectedEligibilities,
      searchState,
    } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Food resources</h1>
        </div>
        <InstantSearch
          appId={config.ALGOLIA_APPLICATION_ID}
          apiKey={config.ALGOLIA_READ_ONLY_API_KEY}
          indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
          searchState={searchState}
          onSearchStateChange={this.onSearchStateChange}
        >
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
                <OpenNowFilter attribute="open_times" />
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Eligibilities</div>
                <EligibilitiesListFilter
                  attribute="eligibilities"
                  limit={100}
                  availableEligibilities={eligibilities}
                  selectedEligibilities={selectedEligibilities}
                />
              </div>

            </div>
            <div className={styles.results}>
              <SearchResults />
            </div>
          </div>
        </InstantSearch>
      </div>
    );
  }
}
