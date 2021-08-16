const request = require('supertest');
const server = require('./server');
const jwtDecode = require('jwt-decode');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(false);
});

describe('server.js', () => {
  test('[1] responds with the correct message on valid credentials', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'bobba', password: 'grogu' })
    expect(res.body.message).toMatch(/welcome bobba/i);
  }, 500);

  test('[2] responds with a token with correct { username,  exp, iat }', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: 'bobba', password: 'grogu' });
    let decoded = jwtDecode(res.body.token);
    expect(decoded).toHaveProperty('iat');
    expect(decoded).toHaveProperty('exp');
    expect(decoded).toMatchObject({
      id: 1,
      username: 'bobba',
    });
  });
});

describe('[GET] /api/users', () => {

  test('[3] requests with an invalid token are bounced with proper status and message', async () => {
    const res = await request(server).get('/api/jokes').set('Authorization', 'vader');
    expect(res.body.message).toMatch(/token invalid/i)
  });
  test('[4] requests with a valid token obtain a list of users', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: 'bobba', password: 'grogu' })
    res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(res.body).toMatchObject([
      {
        "id": "0189hNRf2g",
        "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
      },
      {
        "id": "08EQZ8EQukb",
        "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
      },
      {
        "id": "08xHQCdx5Ed",
        "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
      },
    ])
  });
});