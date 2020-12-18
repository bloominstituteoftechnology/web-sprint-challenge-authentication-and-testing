const request = require('supertest')
const server = require('./api/server')
const testUser = {username: 'test', password: 'test'}
const db = require('./database/dbConfig')


// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})



describe('server.js', () => {
    describe('Get request for jokes', () => {
        it('should return 401', async () => {
            const res = await request(server).get('/api/jokes')
        expect(res.status).toBe(401);
        });
        it('should return json', async() => {
            const res = await request(server).get('/api/jokes');
            expect(res.type).toBe('application/json')
        });
    });
    describe("registering", () => {
        it('status code should be 201 ', async () => {
            await db('users').truncate()
            const res = await request(server)
            .post('/api/auth/register')
            .send(testUser);
            expect(res.status).toBe(201)
        });
        it('should return a status code of 500 when the invalid information is sent', async () => {
            const res = await request(server)
            .post('/api/auth/register')
            .send({user: "test", pass: "jabroni" });
            expect(res.status).toBe(500);
        });
    });
    describe("login with user", ()=> {
        it('shouls work when user is valid', async () => {
            const res = await request(server)
            .post('/api/auth/login')
            .send(testUser);
            expect(res.status).toBe(500)
        })
        it('should fail with invalid user', async () => {
            const res = await request(server)
            .post('/api/auth/login')
            .send({ username: 'does not exist', password: 'never entered' })
            expect(res.status).toBe(500)
        })
    });
});