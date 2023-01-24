// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})



// describe('[GET] /jokes', () => {

// })

describe('[POST] /auth/register', () => {
  const newUser = { username: "user", password: "1234" }
  test('new users are listed in the database', async () => {
    await request(server).post('/auth/register').send(newUser);
    const rows = await db('users')
    expect(rows).toHaveLength(1)
  })
  test('returns username and hashed password', async () => {
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.body.username).toMatch(newUser.username)
    expect(res.body.password).not.toMatch(newUser.password)
  })

  test('sanity', () => {
    expect(1).toEqual(1)
  })
})

// describe('[POST] /auth/login', () => {

// })
