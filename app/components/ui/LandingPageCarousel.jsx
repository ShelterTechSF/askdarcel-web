import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LandingPageCard, LandingPageTextCard } from './LandingPageCards';

const CarouselOuter = styled.div`
  overflow: visible;
  width: 100%;
`;

const CarouselContainer = styled.div`
  overflow: hidden;
`;

const CarouselSlider = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  transform: translateX(${props => props.activeIndex * props.slotWidth}%);
`;

const CarouselNavButton = props => {
  return <button className={`carousel-nav btn-${props.dir}`} />
};
CarouselNavButton.props = {
  dir: PropTypes.string.isRequired,
};

const CarouselSlot = styled.div`
  flex: 1 0 calc(${props => props.width}% - 20px);
  margin-right: 20px;
`;

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

    const slotWidth = 100 / this.props.config.NUM_SHOWN_CARDS;

    return (
      <CarouselOuter>
        <CarouselContainer>
          <CarouselSlider slotWidth={ slotWidth } activeIndex={ this.state.activeIndex }>
          {
            this.props.config.CARDS.map((category, index) => {
              return (
                <CarouselSlot key={ index } width={ slotWidth } >
                  <LandingPageTextCard
                    key={ category.query || category.resource }
                    title={ category.title }
                    query={ category.query }
                    resource={ category.resource }
                    content={ category.content }
                  />
                </CarouselSlot>
              )
            })
          }
          </CarouselSlider>
        </CarouselContainer>
        {
          this.state.activeIndex > 0 &&
            <CarouselNavButton dir="left" onClick={ advanceLeft } />
        }
        {
          this.props.config.CARDS.length > this.props.config.NUM_SHOWN_CARDS + this.state.activeIndex && 
            <CarouselNavButton dir="right" onClick={ advanceRight } />
        }
      </CarouselOuter>
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
