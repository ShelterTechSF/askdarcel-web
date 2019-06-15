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

  const testCards = [
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
  const validConfig = {
    TITLE: {
      BLUE_WORD: 'Test',
      DESCRIPTION: 'Test description'
    },
    CARDS: testCards,
  };

  it('creates a carousel with the expected number of cards', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig} />);
    expect(carousel.find('LandingPageTextCard')).to.have.lengthOf(testCards.length);
  });

  it('checks a valid user should render the appropriate fields in the right place', () => {
    const carousel = shallow(<LandingPageCarousel config={validConfig} />);
    expect(carousel.find('LandingPageTextCard')).first().prop('title').to.equal('Test1');
    // expect(carousel.find('LandingPageTextCard').prop('query')).to.equal();
    // expect(carousel.find('LandingPageTextCard').prop('key'));
    
  });
});
