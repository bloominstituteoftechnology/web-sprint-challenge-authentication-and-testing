const server = require('../api/server.js');
const request = require('supertest');

    
describe("jokes", () => {
    describe("GET request for jokes", () =>{
        it("should return 400 status code when not logged in", async () => {
            const res = await request(server).get("/api/jokes");
            expect(res.status).toBe(400);
        })
        it("should return json", async() => {
            const res = await request(server).get("/api/jokes");
            expect(res.type).toBe("application/json");
        });
    });




    describe('user registration', () => {
        test('500 expected to return', async () => {
            const res = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'user',
                password: 'pass'
            })
            expect(res.status).toBe(500);
        })
        test('register json', async () =>{
            const res = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'user',
                password: 'pass'
            })
            expect(res.type).toBe('application/json');
        })
    })

})

describe('user login',  () => {
    test('should return 500', async () => {
        const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'user',
                password: 'pass'
    })
    expect(res.status).toEqual(500);
    })
    test('login json', async () => {
        const res = await request(server)
        .post('/api/auth/login')
        .send({ 
            username: 'user',
            password: 'pass'  
        })
    expect(res.type).toBe('application/json');
    })
    
})