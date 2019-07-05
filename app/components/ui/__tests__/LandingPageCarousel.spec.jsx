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

  it('creates a navigation button when it has more cards than it can show at once', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(fiveCards, 4)} />);
    expect(carousel.find('LandingPageTextCard')).to.have.lengthOf(fiveCards.length);
    expect(carousel.find('CarouselNavButton')).to.have.lengthOf(1);
  });

  it('should not have a navigation button when it can fit all its cards at once', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig(twoCards, 4)} />);
    expect(carousel.find('CarouselNavButton')).to.have.lengthOf(0);
  });

});
