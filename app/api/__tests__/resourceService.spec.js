import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import axInstance from '../httpClient';

import resource from './__mocks__/resourceResponse.json';
import resources from './__mocks__/resourcesResponse.json';
import resourceChangeRequest from './__mocks__/resourceChangeRequest.json';
import resourceChangeRequestResponse from './__mocks__/resourceChangeRequestResponse.json';
import {
  getResource,
  getResources,
  searchResources,
  submitNewResource,
  submitResourceChangeRequest,
  submitChangeRequests
} from '../resourceService';


describe('Resources', () => {
  const mockAdapter = new MockAdapter(axInstance);

  it('Should return single resource', async () => {
    mockAdapter.onGet('/resources/1').reply(200, { resource });
    const response = await getResource(1);
    expect(response.data).to.be.an('object');
    expect(response.data.resource).to.be.an('object');
    expect(response.data.resource.id).to.be.equal(1);
    expect(response.data.resource.name).to.be.equal('Lyon-Martin Health Services');
  });

  it('Should return all resources', async () => {
    mockAdapter.onGet('/resources?category_id=all').reply(200, {
      resources,
    });
    const response = await getResources();
    expect(response).to.be.an('object');
    expect(response.data.resources).to.be.an('array');
    expect(response.data.resources).to.have.lengthOf(2);
  });

  it('Should return resources that match category search term', async () => {
    const query = 'medical';
    mockAdapter.onGet(`/resources/search?query=${query}`).reply(200, {
      resources,
    });
    const response = await searchResources(query);
    const queriedResources = response.data.resources;
    const queryCheck = c => c.name.toLowerCase() === query.toLowerCase();
    const checkQueryResults = queriedResources.every(r => r.categories.some(queryCheck));

    expect(response).to.be.an('object');
    expect(checkQueryResults).to.equal(true);
    expect(response.data.resources).to.be.an('array');
    expect(response.data.resources).to.have.lengthOf(2);
  });

  it('Should create a resource', async () => {
    mockAdapter.onPost('/resources').reply(201, {
      resources: [{ resource }]
    });
    const response = await submitNewResource(resource);
    const resourceId = response.data.resources[0].resource.id;
    expect(resourceId).to.equal(1);
    expect(response.status).to.equal(201);
  });

  it('Should submit changeRequest', async () => {
    const id = 1
    mockAdapter.onPost(`/resources/${id}/change_requests`).reply(201, {
      "change_request_response":
        resourceChangeRequestResponse
    });
    const response = await submitResourceChangeRequest(id, resourceChangeRequest);
    const responseChangeRequest = response.data.change_request_response.resource_change_request
    const fieldChanges = responseChangeRequest.field_changes[0]

    expect(responseChangeRequest.status).to.equal('pending');
    expect(responseChangeRequest.type).to.equal('ResourceChangeRequest');
    expect(fieldChanges.field_name).to.equal('website');
    expect(fieldChanges.field_value).to.equal('www.google.com');
    expect(response.status).to.equal(201);
  });

  it('Should submit an array of change request promises', async () => {
    const promises = [];
    promises.push(submitResourceChangeRequest(1, resourceChangeRequest))
    mockAdapter.onAny('/resources').reply(() => Promise.all(promises).then(
        sources => [200, sources.reduce((agg, source) => agg.concat(source))],
      ));
    const responses = await submitChangeRequests(promises);

    expect(responses).to.be.an('array');
    expect(responses[0].status).to.equal(201);
    expect(responses[0].data).to.be.an('object');
  });
});
