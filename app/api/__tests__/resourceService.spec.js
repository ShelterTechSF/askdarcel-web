import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import axInstance from '../httpClient';
import { resourceResponse } from './__mocks__/resourceResponseMock';
import { resourceQueryResponse } from './__mocks__/resourceQueryResultsMock';
import {
  getResource,
  getResources,
  searchForResources,
} from '../resourceService';

describe('Resources', () => {
  const mockAdapter = new MockAdapter(axInstance);

  it('Should return single resource', async () => {
    mockAdapter.onGet('/resources/5').reply(200, {
      resourceResponse,
    });
    const response = await getResource(5);
    const { resources } = response.data.resourceResponse;
    expect(resources[0].name).to.be.equal('Test new');
    expect(response).to.be.an('object');
    expect(resources).to.be.an('array');
  });

  it('Should return all resources', async () => {
    mockAdapter.onGet('/resources?category_id=all').reply(200, {
      resourceResponse,
    });
    const response = await getResources();
    expect(response).to.be.an('object');
    expect(response.data.resourceResponse.resources).to.be.an('array');
  });

  it('Should return resources that match search term', async () => {
    const query = 'food';
    mockAdapter.onGet(`/resources/search?query=${query}`).reply(200, {
      resourceQueryResponse,
    });
    const response = await searchForResources(query);
    const { resources } = response.data.resourceQueryResponse;

    const queryCheck = c => c.name.toLowerCase() === query.toLowerCase();
    const checkQueryResults = resources.every(r => r.categories.some(queryCheck));

    expect(checkQueryResults).to.equal(true);
    expect(response).to.be.an('object');
    expect(resources).to.be.an('array');
  });
});
