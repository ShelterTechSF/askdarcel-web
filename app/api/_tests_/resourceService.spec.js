import resourceResponse from './_mocks_/resourceMock';

const chai = require('chai');
const chaihttp = require('chai-http');

const { expect } = chai;
const should = chai.should();

chai.use(chaihttp);

const app = 'http://0.0.0.0:3000';

describe('API /resource', () => {
  it('should take less than 500ms', function (done) {
    this.timeout(500);
    setTimeout(done, 300);
  });

  it('should return all resources', done => {
    chai.request(app).keepOpen()
      .get('/resources?category_id=all')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;

        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');

        done();
      });
  });

  it('Should create a new resource', done => {
    chai.request(app).keepOpen()
      .post('/resource')
      .send({ resourceResponse })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;

        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');

        done();
      });
  });

  it('Should return an error 401 when name is not passed', done => {
    chai.request(app)
      .post('/contact')
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
        res.should.have.status(401);
        done();
      });
  });
});
