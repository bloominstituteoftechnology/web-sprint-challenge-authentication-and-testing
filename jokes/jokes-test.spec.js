const server = require('../api/server')
const supertest = require('supertest')
const dbConfig = require('../database/dbConfig')


afterAll(async () => {
  await dbConfig.destroy()
})

describe('jokes router', () => {
  describe('get jokes endpoint', () => {
    it('gives a 200 status', () => {
       supertest(server).get('/api/jokes').then(res => {
        expect(res.status).toBe(401)
      })
    })

    it('req has no session saved',  () => {
       supertest(server).get('/api/jokes').then(res => {
        expect(res.body).toEqual({err: 'invalid credentials'})
      })
    })
  })
  // return supertest(server).post('/api/auth/login', {})
})