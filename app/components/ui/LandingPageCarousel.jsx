import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LandingPageCard, LandingPageTextCard } from './LandingPageCards';

const CarouselWrapper = props => {
  return <div className="carousel-wrapper">{ props.children }</div>
}

const CarouselContainer = props => {
  return <div className="carousel">{ props.children }</div>;
}

class CarouselNavButton extends Component {
  render() {
    return (
      <button className="carousel-nav" />
    );
  }
}

class LandingPageCarousel extends Component {
  render() {
    return (
      <div>
      {
        <CarouselWrapper>
          <CarouselContainer>
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
          </CarouselContainer>
          {
            this.props.config.CARDS.length > this.props.config.NUM_SHOWN_CARDS && 
            <CarouselNavButton />
          }
        </CarouselWrapper>
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
    NUM_SHOWN_CARDS: PropTypes.number,
  }),
};

export default LandingPageCarousel;
