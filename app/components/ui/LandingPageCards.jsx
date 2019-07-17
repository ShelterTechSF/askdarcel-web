import React from 'react';
import PropTypes from 'prop-types';

const LandingPageCard = ({
  query, resource, title, imgClass, content,
}) => (
  <a
    href={query || resource}
    className="landing-page-card"
  >
    <h1 className="landing-page-card__title">{title}</h1>
    <div className={`landing-page-card__image ${imgClass}`} />
    <h2 className="landing-page-card__content">{content}</h2>
  </a>
);

LandingPageCard.props = {
  title: PropTypes.string,
  query: PropTypes.string,
  resource: PropTypes.string,
  content: PropTypes.string,
  imgClass: PropTypes.string,
};

const LandingPageTextCard = ({ query, resource, title }) => (
  <a
    href={query || resource}
    className="landing-page-text-card"
  >
    <h1 className="landing-page-text-card__title">{title}</h1>
  </a>
);

LandingPageTextCard.props = {
  title: PropTypes.string,
  query: PropTypes.string,
  resource: PropTypes.string,
};

export { LandingPageCard, LandingPageTextCard };
