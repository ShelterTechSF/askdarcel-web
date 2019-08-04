import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CarouselSlider = ({ activeIndex, slotWidth, className, style, children }) => {
  const sliderStyle = {
    transform: "translateX(" + (-activeIndex * slotWidth) + "%)",
    ...style,
  };
  return (
    <div className={className} style={sliderStyle}>
      {children}
    </div>
  );
};

const CarouselNavButton = ({ className, onClick }) => (
  <button type="button" className={className} onClick={onClick} />
);

const CarouselSlot = ({ width, className, style, children }) => {
  const slotStyle = {
    ...style,
    flex: "1 0 calc(" + width + "% - 10px)",
  };
  return (
    <div className={className} style={slotStyle}>
      {children}
    </div>
  );
};

class Carousel extends Component {
  constructor(props) {
    super(props);
    const { numSlots } = this.props;

    this.state = {
      activeIndex: 0,
      numActualSlots: numSlots,
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
      <div className="carousel-outer">
        <div className="carousel-container">
          <CarouselSlider className="carousel-slider" slotWidth={slotWidth} activeIndex={activeIndex}>
            {
              children.map(child => ((
                <CarouselSlot className="carousel-slot" key={"slot" + child.key} width={slotWidth}>
                  {child}
                </CarouselSlot>
              )))
            }
          </CarouselSlider>
        </div>
        {
          activeIndex > 0
            && <CarouselNavButton className="carousel-nav btn-left" onClick={advanceLeft} />
        }
        {
          children.length > numSlots + activeIndex 
            && <CarouselNavButton className="carousel-nav btn-right" onClick={advanceRight} />
        }
      </div>
    );
  }
}

Carousel.props = {
  numSlots: PropTypes.number,
};

export default Carousel;
