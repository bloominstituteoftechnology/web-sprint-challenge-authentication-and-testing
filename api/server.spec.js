const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig')

// REGISTER ENDPOINT TEST

describe("POST /register", () => {
    const newUser = { username: "JohnDoe", password: "test123" };

    it("should return 201", async () => {
        await request(server)
        .post("/api/auth/register")
        .send(newUser)
        .then(res => expect(res.status).toBe(201))
        .catch(error => console.log(error));
    });

    it("should return a user with id and username", async () => {
        await request(server)
        .post("/api/auth/register")
        .send(newUser)
        .then(async res => {
            const addedUser = await db("users")
            .where({ username: newUser.username })
            .first();
            expect(addedUser).toHaveProperty("id");
            expect(addedUser).toHaveProperty("username");
        })
        .catch(error => console.log(error));
    });
});

// LOGIN ENDPOINT TEST 

describe("POST /login", () => {
    const user = { username: "JohnDoe", password: "test123" };

    it("should return 200", async () => {
        await request(server)
        .post("/api/auth/login")
        .send(user)
        .then(res => expect(res.status).toBe(200))
        .catch(error => console.log(error));
    });

    it("should return a user with o token property", async () => {
        await request(server)
        .post("/api/auth/login")
        .send(user)
        .then(res => expect(res.body).toHaveProperty("token"))
        .catch(error => console.log(error));
    });
});

// JOKES ENDPOINT TEST

describe("GET /jokes", () => {
    it("should return 500 without token", async () => {
        await request(server)
        .get("/api/jokes")
        .then(res => expect(res.status).toBe(500))
        .catch(error => console.log(error));
    });

    it("should return correct content-type", async () => {
        const newUser = { username: "JohnDoe", password: "test123" };
        const user = { username: "JohnDoe", password: "test123" };

        await request(server)
        .post("/api/auth/register")
        .send(newUser)
        .then(async () => {
            await request(server)
                .post("/api/auth/login")
                .send(user)
                .expect(200)
                .then(async res => {
                const token = res.body.token;

                await request(server)
                .get("/api/jokes")
                .set("authorization", token)
                .expect("Content-Type", /json/);
            });
        });
    });
});

// TEST LIST OF USERS WITHOUT TOKEN
describe('When users retrieve a list with out a token', () => {
    it('status code should be 401', async () => {
        const res = await request(server).get('/api/users')
        expect(res.statusCode).toEqual(401);
    });
 
    it('response should be JSON', async () => {
        const res = await request(server).get('/api/users')
        expect(res.type).toMatch(/json/i);
    });
});

// TEST LIST OF JOKES WITHOUT TOKEN
describe('When users retrieve a list with out a token', () => {
    it('status code should be 401', async () => {
        const res = await request(server).get('/api/jokes')
        expect(res.statusCode).toEqual(401);
    });
 
    it('response should be JSON', async () => {
        const res = await request(server).get('/api/jokes')
        expect(res.type).toMatch(/json/i);
    });
 });