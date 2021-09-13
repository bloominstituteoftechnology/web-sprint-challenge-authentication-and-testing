// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')
const auth = require('./auth/auth-router')
const mike ={
  username: 'mike',
  password: 'cheese'
}

beforeAll( async ()=> {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async ()=> {
  await db('users').truncate()
})

afterAll( async ()=> {
  await db.destroy()
})

describe('endpoints', () => {
  describe(' [POST] /register', () => {
    it('responds with a 201 ok', async ()=> {
      const res = await request(auth).post('/register')
    expect(res.status).toBe(201)
    })
    it('returns the right num of users', async ()=> {
      let res
      await db('users').insert(mike)
      res = await request(auth).post('/register')
      expect(res.body).toHaveLength(1)
    })
  })
})

describe('[POST] /login', () => {
  it('responds with new created user', async () => {
    let res 
    res = await (await request(auth).post('/login')).send(mike)
    expect(res.body).toMatchObject({id:1, ...mike})
  })
  it('responds with 200 ok', async () => {
    const res = await request(auth).post('/login')
    expect(res.status).toBe(200)
  })
})

