import React, { Component } from 'react';
import { connect } from 'react-redux';
import FacetRefinementList from './FacetRefinementList';
import OpenNowRefinementList from './OpenNowRefinementList';
import { eligibilitiesMapping, categoriesMapping } from '../../utils/refinementMappings';
import filters_icon from '../../assets/img/filters-icon.png';
import './Filtering.scss';

class Filtering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtersActive: false,
    };
  }

  setFiltersActive(filtersActive) { return this.setState({ filtersActive }); }

  render() {
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
            <OpenNowRefinementList attribute="open_times" />
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
