import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import axInstance from '../httpClient';
import { resourceResponse } from './__mocks__/resourceMock';
import {getResource, getResources, submitNewResource} from '../resourceService'

describe('Resources', () => {
  let mockAdapter = new MockAdapter(axInstance);

  it('Should return single resource', (done) => {
     mockAdapter.onGet('/resources/5').reply(200, {
       resourceResponse
     });
     const fetchResource = async (id) => await getResource(id)
     let response = fetchResource(5)

     setTimeout(() => {
        expect(response.resources[0]).to.be.equal(resourceResponse);
        expect(response.body).to.be.an('object');
        expect(response.body.resources).to.be.an('array');
    }, 50000)
    done()
  });

  it('Should return all resources', (done) => {
     mockAdapter.onGet('/resources?category_id=all').reply(200, {
       resourceResponse
     });
     const fetchResources = async () => await getResources()
     let response = fetchResources()

     setTimeout(() => {
        expect(response.resources[0]).to.be.equal(resourceResponse);
        expect(response.body).to.be.an('object');
        expect(response.body.resources).to.be.an('array');
    }, 50000)
    done()
  });

  it('Should create a resource', (done) => {
     mockAdapter.onPost('/resources',resourceResponse).reply(200, {
       resourceResponse
     });
     const postResource = async () => await submitNewResource(resourceResponse)
     let response = postResource()

     setTimeout(() => {
        expect(response.resources[0]).to.be.equal(resourceResponse);
        expect(response.body).to.be.an('object');
        expect(response.body.resources).to.be.an('array');
    }, 50000)
    done()
  });

// mock.onPost('/resources').reply(200);
// mock.onPut('/product', { id: 4, name: 'foo' }).reply(204);
// mock.onPut('/bar', { xyz: 'abc' }).reply(204)


});
