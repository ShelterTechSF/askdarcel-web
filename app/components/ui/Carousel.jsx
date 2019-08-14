import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CarouselNavButton = ({ className, onClick }) => (
  <button type="button" className={className} onClick={onClick} />
);

const CarouselSlot = ({
  width, className, style, children,
}) => {
  const slotStyle = {
    ...style,
    flex: `1 0 ${width}%`,
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
    const { numSlots } = props;

    this.state = {
      activeIndex: 0,
      numActualSlots: numSlots,
      initialSlotWidth: null,
    };
    this.slotContainer = React.createRef();
  }

  componentDidMount() {
    const containerDOMNode = this.slotContainer.current;
    if (containerDOMNode && containerDOMNode.children && containerDOMNode.children.length > 0) {
      const slotChildWidth = containerDOMNode.children[0].getBoundingClientRect().width;
      this.setState({
        initialSlotWidth: slotChildWidth,
      });
    }
    this.computeSlotWidth();
    window.addEventListener('resize', this.computeSlotWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.computeSlotWidth);
  }

  computeSlotWidth = () => {
    const { numSlots } = this.props;
    const { initialSlotWidth } = this.state;
    const containerDOMNode = this.slotContainer.current;
    if (containerDOMNode
      && containerDOMNode.children
      && containerDOMNode.children.length > 0) {
      const slotChildWidth = containerDOMNode.children[0].getBoundingClientRect().width;
      const containerWidth = containerDOMNode.getBoundingClientRect().width;
      if (initialSlotWidth && initialSlotWidth * numSlots < containerWidth) {
        this.setState({
          numActualSlots: numSlots,
        });
      } else if (slotChildWidth * numSlots > containerWidth) {
        this.setState({
          numActualSlots: Math.floor(containerWidth / slotChildWidth),
        });
      }
    }
  }

  render() {
    const advanceRight = () => {
      const { activeIndex, numActualSlots } = this.state;
      const { children } = this.props;
      this.setState({
        activeIndex: Math.min(activeIndex + 1, children.length - numActualSlots),
      });
    };

    const advanceLeft = () => {
      const { activeIndex } = this.state;
      this.setState({ activeIndex: Math.max(0, activeIndex - 1) });
    };

    const { activeIndex, numActualSlots } = this.state;
    const { children } = this.props;
    const actualSlotWidth = 100.0 / numActualSlots;
    const sliderStyle = {
      transform: `translateX(${-activeIndex * actualSlotWidth}%)`,
    };

    return (
      <div className="carousel-outer">
        <div className="carousel-container">
          <div ref={this.slotContainer} className="carousel-slider" style={sliderStyle}>
            {
              children.map(child => ((
                <CarouselSlot className="carousel-slot" key={`slot${child.key}`} width={actualSlotWidth}>
                  {child}
                </CarouselSlot>
              )))
            }
          </div>
        </div>
        {
          activeIndex > 0
            && <CarouselNavButton className="carousel-nav btn-left" onClick={advanceLeft} />
        }
        {
          children.length > numActualSlots + activeIndex
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
