import React, { Component } from 'react';
import { InstantSearch, Configure } from 'react-instantsearch/dom';
import _ from 'lodash';
import config from '../../config';
import OpenNowFilter from './OpenNowFilter';
import RefinementListFilter from './RefinementListFilter';
import ClearAllFilters from './ClearAllFilters';

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
      initialEligibilityRefinement,
      initialSubcategoriesRefinement,
      searchState: { query: '' },
    };

    this.onSearchStateChange = this.onSearchStateChange.bind(this);
  }

  onSearchStateChange(nextSearchState) {
    this.setState({ searchState: nextSearchState });
  }

  render() {
    const {
      eligibilities,
      subcategories,
      categoryName,
      algoliaCategoryName,
    } = this.props;

    const {
      initialEligibilityRefinement,
      initialSubcategoriesRefinement,
      searchState,
    } = this.state;

    const subcategoryNames = subcategories.map(c => c.name);

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
          <Configure filters={`categories:'${algoliaCategoryName}'`} />
          <div className={styles.flexContainer}>
            <div className={styles.sidebar}>
              <div className={styles.filterResourcesTitle}>Filter Resources</div>
              <ClearAllFilters />
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Availability</div>
                <OpenNowFilter attribute="open_times" />
              </div>

              {!!eligibilities.length && (
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Eligibilities</div>
                <RefinementListFilter
                  attribute="eligibilities"
                  defaultRefinement={initialEligibilityRefinement}
                  transformItems={items => _.sortBy(items, ['label'])}
                />
              </div>
              )}

              {!!subcategories.length && (
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Categories</div>
                <RefinementListFilter
                  attribute="categories"
                  defaultRefinement={initialSubcategoriesRefinement}
                  transformItems={items => {
                    // Note that in Algolia, the categories attribute is for all
                    // categories, but for this page, we only want to display
                    // the specific subcategories of the target category, not
                    // all categories that the services are tagged with.
                    // We filter down the categories list from Algolia to just
                    // the subcategories.
                    const subcategoryItems = items.filter(
                      item => subcategoryNames.include(item.label),
                    );
                    return _.sortBy(subcategoryItems, ['label']);
                  }}
                />
              </div>
              )}

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
