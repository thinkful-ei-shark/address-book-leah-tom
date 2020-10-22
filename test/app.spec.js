
const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')

describe('Get address', () => {
  it('Should an array of all contacts', () => {
    return supertest(app)
      .get('/address')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.include.all.keys('firstName', 'lastName');
      })
  })
})

describe('POST address', () => {
  it('Should return 400 if zip characters != 5', () => {
    return supertest(app)
      .post('/address')
      .set('Content-Type', 'application/json')
      .send({ firstName: 'tom', lastName: 'wall', address1: '45', address2: false, city: 'fg', state: 'fo', zip: '4444' })
      .expect(400, 'Zip must be exaclty 5 digits!')
  })
})