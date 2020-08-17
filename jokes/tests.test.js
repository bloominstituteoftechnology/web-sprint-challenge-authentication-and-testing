const request = require('supertest')
const server = require('../api/server')
const db = require('../database/dbConfig')

describe('JOKES TESTS', () => {
    it('RETURNS A JSON OBJECT', () => {
        return request(server).get('/api/jokes/')
        .then(jokes => {
            expect(jokes.type).toEqual("application/json")
        })
    });
    it('RETURNS A 401 STATUS CODE IF NOT LOGGED IN', () => {
        return request(server).get('/api/jokes/')
        .then(jokes => {
            expect(jokes.status).toEqual(401)
        })
    });
    
    
});

describe('AUTH REGISTER TESTS', () => {
    beforeEach(async () => {
        await db('users').truncate();
      });

    it('RETURNS A JSON OBJECT', () => {
        return request(server).post('/api/auth/register')
        .send({'username':'testuser01',password:'testpassword01'})
        .then(resp => {
            console.log(resp.text)
            expect(resp.type).toEqual("application/json")
            expect(resp.status).toEqual(201)
        })
    });

    it('RETURNS A 201 STATUS CODE', () => {
        return request(server).post('/api/auth/register')
        .send({'username':'testuser01','password':'testpassword01'})
        .then(resp => {
            console.log(resp.text)
            expect(resp.status).toEqual(201)
        })
    });

describe('AUTH LOGIN TESTS', () => {

    beforeEach(async () => {
        await db('users').truncate();
        // await db('users').insert({username:'testuser01','password':'testpassword01'})
      });

      it('RETURNS A 200 STATUS CODE', () => {
        return request(server).post('/api/auth/register')
        .send({username:'testuser01',password:'testpassword01'})
        .then(resp => {
            console.log(resp.text)
            return request(server).post('/api/auth/login')
            .send({username:'testuser01',password:'testpassword01'})
            .then(resp => {
                console.log(resp.text)
                expect(resp.status).toEqual(200)
            
            })
        })
        .catch(err => {
            console.log(err)
        })
    });

    it('RETURNS A JSON OBJECT', () => {
        return request(server).post('/api/auth/register')
        .send({username:'testuser01',password:'testpassword01'})
        .then(resp => {
            console.log(resp.text)
            return request(server).post('/api/auth/login')
            .send({username:'testuser01',password:'testpassword01'})
            .then(resp => {
                // console.log(resp.text)
                expect(resp.type).toEqual("application/json")
            
            })
        })
        .catch(err => {
            console.log(err)
        })
    });

    // it('RETURNS A JSON OBJECT', () => {
        
    //     return request(server).post('/api/auth/login')
    //     .send({username:'testuser01',password:'testpassword01'})
    //     .then(resp => {
    //         console.log(resp.text)
    //         expect(resp.type).toEqual("application/json")
        
    //     })
    // });
    // it('RETURNS A 200 STATUS CODE', () => {
    //     return request(server).post('/api/auth/login')
    //     .send({username:'testuser01',password:'testpassword01'})
    //     .then(resp => {
    //         console.log(resp.text)
    //         expect(resp.status).toEqual(200)
        
    //     })
    // });
});

    
    
    
});
