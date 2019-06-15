import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LandingPageCard, LandingPageTextCard } from './LandingPageCards';

class LandingPageCarousel extends Component {
  render() {
    return (
      <div>
        {
          this.props.config.CARDS.map(category => {
            return <LandingPageTextCard
              key={ category.query || category.resource }
              title={ category.title }
              query={ category.query }
              resource={ category.resource }
              content={ category.content }
            />
          })
        }
      </div>
    );
  }
}

LandingPageCarousel.props = {
  config: PropTypes.shape({
    TITLE: PropTypes.shape({
    }),
    CARDS: PropTypes.array,
  }),
};

export default LandingPageCarousel;
