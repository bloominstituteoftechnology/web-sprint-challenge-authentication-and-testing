const request = require('supertest');
const db = require("../database/dbConfig");
const auth = require("./auth-model");
const server = require('../api/server');


describe('Register User', () => {
    it ('should register users', async() => {
        const newUser = {username: "gambino", password: "password"};
        const res = await request(server)
        .post("/api/auth/register")
        .send(newUser);
        expect(res.status).toBe(201)
        expect(res.type).toBe('application/json')
    });

});

describe('Login User', () => {
    it('should login the user', async () => {
        
        const res = await request(server)
            .post('/api/auth/login')
            .send({ username: "gambino", password: "password" })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('token')
        expect(res.type).toBe('application/json')
    })
})

// beforeEach(async () => {
//     await db("users").truncate();
// });