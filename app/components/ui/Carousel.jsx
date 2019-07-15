import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LandingPageCard, LandingPageTextCard } from './LandingPageCards';

const CarouselOuter = styled.div`
  position: relative;
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
  transition: transform 1s ease;
  transform: translateX(${props => -props.activeIndex * props.slotWidth}%);
`;

const CarouselNavButton = props => {
  return <button className={`carousel-nav btn-${props.dir}`} onClick={ props.onClick } />
};
CarouselNavButton.props = {
  dir: PropTypes.string.isRequired,
};

const CarouselSlot = styled.div`
  flex: 1 0 calc(${props => props.width}% - 10px);
  margin-right: 10px;
`;

class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0
    };
  }

  render() {
    const advanceRight = () => {
      const incIndex = this.state.activeIndex + 1;
      this.setState({ activeIndex: Math.min(incIndex, this.props.children.length - this.props.numSlots) });
    };

    const advanceLeft = () => {
      const decIndex = this.state.activeIndex - 1;
      this.setState({ activeIndex: Math.max(0, decIndex) });
    }

    const slotWidth = 100 / this.props.numSlots;

    return (
      <CarouselOuter>
        <CarouselContainer>
          <CarouselSlider slotWidth={ slotWidth } activeIndex={ this.state.activeIndex }>
          {
            this.props.children.map((child, index) => {
              return (
                <CarouselSlot key={ index } width={ slotWidth } >
                  { child }
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
          this.props.children.length > this.props.numSlots + this.state.activeIndex && 
            <CarouselNavButton dir="right" onClick={ advanceRight } />
        }
      </CarouselOuter>
    );
  }

}

Carousel.props = {
  numSlots: PropTypes.number,
};

export default Carousel;
