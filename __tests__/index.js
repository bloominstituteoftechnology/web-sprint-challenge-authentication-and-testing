const supertest = require('supertest');
const server = require('../index');
const db = require('../database/dbConfig');

beforeEach(async () => {
  return db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe(' integration tests', () => {
  it(`GET /api/jokes, cant get jokes if not auth'd`, async () => {
    const res = await supertest(server).get('/api/jokes');
    expect(res.statusCode).toBe(401);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('missing required token');
  });

  it(`GET /api/jokes - can get jokes if auth'd`, async () => {
    await supertest(server).post('/api/auth/register').send({
      username: 'Ben99',
      password: 'password',
    });
    const response = await supertest(server).post('/api/auth/login').send({
      username: 'Ben99',
      password: 'password',
    });
    let token = response.body.token;
    if (token !== undefined) {
      const res = await supertest(server)
        .get('/api/jokes')
        .send({ token: token });
      expect(res.statusCode).toBe(200);
      expect(res.type).toBe('application/json');
    }
  });

  it(`POST /api/auth/register - err if missing params`, async () => {
    const res = await supertest(server).post('/api/auth/register').send({
      username: 'Ben99',
    });
    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('missing required parameters');
  });

  it(`POST /api/auth/register - creates new user`, async () => {
    const res = await supertest(server).post('/api/auth/register').send({
      username: 'Ben99',
      password: 'password',
    });
    expect(res.statusCode).toBe(201);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('User successfully created');
  });

  it(`POST /api/auth/register - 400 err if user exists`, async () => {
    const res = await supertest(server).post('/api/auth/register').send({
      username: 'Ben99',
      password: 'password',
    });
    expect(res.statusCode).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('username already taken');
  });

  it(`POST /api/auth/login - tests logging in `, async () => {
    await supertest(server).post('/api/auth/register').send({
      username: 'Ben99',
      password: 'password',
    });
    const res = await supertest(server).post('/api/auth/login').send({
      username: 'Ben99',
      password: 'password',
    });
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe(`Welcome Ben99!`);
  });

  it('POST /api/auth/login, err 401 if invalid creds', async () => {
    const res = await supertest(server).post('/api/auth/login').send({
      username: 'Ben99 ',
      password: 'badpass',
    });
    expect(res.statusCode).toBe(401);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('Invalid Credentials');
  });
});
