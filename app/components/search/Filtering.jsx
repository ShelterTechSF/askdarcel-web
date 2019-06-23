import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { getCurrentDayTime } from '../../utils/index';
import EligibilitiesRefinementList from './EligibilitiesRefinementList';
import CategoriesRefinementList from './CategoriesRefinementList';
import filters_icon from '../../assets/img/filters-icon.png';

class Filtering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openNow: false,
      filtersActive: false,
      oldPathname: '',
      oldSearch: '',
    };
    this.toggleOpenNow = this.toggleOpenNow.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  toggleOpenNow() {
    const currentValue = this.state.openNow;
    const currentDayTime = getCurrentDayTime();
    const currentLocation = browserHistory.getCurrentLocation();
    const { pathname } = currentLocation;
    const { search } = currentLocation;
    const { oldPathname, oldSearch } = this.state;


    if (currentValue === true) {
      browserHistory.push({
        pathname: oldPathname,
        search: oldSearch,
      });
    } else {
      // save the current URL in this components state so we can use it when
      // 'Open now' is toggled off
      this.setState({ oldPathname: pathname, oldSearch: search });
      // refinementList[open_times][0]=F-11:30
      browserHistory.push({
        pathname,
        search: `${search}&refinementList[open_times][0]=${currentDayTime}`,
      });
    }
    // refinementList[open_times][0]=F-11:30
    this.setState({ openNow: !currentValue });
  }

  toggleFilters() {
    this.setState({filtersActive: !this.state.filtersActive});
  }

  render() {
    const { openNow } = this.state;
    const { filtersActive } = this.state;
    return (
      <div>
        <div className="filter-container flex-height">
          <div className="search-filters">
            <img
              src={filters_icon}
              alt="filters icon"
              className="filters-icon"
            />
            <a className={"refine-btn " + (filtersActive ? 'active' : '')}
                onClick={this.toggleFilters}>
                Filters
              </a>
            <button
              className={`filter-chip ${openNow ? 'active' : ''}`}
              onClick={this.toggleOpenNow}
            >
              Open now
            </button>
            <div className={"custom-refinement " + (filtersActive ? 'active' : '')}>
              <EligibilitiesRefinementList attribute="eligibilities" />
              <CategoriesRefinementList attribute="categories" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}

export default connect(mapStateToProps)(Filtering);
