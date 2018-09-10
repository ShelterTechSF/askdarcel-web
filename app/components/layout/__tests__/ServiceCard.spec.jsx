import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ServiceCard from '../ServiceCard';

describe('<ServiceCard />', () => {
  const validService = {
    id: 2,
    name: 'Test Service',
    long_description: 'This valuable service does things',
  };

  it('checks a valid user should render the appropriate fields in the right place', () => {
    const card = shallow(<ServiceCard service={validService} />).dive();
    expect(card.find('h3').text()).to.equal('Test Service');
    expect(card.find('p').text()).to.equal(validService.long_description);
  });
});
