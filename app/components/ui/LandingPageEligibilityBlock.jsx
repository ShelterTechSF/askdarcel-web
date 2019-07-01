import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { eligibilitiesMapping } from '../../utils/refinementMappings';
import 'url-search-params-polyfill';

const buildBlockUrl = eligibility => {
  const search_params = new URLSearchParams();
  const eligibilityElements = eligibilitiesMapping[eligibility];
  eligibilityElements.forEach((element, index) => {
    search_params.append(`refinementList[eligibilities][${index}]`, element);
  });
  return `/search?${search_params.toString()}`;
};

const LandingPageEligibilityBlock = ({ eligibilities }) => (
  <div className="landing-page-eligibility-block">
    <div className="landing-page-eligibility-block__resources">
      <h2 className="landing-page-eligibility-block__resources__title">
            Discover resources by eligibility
      </h2>
      {/* <a className="scroll-button scroll-button-left">&lt;</a> */}
      <div className="landing-page-eligibility-block__resources-scroller">
        { eligibilities.map(eligibility => (
          <LandingPageCard
            key={eligibility.id}
            name={eligibility.name}
            count={eligibility.service_count}
            url={buildBlockUrl(eligibility.name)}
          />
        ))
        }
      </div>
      {/* <a className="scroll-button scroll-button-right">&gt;</a> */}
    </div>
  </div>
);

LandingPageEligibilityBlock.props = {
  eligibilities: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    feature_rank: PropTypes.number,
    service_count: PropTypes.number,
  }),
};

const LandingPageCard = ({ count, name, url }) => (
  <Link
    to={url}
    className="landing-page-eligibility-card"
  >
    <h2 className="landing-page-eligibility-card__title">{name}</h2>
    <span className="card-count">{count}</span>
  </Link>
);

LandingPageEligibilityBlock.props = {
  count: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default LandingPageEligibilityBlock;
