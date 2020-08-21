const request = require('supertest')

const db = require('../database/dbConfig');

const server = require('./server');

describe('end point tests', function() {
    describe('POST /register and POST /login', function() {
        beforeAll(async() => {
                await db('users').truncate();
            })
                // Register Test 1
        it('POST /auth/register - should return status 400', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({ username: "john", password: "doe" })
                    .then(res => {
                        console.log(res.status)
                        expect(res.status).toBe(400);
                    })
            })
                // Register Test 2
        it(' POST /auth/register - res.type should match json', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({ username: "joe", password: "doe" })
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                    })
            })
                // Login Test 1
        it('POST /auth/login - should return status 401', function() {
                return request(server).post('/api/auth/login').send({ username: 'testjoe', password: 'testjoe123' }).then(res => {
                    expect(res.status).toBe(401);
                })
            })
                // Login Test 2
        it(' POST /auth/login - res.type should match json"', function() {
                return request(server)
                    .post('/api/auth/login')
                    .send({ username: "jane", password: "doe" })
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                    })
            })
                // Get Test 1
        it(' GET /jokes/ - res.type should match json', function() {
                return request(server)
                    .get('/api/jokes/')
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                    })
            })
                // Get Test 2
        it(' GET /jokes/ - should be defined', function() {
            return request(server)
                .get('/api/jokes/')
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        })
    })
})