import { expect } from 'chai';
import api from '../httpClient';
import MockAdapter from 'axios-mock-adapter';
import { resourceResponse } from './__mocks__/resourceMock';
import {getResource} from '../resourceService'

describe('Lib', () => {
  it('Should return data from response', (done) => {
    let mockAdapter = new MockAdapter(api);

     mockAdapter.onGet('/resources/5').reply(200, {
       resourceResponse
     });

     const fetchResource = async (id) => {
         let resp = await getResource(id)
         console.log("data",resp);
         return resp
     }
     let response = fetchResource(5)

     setTimeout(() => {
        expect(response.resources[0]).to.be.equal(resourceResponse);
    }, 50000)

    done()
  });
});
