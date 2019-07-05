import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LandingPageCarousel from '../LandingPageCarousel';

describe('<LandingPageCarousel />', () => {
  const createCategoryCard = (title, query, key, resource) => {
    return <LandingPageTextCard
      title={title}
      query={query}
      key={key}
      resource={resource}
    />
  };

  const twoCards = [
    {
      title: 'Test1',
      content: 'Test content',
      query: 'Test+Query',
      imgClass: 'legal-block-housing',
    },
    {
      title: 'Test2',
      content: 'Test content 2',
      resource: 'https://www.google.com',
      imgClass: 'legal-block-housing',
    },
  ];
  const fiveCards = [
    ...twoCards,
    {
      title: 'Test3',
      content: 'Test content 3',
      query: 'Test+Query',
      imgClass: 'legal-block-housing',
    },
    {
      title: 'Test4',
      content: 'Test content 4',
      resource: 'https://www.google.com',
      imgClass: 'legal-block-housing',
    },
    {
      title: 'Test5',
      content: 'Test content 5',
      query: 'Test+Query',
      imgClass: 'legal-block-housing',
    },
  ];
  const sevenCards = [
    ...fiveCards,
    {
      title: 'Test6',
      content: 'Test content 6',
      query: 'Test+Query',
      imgClass: 'legal-block-housing',
    },
    {
      title: 'Test7',
      content: 'Test content 7',
      resource: 'https://www.google.com',
      imgClass: 'legal-block-housing',
    },
  ];
  const validConfig = (cards, numShownCards) => {
    return {
      TITLE: {
        BLUE_WORD: 'Test',
        DESCRIPTION: 'Test description'
      },
      CARDS: cards,
      NUM_SHOWN_CARDS: numShownCards,
    };
  };

  it('creates a carousel with the expected number of cards', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(twoCards, 4)} />);
    expect(carousel.find('LandingPageTextCard')).to.have.lengthOf(twoCards.length);
  });

  it('creates a rightward navigation button when it has more cards than it can show at once', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(fiveCards, 4)} />);
    expect(carousel.find('LandingPageTextCard')).to.have.lengthOf(fiveCards.length);
    expect(carousel.find('CarouselNavButton')).to.have.lengthOf(1);
    expect(carousel.find('CarouselNavButton').prop('dir')).to.equal('right');
  });

  it('should not have a navigation button when it can fit all its cards at once', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(twoCards, 4)} />);
    expect(carousel.find('CarouselNavButton')).to.have.lengthOf(0);
  });

  const getNavBtn = (carousel, direction) => {
    return carousel.findWhere(wrapper => wrapper.is('CarouselNavButton') && wrapper.prop('dir') === direction);
  }

  const getRightNavBtn = (carousel) => {
    return getNavBtn(carousel, 'right');
  };

  it('advances to the next active index on clicking the right nav button', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(sevenCards, 4)} />);
    expect(carousel.state('activeIndex')).to.equal(0);
    getRightNavBtn(carousel).simulate('click');
    expect(carousel.state('activeIndex')).to.equal(1);
    getRightNavBtn(carousel).simulate('click');
    expect(carousel.state('activeIndex')).to.equal(2);
  });

  it('does not show the right nav button after reaching the final navigable active index', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(fiveCards, 4)} />);
    getRightNavBtn(carousel).simulate('click');
    expect(getRightNavBtn(carousel)).to.have.lengthOf(0);
  });

  const getLeftNavBtn = (carousel) => {
    return getNavBtn(carousel, 'left');
  };

  it('does not show a leftward nav button when the carousel is at the start', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(fiveCards, 4)} />);
    expect(getLeftNavBtn(carousel)).to.have.lengthOf(0);
  });

  it('shows a leftward nav button when the index is not the starting one', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(fiveCards, 4)} />);
    getRightNavBtn(carousel).simulate('click');
    expect(getLeftNavBtn(carousel)).to.have.lengthOf(1);
  });

  it('goes to the previous active index when clicking on the left nav button', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(fiveCards, 4)} />);
    const startIdx = carousel.state('activeIndex');
    getRightNavBtn(carousel).simulate('click');
    getLeftNavBtn(carousel).simulate('click');
    expect(carousel.state('activeIndex')).to.equal(startIdx);
  });

});
