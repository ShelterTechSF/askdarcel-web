import React from 'react';
import PropTypes from 'prop-types';

const LandingPageCard = props => (
  <a
    href={props.query || props.resource}
    className="landing-page-card"
  >
    <h1 className="landing-page-card__title">{props.title}</h1>
    <div className={`landing-page-card__image ${props.imgClass}`} />
    <h2 className="landing-page-card__content">{props.content}</h2>
  </a>
);

LandingPageCard.props = {
  title: PropTypes.string,
  query: PropTypes.string,
  resource: PropTypes.string,
  content: PropTypes.string,
  imgClass: PropTypes.string,
};

const LandingPageTextCard = props => (
  <a
    href={props.query || props.resource}
    className="landing-page-text-card"
  >
    <h1 className="landing-page-text-card__title">{props.title}</h1>
  </a>
);

LandingPageTextCard.props = {
  title: PropTypes.string,
  query: PropTypes.string,
  resource: PropTypes.string,
  content: PropTypes.string,
};

export { LandingPageCard, LandingPageTextCard };
