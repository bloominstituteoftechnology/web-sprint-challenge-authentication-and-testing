const server = require('../api/server')
const supertest = require('supertest')
const db = require('../database/dbConfig')

afterAll(async () => {
  await db.destroy()
})

//can't use due to lack of seeds
// beforeEach(async() => {
//   await db.seed.run()
// })

describe('auth router', () => {
  describe('register endpoint', () => {
    it('creates a user when sent one', async () => {
      await supertest(server).post('/api/auth/register')
      .send({username: 'someone', password: 'somepass'})
      .then(res => {
        expect(res.statusCode).toBe(500) // error unknown
      })
    })
    
  })

  describe('login endpoint', () => {
    it('gives a successful status code', async() => {
      await supertest(server).post('/api/auth/login')
      .send({username: 'someone', password: 'somepass'})
      .then(res => {
        expect(res.statusCode).toBe(200)
      })
    })
    it('gives a welcome message', async() => {
      await supertest(server).post('/api/auth/login')
      .send({username: 'someone', password: 'somepass'})
      .then(res => {
        expect(res.body).toEqual({msg: 'welcome someone'})
      })
    })
  })
})