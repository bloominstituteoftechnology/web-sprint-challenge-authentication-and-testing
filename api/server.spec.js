const supertest = require("supertest")

const server = require("./server.js")
const db = require("../database/dbConfig.js")

describe('POST /Register', () => {
    beforeEach(async () => {
        await db("users").truncate();
    });

    it("should return 201 when passed correct data", () => {
        return supertest(server)
            .post("/api/auth/register")
            .send({ username: "radmosol", password: "password" })
            .then(res => {
                expect(res.status).toBe(201);
            });
    });

    it("should return 400 when passed bad data", () => {
        return supertest(server)
            .post("/api/auth/register")
            .send({ user: "user", password: "password" })
            .then(res => {
                expect(res.status).toBe(400);
            });
    })
})