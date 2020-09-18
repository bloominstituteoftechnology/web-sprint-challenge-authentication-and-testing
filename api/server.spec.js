const supertest = require("supertest");

const server = require("./server.js");
const db = require("../database/dbConfig.js");

describe('server', () => {
  describe("POST /api/auth/register", () => {
    beforeEach(async () => {

        await db("users").truncate();
    });

    it("should return 201 when passed correct data", () => {
        return supertest(server)
            .post("/api/auth/register")
            .send({ username: "steve", password: "pass" })
            .then(res => {
                expect(res.status).toBe(201);
            });
    });

    it("should fail with code 400 if passed incorrect data", () => {
        return supertest(server)
            .post("/api/auth/register")
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    it("should insert the user into the database", async () => {
      const res = await supertest(server).post("/api/auth/register").send({ username: "steve", password: "pass" });

      expect(res.body.data.username).toBe('steve');
  });

  });

  describe("POST /api/auth/login", () => {
    it("should return 200 when passed correct data", () => {
        return supertest(server)
            .post("/api/auth/login")
            .send({ username: "steve", password: "pass" })
            .then(res => {
                expect(res.status).toBe(200);
                token = res.body.token;
            });
    });

    it("should fail with code 401 if passed incorrect data", () => {
        return supertest(server)
            .post("/api/auth/login")
            .send({ username: "steves", password: "passw" })
            .then(res => {
                expect(res.status).toBe(401);
            });
    });

  });

  describe("GET /api/users", () => {
    it("should return HTTP status code 401", () => {
        return supertest(server)
            .get("/api/jokes")
            .then(res => {
                expect(res.status).toBe(401);
            });
    });

    it("should return JSON", async () => {
      const res = await supertest(server).get("/api/jokes");

      expect(res.type).toMatch(/json/i);
    });

  });

});