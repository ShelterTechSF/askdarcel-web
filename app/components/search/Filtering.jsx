import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { getCurrentDayTime } from '../../utils/index';
import FacetRefinementList from './FacetRefinementList';
import { eligibilitiesMapping, categoriesMapping } from '../../utils/refinementMappings';
import filters_icon from '../../assets/img/filters-icon.png';
import './Filtering.scss';

class Filtering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openNow: false,
      filtersActive: false,
      oldPathname: '',
      oldSearch: '',
    };
  }

  toggleOpenNow = () => {
    const currentDayTime = getCurrentDayTime();
    const currentLocation = browserHistory.getCurrentLocation();
    const { pathname } = currentLocation;
    const { search } = currentLocation;
    const { oldPathname, oldSearch, openNow: currentValue } = this.state;


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

  setFiltersActive = filtersActive => this.setState({ filtersActive })

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
            <button
              className={`refine-btn ${filtersActive ? 'active' : ''}`}
              onClick={() => this.setFiltersActive(!filtersActive)}
              type="button"
            >
                Filters
            </button>
            <button
              className={`filter-chip ${openNow ? 'active' : ''}`}
              onClick={this.toggleOpenNow}
              type="button"
            >
              Open now
            </button>
            <div className={`custom-refinement ${filtersActive ? 'active' : ''}`}>
              {/* FacetRefinementList is a generalized refinement list for filtering
                  limit={100} indicates the limit of facet values Algolia returns. default is 10
                  mapping={...} indicates the filter mappings to use; it maps
                  {key: list of facet values}
               */}
              <FacetRefinementList attribute="eligibilities" limit={100} mapping={eligibilitiesMapping} />
              <FacetRefinementList attribute="categories" limit={100} mapping={categoriesMapping} />
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
