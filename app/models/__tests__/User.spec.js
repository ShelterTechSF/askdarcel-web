import { expect } from 'chai';
import { User } from '../index';

describe('User Model', () => {
  it('should set the current user location', () => {
    const state = User.REDUCER(undefined, {});
    expect(state.location.lat).to.exist;
    expect(state.location.lng).to.exist;

    const newState = User.REDUCER(state, User.setUserLocation({ lat: 15, lng: 20 }));
    expect(newState.location.lat).to.equal(15);
    expect(newState.location.lng).to.equal(20);
  });
});
