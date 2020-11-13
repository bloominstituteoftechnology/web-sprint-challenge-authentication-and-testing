const supertest = require('supertest')
const server = require('../index')
const db = require('../database/dbConfig')

beforeEach(async () => {
  return db.seed.run()
});

afterAll(async () => {
  await db.destroy()
});

describe('testing', () => {

    it(`posting to register`, async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({
          username: 'Skelator',
        })
        expect(res.statusCode)
        .toBe(400)
        expect(res.type)
        .toBe('application/json')
        expect(res.body.message)
        .toBe('missing info')
      })
    
      it(`creates new user`, async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({
          username: 'Skelator',
          password: 'battlecat',
        })
        expect(res.statusCode)
        .toBe(201)
        expect(res.type)
        .toBe('application/json')
        expect(res.body.message)
        .toBe('User has been created')
      })
    
      it(`find if user exists`, async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({
          username: 'Skelator',
          password: 'battlecat',
        })
        expect(res.statusCode)
        .toBe(400)
        expect(res.type)
        .toBe('application/json')
        expect(res.body.message)
        .toBe('username exists')
      })
    
      it(`log in `, async () => {
        await supertest(server)
        .post('/api/auth/register')
        .send({
          username: 'Skelator',
          password: 'battlecat',
        })
        const res = await supertest(server)
        .post('/api/auth/login')
        .send({
          username: 'Skelator',
          password: 'battlecat',
        })
        expect(res.statusCode)
        .toBe(200)
        expect(res.type)
        .toBe('application/json')
        expect(res.body.message)
        .toBe(`Welcome Ben99!`)
      })
    
      it('wrong login info', async () => {
        const res = await supertest(server)
        .post('/api/auth/login')
        .send({
          username: 'Skelator',
          password: 'heman',
        })
        expect(res.statusCode)
        .toBe(401)
        expect(res.type)
        .toBe('application/json')
        expect(res.body.message)
        .toBe('Invalid Credentials')
      })


})