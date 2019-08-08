import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { eligibilitiesMapping } from '../../utils/refinementMappings'

class LandingPageEligibilityBlock extends Component {

  buildBlockUrl(eligibility) {
    let url = '/search?'
    const eligibilityElements = eligibilitiesMapping[eligibility];
    eligibilityElements.forEach((element, index) => {
      url += `refinementList[eligibilities][${index}]=${encodeURIComponent(element)}&`;
    });
    return url;
  }

  render() {
    // TODO Properly implement horizontal scroll buttons if we ever get > 6 eligibilities
    return (
      <div className="landing-page-eligibility-block">
        <div className="landing-page-eligibility-block__resources">
          <h2 className="landing-page-eligibility-block__resources__title">
            Discover resources by eligibility
          </h2>
          {/* <a className="scroll-button scroll-button-left">&lt;</a> */}
          <div className="landing-page-eligibility-block__resources-scroller">
            { this.props.eligibilities.map(eligibility => (
              <LandingPageCard
                key={eligibility.id}
                name={eligibility.name}
                count={eligibility.service_count}
                url={this.buildBlockUrl(eligibility.name)}
              />
            ))
            }
          </div>
          {/* <a className="scroll-button scroll-button-right">&gt;</a> */}
        </div>
      </div>
    );
  }
}

LandingPageEligibilityBlock.props = {
  eligibilities: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    feature_rank: PropTypes.number,
    service_count: PropTypes.number,
  }),
};

const LandingPageCard = props => (
  <Link
    to={props.url}
    className="landing-page-eligibility-card"
  >
    <h2 className="landing-page-eligibility-card__title">{props.name}</h2>
    <span className="card-count">{props.count}</span>
  </Link>
);

LandingPageEligibilityBlock.props = {
  name: PropTypes.string,
};

export default LandingPageEligibilityBlock;
