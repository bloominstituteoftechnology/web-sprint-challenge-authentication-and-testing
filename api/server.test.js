// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () => {
  await db('users').truncate()
})



describe('[GET] /jokes', () => {
  const newUser = { username: "user", password: "1234" }
  test('receives an error with no token present', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    await request(server).post('/api/auth/login').send(newUser)
    const data = await request(server).get('/api/jokes')
    expect(data.body.message).toBe('token required')
  })
  test('returns a list of jokes while authorized', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const res = await request(server).post('/api/auth/login').send(newUser)
    const data = await request(server).get('/api/jokes').set('Authorization', `${res.body.token}`)
    expect(data.body).toHaveLength(3)
  })
})

describe('[POST] /auth/register', () => {
  const newUser = { username: "user", password: "1234" }
  test('new users are listed in the database', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const rows = await db('users')
    expect(rows).toHaveLength(1)
  })
  test('returns username and hashed password', async () => {
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.body.username).toMatch(newUser.username)
    expect(res.body.password).not.toMatch(newUser.password)
  })

})

describe('[POST] /auth/login', () => {
  const newUser = { username: "user", password: "1234" }
  test('new user obtains a token when logging in', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const res = await request(server).post('/api/auth/login').send(newUser)
    expect(res.body.token).toBeDefined()
  })
  test('incorrect password gives an error', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const res = await request(server).post('/api/auth/login').send({ username: newUser.username, password: '123'})
    expect(res.body.message).toBe('invalid credentials')
  })
})
