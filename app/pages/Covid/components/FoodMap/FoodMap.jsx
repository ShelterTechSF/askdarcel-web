import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './FoodMap.scss';
import FoodResourcesSearchResults from '../FoodResourcesSearchResults/FoodResourcesSearchResults';
import { exampleJSON } from './StaticSearchResultsDebug';

export default class FoodMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openNow: false,
      experiencingHomelessness: false,
      childrenYouthOrFamily: false,
      seniorOrPersonsWithDisabilities: false,
      lowIncome: false,
    };
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

  render() {
    const {
      openNow,
      experiencingHomelessness,
      childrenYouthOrFamily,
      seniorOrPersonsWithDisabilities,
      lowIncome,
    } = this.state;
    let resultLength;
    if (exampleJSON) {
      resultLength = Object.keys(exampleJSON).length;
    } else {
      resultLength = 0;
    }
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
          <FoodResourcesSearchResults searchResults={exampleJSON} />
        </div>
      </div>
    );
  }
}
