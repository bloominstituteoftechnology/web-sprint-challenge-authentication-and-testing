const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true)
});

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
});

afterAll(async () => {
  await db.destroy()
})

  
  beforeEach(async () => {
    await request(server).post('/api/auth/register')
      .send({
        username: "Brody",
        password: "youngCrazedPeeling"
      })
  })

describe('[POST] /register', () => {
  test('causes a user to be added to the database', async () => {
    const users = await db('users')
    expect(users).toHaveLength(1)
  })
  test('responds with a newly created user', async () => {
    const users = await db('users')
    expect(users[0].username).toEqual("Brody")
  })
})

describe('[POST] /login', () => {
  let login
  beforeEach(async () => {
    login = await request(server).post('/api/auth/login')
      .send({
        username: "Brody",
        password: "youngCrazedPeeling"
      })
  })
  
  test('allows a user to login', async () => {
    expect(login.text).toMatch('token')
  })

  test('responds with a greeting to logged in user', async () => {
    expect(login.text).toMatch('welcome, Brody')
  })
})