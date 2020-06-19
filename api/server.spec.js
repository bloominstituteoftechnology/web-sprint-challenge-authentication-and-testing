let supertest = require('supertest');

let server = require('./server');

describe("read server.js", () => {
    describe("GET /", () => {
        it("should return 200 OK status", () => {
            return supertest(server)
                .get("/")
                .then(res => {
                    expect(res.status).toBe(200);
                })
        })
    })
})