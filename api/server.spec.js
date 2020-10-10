const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig.js');
const testUser = {username: 'testing', password: 'testing'}

describe('server.js', () => {
    describe('Get request for jokes', () => {
        it('should return a status 400 when not logged in', async () => {
            const res = await request(server).get('/api/jokes')
        expect(res.status).toBe(400);
        })
        it('should return json', async() => {
            const res = await request(server).get('/api/jokes');
            expect(res.type).toBe('application/json')
        });
    });

describe('user registration', () => {
    it('should return a status code of 201 when adding a new user', async () => {
        await db('users').truncate()
        const res = await request(server)
        .post('/api/auth/register')
        .send(testUser);
        expect(res.status).toBe(201)
    });
    it('should return a status code of 500 with an invalid user', async () => {
        const res = await request(server)
        .post('/api/auth/register')
        .send({user: "test", pass: "jabroni" });
        expect(res.status).toBe(500);
    })
});
describe('login with user', () => {
    it('should return status of 200 with test user', async () => {
        const res = await request(server)
        .post('/api/auth/login')
        .send(testUser);
        expect(res.status).toBe(200)
    })
    it('should return 401 with invalid user', async () => {
        const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'does not exist', password: 'never entered' })
        expect(res.status).toBe(401)
    })
})
});