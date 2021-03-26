// Write your tests here

const request = require('supertest')
const db = require('./../data/dbConfig')
const server = require('./server')

const tony = { username: "Tony", password: "12345" }
beforeAll( async() => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach( async() => {
  await db('users').truncate()
})

afterAll( async() => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('server', () => {
  describe('[GET] /jokes', () => {
    it('Returns a 403 if not user', async() => {
      const res = await request(server).get('/api/jokes')
      expect(res.status).toBe(401)
    })
  })

  describe("[POST] /users", () => {
    it('Returns new user', async() => {
      let res
      res = await request(server).post("/api/auth/register").send(tony)
      
      expect(res.status).toEqual(201)
    })
  })

  describe('[POST] /login', () => {
    it('Good stuff', async () => {
      await request(server).post('/api/auth/register').send(tony)
      let res
      res = await request(server).post('/api/auth/login').send(tony)
      expect(res.status).toEqual(200)
    })
})


})

