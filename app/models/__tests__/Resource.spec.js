import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store';
import promise from 'redux-promise-middleware';
import { Resource } from '../index';
import { ACTIONS } from '../Resource';
import { PENDING, FULFILLED, REJECTED } from '../utils';

import axInstance from '../../api/httpClient';
import resource from '../../api/__tests__/__mocks__/resourceResponse.json';
import { transformedResource } from '../../api/__tests__/__mocks__/transformedResource';


const middlewares = [promise];
const mockStore = configureStore(middlewares);

const existingState = {
  isPending: false,
  resource: null,
  error: {},
};


// REDUCER TESTS
describe('Resource Model Reducer', () => {
  let mockAdapter;

  before(() => {
    mockAdapter = new MockAdapter(axInstance);
  });

  it('returns the initial state when an action type is not passed', () => {
    const state = Resource.REDUCER(undefined, {});
    expect(state.resource).to.be.null;
    expect(state.isPending).to.be.false;
    expect(state.error).to.be.empty;
  });

  it('should set pending get resource to true', () => {
    const newState = Resource.REDUCER(existingState, { type: PENDING(ACTIONS.GET_RESOURCE) });
    expect(newState.isPending).to.be.true;
  });

  it('should set the get resource object', () => {
    const fulfilledAction = {
      type: FULFILLED(ACTIONS.GET_RESOURCE),
      payload: { data: { resource } },
    };

    const newState = Resource.REDUCER(existingState, fulfilledAction);
    expect(newState.isPending).to.be.false;
    expect(newState.error).to.be.empty;
    expect(newState.resource).to.be.a('object');
    expect(newState.resource).to.include(transformedResource);
  });

  it('should set the get resource object with recurring schedule', () => {
    const fulfilledAction = {
      type: FULFILLED(ACTIONS.GET_RESOURCE),
      payload: { data: { resource } },
    };

    const newState = Resource.REDUCER(existingState, fulfilledAction);
    const stateIntervals = newState.resource.recurringSchedule.intervals;
    const { intervals } = transformedResource.recurringSchedule;
    expect(stateIntervals).to.deep.equal(intervals);
  });

  it('should handle failed get resource request', () => {
    const error = { Error: 'Network Error' };
    const rejectedAction = {
      type: REJECTED(ACTIONS.GET_RESOURCE),
      payload: error,
    };

    const newState = Resource.REDUCER(existingState, rejectedAction);
    expect(newState.resource).to.be.null;
    expect(newState.isPending).to.be.false;
    expect(newState.error).to.deep.equal(error);
  });
});


// ACTION CREATOR TESTS
describe('Resource Model Actions', () => {
  let mockAdapter;

  before(() => {
    mockAdapter = new MockAdapter(axInstance);
  });

  it('should create fulfilled action', () => {
    const store = mockStore({});
    const id = 1;
    mockAdapter.onGet(`/resources/${id}`).reply(200, { resource });

    const action = Resource.getResourceAction(id);
    return store.dispatch(action)
      .then(() => {
        const actions = store.getActions();
        const newState = store.getState();
        expect(actions[0].type).to.equal('GET_RESOURCE_PENDING');
        expect(actions[1].type).to.equal('GET_RESOURCE_FULFILLED');
        expect(actions[1].payload.status).to.equal(200);
      });
  });

  it('should create rejected action', async () => {
    const store = mockStore({});
    const id = 1;
    mockAdapter.onGet(`/resources/${id}`).networkError();

    const action = Resource.getResourceAction(id);
    try {
      await store.dispatch(action);
    } catch {
      const actions = store.getActions();
      expect(actions[0].type).to.equal('GET_RESOURCE_PENDING');
      expect(actions[1].type).to.equal('GET_RESOURCE_REJECTED');
      expect(actions[1].payload).to.be.a('error');
    }
  });
});
