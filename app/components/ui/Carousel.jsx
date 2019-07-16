import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

const CarouselNavButton = ({ dir, onClick }) => (
  <button type="button" className={`carousel-nav btn-${dir}`} onClick={onClick} />
);
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
      activeIndex: 0,
    };
  }

  render() {
    const advanceRight = () => {
      const { activeIndex } = this.state;
      const { children, numSlots } = this.props;
      this.setState({
        activeIndex: Math.min(activeIndex + 1, children.length - numSlots),
      });
    };

    const advanceLeft = () => {
      const { activeIndex } = this.state;
      this.setState({ activeIndex: Math.max(0, activeIndex - 1) });
    };

    const { activeIndex } = this.state;
    const { children, numSlots } = this.props;
    const slotWidth = 100 / numSlots;

    return (
      <CarouselOuter>
        <CarouselContainer>
          <CarouselSlider slotWidth={slotWidth} activeIndex={activeIndex}>
            {
              children.map(child => ((
                <CarouselSlot width={slotWidth}>
                  {child}
                </CarouselSlot>
              )))
            }
          </CarouselSlider>
        </CarouselContainer>
        {
          activeIndex > 0
            && <CarouselNavButton dir="left" onClick={advanceLeft} />
        }
        {
          children.length > numSlots + activeIndex
            && <CarouselNavButton dir="right" onClick={advanceRight} />
        }
      </CarouselOuter>
    );
  }
}

Carousel.props = {
  numSlots: PropTypes.number,
};

export default Carousel;
