const request = require('supertest')
const db = require('../database/dbConfig');
const server = require('./server');

describe('end point tests', function() {
    describe('POST /register and POST /login', function() {
        beforeAll(async() => {
                await db('users').truncate();
            })
            
        //#1 should return status 201
        it('POST /auth/register', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({ username: "test", password: "1234567" })
                    .then(res => {
                        console.log(res.body)
                        expect(res.status).toBe(201)
                        expect(res.body.data.username).toBe(user.username)
                    })
            })
            
        //#2 should give 400 error for invalid credentials'
        it(' POST /auth/register', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({ username: "nope" , password: "nope" })
                    .then(res => {
                      console.log(res.status)
                      console.log(res.body)
                      expect(res.status).toBe(400);
                      expect(res.body).toEqual({ message: 'incorrect username/password' })
                    })
        })
            
        //#3 should return status 200
        it('POST /auth/login', function() {
                return request(server)
                    .post('/api/auth/login')
                    .send({ username: 'test', password: '1234567' })
                    .then(res => {
                        const token = res.data.token
                        return request(server)
                        .get('/api/jokes/')
                        .set({token})
                        .then(res => {
                            expect(res.status).toBe(200);
                    })
                })
            })

        //#4 res.type should match json
        it(' POST /auth/login"', function() {
                return request(server)
                    .post('/api/auth/login')
                    .send({ username: "test", password: "1234567" })
                    .then(res => {
                        const token = res.data.token
                        return request(server)
                        .get('/api/jokes/')
                        .set({token})
                        .then(res => {
                            expect(res.type).toMatch(/json/i);
                        })
                    })
                })
            
        //#5 res.type should match json
        it(' GET /jokes/', function() {
                return request(server)
                    .get('/api/jokes/')
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                    })
            })
            
        //#6 should return a response
        it(' GET /jokes/', function() {
            return request(server)
                .get('/api/jokes/')
                .then(res => {
                    expect(res.body).toBeTruthy();
            })
        })
    })
})