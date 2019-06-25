import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import axInstance from '../httpClient';
import { resourceResponse } from './__mocks__/resourceResponseMock';
import { resourceQueryResponse } from './__mocks__/resourceQueryResultsMock';
import { newResource } from './__mocks__/newResourceMock';
import {
  getResource,
  getResources,
  searchForResources,
  submitNewResource,
} from '../resourceService';

describe('Resources', () => {
  const mockAdapter = new MockAdapter(axInstance);

  it('Should return single resource', async () => {
    mockAdapter.onGet('/resources/5').reply(200, {
      resourceResponse,
    });
    const response = await getResource(5);
    const resources = response.data.resourceResponse.resources
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
    const resources = response.data.resourceQueryResponse.resources
    const checkQueryResults = resources.every((r) => {
        return r.categories.some((c) => {
            return c.name.toLowerCase() == query.toLowerCase()
        })
    })
    expect(checkQueryResults).to.be.true
    expect(response).to.be.an('object');
    expect(resources).to.be.an('array');
  });


  it('Should create a resource', async () => {
    mockAdapter.onPost('/resources', newResource).reply(200, {
      resourceResponse,
    });
    // const response = await submitNewResource(newResource);
  //
  //    expect(response.data.resourceResponse.resources[0].name).to.be.equal('Test new');
  //    expect(response).to.be.an('object');
  //    expect(response.data.resourceResponse.resources).to.be.an('array');
  });
});
