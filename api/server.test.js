const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

const Joke1 = { name: 'Joke1' }
const Joke2 = { name: 'Joke2' }
const Joke3 = { name: 'Joke3' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('jokes').truncate()
})
afterAll(async () => {
  await db.destroy()
})

describe('endpoints', () => {
  describe('[POST] /register', () => {
    it('allows the user to register', async () => {
      const res = await request(server).post('/jokes')
      expect(res.status).toBe(201)
    })
    it('does not allow access is username and password are not entered correctly', async () => {
      const res = await request(server).post('/jokes')
      expect(res.status).toBe(404)
    })
  })
})
