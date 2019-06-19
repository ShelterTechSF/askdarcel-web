import { resourceResponse } from './_mocks_/resourceMock';

const chai = require('chai');
const chaihttp = require('chai-http');

const { expect } = chai;
chai.should();
chai.use(chaihttp);

const appEndpoint = 'http://0.0.0.0:3000';

describe('API /resource', () => {
  it('should return all resources', done => {
    chai.request(appEndpoint).keepOpen()
      .get('/resources?category_id=all')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.resources).to.be.an('array');

        done();
      });
  }).timeout(50000);

  it('Should create a new resource', done => {
    chai.request(appEndpoint).keepOpen()
      .post('/resources')
      .send(resourceResponse)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.resources.length).to.be.equal(resourceResponse.resources.length);

        expect(res.body).to.be.an('object');
        expect(res.body.resources).to.be.an('array');

        done();
      });
  });

  it('Should return an error 400 when name is not passed', done => {
    chai.request(appEndpoint)
      .post('/resources')
      .send({
        alternate_name: null,
        certified: false,
        email: null,
        id: 1,
        legal_status: null,
        long_description: null,
        short_description: null,
        status: 'approved',
        verified_at: null,
        website: 'http://lyon-martin.org/',
        certified_at: null,
        services: [],
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});
