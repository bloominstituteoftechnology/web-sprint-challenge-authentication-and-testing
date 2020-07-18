const request = require('supertest')

const db = require('../database/dbConfig');

const server = require('./server');

describe('end point tests', function() {
    describe('POST /register and POST /login', function() {
        beforeAll(async() => {
                await db('users').truncate();
            })
            //test1
        it('POST /auth/register - should return status 201', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({ username: "Andrew", password: "newtest123" })
                    .then(res => {
                        expect(res.status).toBe(201);
                    })
            })
            //test2
        it(' POST /auth/register - res.type should match json', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({ username: "testjoe", password: "testjoe123" })
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                    })
            })
            //test3
        it('POST /auth/login - should return status 200', function() {
                return request(server).post('/api/auth/login').send({ username: 'testjoe', password: 'testjoe123' }).then(res => {
                    expect(res.status).toBe(200);
                })
            })
            //test4
        it(' POST /auth/login - res.type should match json"', function() {
                return request(server)
                    .post('/api/auth/login')
                    .send({ username: "testjoe", password: "testjoe123" })
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                    })
            })
            //test5
        it(' GET /jokes/ - res.type should match json', function() {
                return request(server)
                    .get('/api/jokes/')
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                    })
            })
            //test6
        it(' GET /jokes/ - should be defined', function() {
            return request(server)
                .get('/api/jokes/')
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        })
    })
})