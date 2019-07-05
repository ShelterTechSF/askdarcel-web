import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LandingPageCard, LandingPageTextCard } from './LandingPageCards';

const CarouselWrapper = props => {
  return <div className="carousel-wrapper">{ props.children }</div>
};

const CarouselContainer = props => {
  return <div className="carousel">{ props.children }</div>;
};

const CarouselNavButton = props => {
  return <button className={`carousel-nav btn-${props.dir}`} />
};
CarouselNavButton.props = {
  dir: PropTypes.string.isRequired,
};

class LandingPageCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0
    };
  }

  render() {
    const advanceRight = () => {
      const incIndex = this.state.activeIndex + 1;
      this.setState({ activeIndex: Math.min(incIndex, this.props.config.CARDS.length - this.props.config.NUM_SHOWN_CARDS) });
    };

    const advanceLeft = () => {
      const decIndex = this.state.activeIndex - 1;
      this.setState({ activeIndex: Math.max(0, decIndex) });
    }

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
            this.state.activeIndex > 0 &&
              <CarouselNavButton dir="left" onClick={ advanceLeft } />
          }
          {
            this.props.config.CARDS.length > this.props.config.NUM_SHOWN_CARDS + this.state.activeIndex && 
              <CarouselNavButton dir="right" onClick={ advanceRight } />
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
