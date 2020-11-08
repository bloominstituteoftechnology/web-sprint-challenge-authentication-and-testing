const { default: expectCt } = require('helmet/dist/middlewares/expect-ct')
const supertest = require('supertest')
const server= require('../api/server')
const db = require('../database/dbConfig')

describe('auth testing',() => {
    it('adds users', async () => {
        const res = await supertest(server)
        .post('/register')
        .send({username: "hello", password: "shifnf"})
        expect(res.statusCode).toBe(201)
    })
})