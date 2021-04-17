// Write your tests here
const request = require('supertest');
const dbConfig = require('../data/dbConfig.js');

const server = require('./server.js');

beforeEach(async () => {
  await dbConfig.truncate('users')
})

describe('/api/auth/register', () => {
  it('should return succesfull register message', async () => {
    const expectedStatusCode = 201;
    const response = await request(server).post('/api/auth/register').send({ username: 'sticky', password: 'testing' })
    expect(response.status).toEqual(expectedStatusCode);
  });

  it('should return fail message', async () => {
    const expectedStatusCode = 400;
    const response = await request(server).post('/api/auth/register').send({ username: 'sticky' })
    expect(response.status).toEqual(expectedStatusCode);
  });
})


describe('/api/auth/login', () => {
  it('should return succesfull login message', async () => {
    await request(server).post('/api/auth/register').send({ username: 'sticky', password: 'testing' })
    const expectedStatusCode = 200;
    const response = await request(server).post('/api/auth/login').send({ username: 'sticky', password: 'testing' })
    expect(response.status).toEqual(expectedStatusCode);
  });

  it('should return fail message', async () => {
    const expectedStatusCode = 400;
    const response = await request(server).post('/api/auth/login').send({ username: 'sticky' })
    expect(response.status).toEqual(expectedStatusCode);
  });
})