const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

const userA = { username: 'foo', password: 'bar' }
const userB = { username: 'fizz', password: 'buzz' }
const userC = { username: 'foo', password: 'buzz' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

describe('endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    it('adds a new user with a password to the users table on success', async () => {
      await request(server).post('/api/auth/register').send(userA)
      const user = await db('users').first()
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('password')
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/)
      expect(user.username).toBe(userA.username)
    }, 500)
    it('responds with the new user with a bcrypted password on success', async () => {
      const { body } = await request(server).post('/api/auth/register').send(userA)
      expect(body).toHaveProperty('id')
      expect(body).toHaveProperty('username')
      expect(body).toHaveProperty('password')
      expect(body.password).toMatch(/^\$2[ayb]\$.{56}$/)
      expect(body.username).toBe(userA.username)
    }, 500)
    })
  })
  describe('[POST] /login', () => {
    it('allows the user to login', async () => {
      await request(server).post('/api/auth/register').send(userA)
      const res = await request(server).post('/api/auth/login').send(userA)
      expect(res.status).toBe(200)
  })
})

describe('[POST] /api/auth/login', () => {
  beforeEach(async () => {
    await db('users').truncate()
    await request(server).post('/api/auth/register').send(userA)
  })
  it('responds with a proper status code on successful login', async () => {
    const res = await request(server).post('/api/auth/login').send(userA)
    expect(res.status).toBe(200)
  }, 500)
  it('responds with a welcome message and a token on successful login', async () => {
    const res = await request(server).post('/api/auth/login').send(userA)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('token')
  }, 500)
});
