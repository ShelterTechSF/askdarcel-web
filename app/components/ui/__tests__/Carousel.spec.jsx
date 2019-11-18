import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Carousel from '../Carousel/Carousel';

const DemoComponent = ({ content }) => <p>{content}</p>;

describe('<Carousel />', () => {
  const createCarouselItems = numItems => (
    // eslint-disable-next-line react/no-array-index-key
    Array(numItems).fill().map((_, i) => <DemoComponent key={i} content={`Item ${i}`} />)
  );

  const twoCards = createCarouselItems(2);
  const fiveCards = createCarouselItems(5);
  const sevenCards = createCarouselItems(7);

  const shallowCarousel = (cards, numSlots) => shallow((
    <Carousel numSlots={numSlots}>
      {cards}
    </Carousel>
  ));

  const getNavBtn = (carousel, classname) => carousel.findWhere((
    wrapper => wrapper.is('CarouselNavButton') && wrapper.hasClass(classname)
  ));

  const getRightNavBtn = carousel => getNavBtn(carousel, 'btn-right');

  const getLeftNavBtn = carousel => getNavBtn(carousel, 'btn-left');

  it('creates a carousel with the expected number of cards', () => {
    const carousel = shallowCarousel(twoCards, 4);
    expect(carousel.find('DemoComponent')).to.have.lengthOf(twoCards.length);
  });

  it('creates a rightward navigation button when it has more cards than it can show at once', () => {
    const carousel = shallowCarousel(fiveCards, 4);
    expect(carousel.find('DemoComponent')).to.have.lengthOf(fiveCards.length);
    expect(carousel.find('CarouselNavButton')).to.have.lengthOf(1);
    expect(getRightNavBtn(carousel)).to.have.lengthOf(1);
  });

  it('should not have a navigation button when it can fit all its cards at once', () => {
    const carousel = shallowCarousel(twoCards, 4);
    expect(carousel.find('CarouselNavButton')).to.have.lengthOf(0);
  });

  it('advances to the next active index on clicking the right nav button', () => {
    const carousel = shallowCarousel(sevenCards, 4);
    expect(carousel.state('activeIndex')).to.equal(0);
    getRightNavBtn(carousel).simulate('click');
    expect(carousel.state('activeIndex')).to.equal(1);
    getRightNavBtn(carousel).simulate('click');
    expect(carousel.state('activeIndex')).to.equal(2);
  });

  it('does not show the right nav button after reaching the final navigable active index', () => {
    const carousel = shallowCarousel(fiveCards, 4);
    getRightNavBtn(carousel).simulate('click');
    expect(getRightNavBtn(carousel)).to.have.lengthOf(0);
  });

  it('does not show a leftward nav button when the carousel is at the start', () => {
    const carousel = shallowCarousel(fiveCards, 4);
    expect(getLeftNavBtn(carousel)).to.have.lengthOf(0);
  });

  it('shows a leftward nav button when the index is not the starting one', () => {
    const carousel = shallowCarousel(fiveCards, 4);
    getRightNavBtn(carousel).simulate('click');
    expect(getLeftNavBtn(carousel)).to.have.lengthOf(1);
  });

  it('goes to the previous active index when clicking on the left nav button', () => {
    const carousel = shallowCarousel(fiveCards, 4);
    const startIdx = carousel.state('activeIndex');
    getRightNavBtn(carousel).simulate('click');
    getLeftNavBtn(carousel).simulate('click');
    expect(carousel.state('activeIndex')).to.equal(startIdx);
  });
});
