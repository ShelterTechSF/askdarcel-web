import React, { Component } from 'react';
import { InstantSearch } from 'react-instantsearch/dom';
import config from '../../config';
import OpenNowFilter from './OpenNowFilter';
import RefinementListFilter from './RefinementListFilter';

import SearchResults from './SearchResults/SearchResults';
import styles from './ServiceDiscoveryResults.scss';


export default class ServiceDiscoveryResults extends Component {
  constructor(props) {
    super(props);

    const {
      eligibilities,
      selectedEligibilities,
      subcategories,
      selectedSubcategories,
    } = props;

    const initialEligibilityRefinement = eligibilities
      .filter(elg => selectedEligibilities[elg.id]).map(e => e.name);
    const initialSubcategoriesRefinement = subcategories
      .filter(elg => selectedSubcategories[elg.id]).map(e => e.name);

    this.state = {
      openNow: false,
      initialEligibilityRefinement,
      initialSubcategoriesRefinement,
      searchState: { query: 'food' },
    };

    // this.handleClearAllClick = this.handleClearAllClick.bind(this);
    this.handleOpenNowClick = this.handleOpenNowClick.bind(this);
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
  }

  onSearchStateChange(nextSearchState) {
    this.setState({ searchState: nextSearchState });
  }

  // handleClearAllClick() {

  // }

  handleOpenNowClick() {
    const { openNow } = this.state;
    this.setState({
      openNow: !openNow,
    });
  }

  render() {
    const {
      eligibilities, selectedEligibilities, subcategories, selectedSubcategories, categoryName,
    } = this.props;

    const {
      initialEligibilityRefinement,
      initialSubcategoriesRefinement,
      searchState,
    } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{categoryName}</h1>
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
              {/* <div
                role="button"
                tabIndex="0"
                className={styles.clearAll}
                onClick={this.handleClearAllClick}
              >
              Clear all
              </div> */}
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Availability</div>
                <OpenNowFilter attribute="open_times" />
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Eligibilities</div>
                <RefinementListFilter
                  attribute="eligibilities"
                  availableOptions={eligibilities}
                  selectedOptions={selectedEligibilities}
                  defaultRefinement={initialEligibilityRefinement}
                />
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Categories</div>
                <RefinementListFilter
                  attribute="categories"
                  availableOptions={subcategories}
                  selectedOptions={selectedSubcategories}
                  defaultRefinement={initialSubcategoriesRefinement}
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
