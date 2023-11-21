const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('../api/server')

beforeAll( async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach( async () => {
  await db.seed.run()
})

afterAll( async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(false)
})

describe('[POST] /api/auth/register', () => {
  test('gets success status', async () => {
    const credentials = {username: 'hello', password: '1234'}
    const res = await request(server).post('/api/auth/register').send(credentials)
    expect(res.status).toBe(201)
  })
  test('adds credentials to database', async () => {
    const creds = {username: 'hello', password: '1234'}
    await request(server).post('/api/auth/register').send(creds)
    const exists = await db('users').select('username').where('username', creds.username)
    expect(exists).toBeTruthy()
  })
})

describe('[GET] /jokes', () => {
  test('a token exists', async () => {
    const jokes = await request(server).get('./jokes/jokes-router.js')
    expect(jokes).toBeDefined()
    expect(jokes).toHaveLength()
  })
})


