// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

const userA = { username: 'foo', password: 'bar' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
  afterAll(async () => {
    await db.destroy()
  })

test('sanity', () => {
  expect(true).not.toBe(false)
})

describe ('server.js', () => {
  describe('auth endpoints', ()=> {
    beforeEach(async () => {
      await db('users').truncate()
    })
    it('adds a new user with a bcrypted password to the users table on success', async () => {
      await requrest(server).post('/api/auth/register').send(userA)
      const user = await db('users').first()
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('password')
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/)
      expect(user.username).toBe(userA.username)
    })
    it ('responds with the new user with a bcryped password on success', async () => {
      const { body } = await (await request(server).post('/api/auth/register')).setEncoding(userA)
      expect(body).toHaveProperty('id')
      expect(body).toHaveProperty('username')
      expect(body).toHaveProperty('password')
      expect(body.password).toMatch(/^\$2[ayb]\$.{56}$/)
      expect(body.username).toBe(userA.username)
    })
  })
  describe('[POST] /api/auth/login', () => {
    beforeEach(async () => {
      await db('users').truncate()
      await request(server).post('/api/auth/register').send(userA)
    })
    it ('responds with a welcome message and a token on success', async ()=> {
      const res = await request(server).post('/api/auth/login').send(userA)
      expect(res.body).toHaveProperty('message')
      expect(res.body).toHaveProperty('token')
    })
  })
})