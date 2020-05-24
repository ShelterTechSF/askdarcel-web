// import React from 'react';
// import { Link } from 'react-router-dom';
// import Iframe from 'react-iframe';
//
// import styles from './FoodMap.scss';
//
// import ImgSFGovLogo from './assets/SFGovLogo.png';
//
// const FoodResources = () => (
//   <div>
//     <article className={styles.mapContainer}>
//       <div className={styles.foodMapBannerCredit}>
//         <img
//           className={styles.SFGovLogo}
//           src={ImgSFGovLogo}
//           alt="SF Gov logo"
//         />
//         <span>
//           San Francisco EOC Food Resource Map
//         </span>
//       </div>
//       <section>
//         <Iframe
//           title="Covid-19 Food Guide"
//           url="https://sfgov.maps.arcgis.com/apps/webappviewer/index.html?id=bb080a525416426c9f96057a00367b4d"
//           allowFullScreen="yes"
//           padding="0pt"
//           className={styles.embedMap}
//         />
//       </section>
//     </article>
//     <div className={styles.foodBannerContainer}>
//       <Link to="/covid/foodlist">
//         View additional food resources in SFServiceGuide
//       </Link>
//     </div>
//   </div>
// );
//
// export default FoodResources;


import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  InstantSearch,
  Configure,
  SearchBox,
} from 'react-instantsearch/dom';
import styles from './FoodMap.scss';
import FoodResourcesSearchResults from '../FoodResourcesSearchResults/FoodResourcesSearchResults';
import { exampleJSON } from './StaticSearchResultsDebug';
import qs from 'qs';
import config from '../../../../config';
import { connect } from 'react-redux';
// import SearchResultsContainer from 'components/search/SearchResultsContainer';

export default class FoodMap extends Component {
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

    this.onSearchStateChange = this.onSearchStateChange.bind(this);
  }

  // componentDidMount() {
  //   const {
  //     openNow,
  //     experiencingHomelessness,
  //     childrenYouthOrFamily,
  //     seniorOrPersonsWithDisabilities,
  //     lowIncome,
  //   } = this.props;
  //
  //   this.setState({
  //     openNow,
  //     experiencingHomelessness,
  //     childrenYouthOrFamily,
  //     seniorOrPersonsWithDisabilities,
  //     lowIncome,
  //   });
  //   // some api call
  // }

  onSearchStateChange(nextSearchState) {
    const THRESHOLD = 700;
    const newPush = Date.now();
    const { history } = this.props;
    const { lastPush } = this.state;
    this.setState({ lastPush: newPush, searchState: nextSearchState });
    if (lastPush && newPush - lastPush <= THRESHOLD) {
      history.replace(
        nextSearchState ? `search?${qs.stringify(nextSearchState)}` : '',
      );
    } else {
      history.push(
        nextSearchState ? `search?${qs.stringify(nextSearchState)}` : '',
      );
    }
  }

  render() {
    const {
      openNow,
      experiencingHomelessness,
      childrenYouthOrFamily,
      seniorOrPersonsWithDisabilities,
      lowIncome,
      searchState,
      aroundLatLng,
    } = this.state;
    let resultLength;
    // if (exampleJSON) {
    //   resultLength = Object.keys(exampleJSON).length;
    // } else {
    //   resultLength = 0;
    // }

    const { userLocation } = this.props;
    const configuration = aroundLatLng ? (
      <Configure aroundLatLng={`${userLocation.lat}, ${userLocation.lng}`} />
    ) : (
      <Configure aroundLatLngViaIP aroundRadius="all" />
    );

    return (
      <div className={styles.foodResourcesContainer}>
        <div className={styles.foodResourcesTitle}>Food resources</div>
        <div className={styles.searchResultsAmount}>{`${resultLength} RESULTS`}</div>
        <div className={styles.borderLine} />
        <div className={styles.filterAndResults}>
          <div className={styles.filterResources}>
            <div className={styles.filterResourcesTitle}>Filter Resources</div>
            <div className={styles.clearAll}>Clear all</div>
            <div className={styles.checkBoxCategories}>
              <div className={styles.checkBoxCategory}>Availability</div>
              <label key="openNow" className={styles.checkBox}>
                Open Now
                <input type="checkbox" name="openNow" id="openNow" checked={openNow} />
              </label>
              <div className={styles.checkBoxCategory}>Eligibilities</div>
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
          <div className={styles.instantSearchOverride}>
            <InstantSearch
              appId={config.ALGOLIA_APPLICATION_ID}
              apiKey={config.ALGOLIA_READ_ONLY_API_KEY}
              indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
              searchState={searchState}
              // onSearchStateChange={this.onSearchStateChange}
            >
              {/*{configuration}*/}
              <FoodResourcesSearchResults />
            </InstantSearch>
          </div>
          {/*<div className={styles.instantSearchOverride}>*/}
          {/*  <InstantSearch*/}
          {/*    appId={config.ALGOLIA_APPLICATION_ID}*/}
          {/*    apiKey={config.ALGOLIA_READ_ONLY_API_KEY}*/}
          {/*    indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}>*/}
          {/*    <FoodResourcesSearchResults searchResults={exampleJSON} />*/}
          {/*  </InstantSearch>*/}
          {/*</div>*/}
        </div>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     userLocation: state.user.location,
//   };
// }

// export const FoodMap = withRouter(connect(mapStateToProps)(FoodMap));
