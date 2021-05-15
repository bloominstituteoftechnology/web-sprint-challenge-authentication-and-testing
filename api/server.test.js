const request = require('supertest');
const db = require('../database/dbConfig');
const server = require('../api/server');

beforeAll(async () => {
    await db.seed.run();
})

afterAll(async () => {
    await db.destroy();
})

describe('tests the auth endpoints', () => {
    it('tests the register', async () => {
        const res = await request(server)
        .post('/api/auth/register')
        .send({
            username: 'Aaron',
            password: 'Secret'
        })
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body.message).toBe('Welcome Aaron')
    })

    it('tests username error', async () => {
        const res = await request(server)
        .post('/api/auth/register')
        .send({
            username: 'Aaron',
            password: 'Secret'
        })
        expect(res.statusCode).toBe(409)
    })

    it('tests login error', async () => {
        const res = await request(server).post('/api/auth/login')
        .send({
            username: 'Aar2on',
            password: 'Secret'
        })
        expect(res.statusCode).toBe(401)
    })

    it('tests the login', async () => {
        const res = await request(server).post('/api/auth/login')
        .send({
            username: 'Aaron',
            password: 'Secret'
        })
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body.message).toBe('Welcome back Aaron')
    })

}) 