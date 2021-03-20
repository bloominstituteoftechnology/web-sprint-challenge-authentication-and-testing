const request = require('supertest');

const server = require('./server.js');
const db = require('../data/dbConfig.js');

const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJlZ2lzdGVyVGVzdCIsImlhdCI6MTYxNjIzMjA1OCwiZXhwIjoxNjE2NjY0MDU4fQ.DoU3URf2dLy8T3csO2UDLubNYbBiTDqQSJISVU8QyCg"

const testUser = { username: "registerTest", password: "registerPass" }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async (done) => {
  await db.destroy()
  done()
})

describe("server", function () {

    describe("GET /", function () {
      return request(server)
        .get("/")
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
  

  describe("POST /api/auth/register", function () {
    beforeEach(async () => {
      await db("users").truncate();
    });
    it("return 201 on great success", async () => {
      const response = await request(server)
        .post("/api/auth/register")
        .send({ username: "registerTest", password: "registerPass" })
        expect(response.status).toBe(201);
    });
    it("should return a property of username", function () {
      return request(server)
      .post("/api/auth/register")
      .send({ username: "registerTest", password: "registerPass" })
      .then(res => {
        expect(res.body.username).toBe("registerTest");
      });
    });
  });

  describe("POST /api/auth/login", function () {
    beforeEach(async () => {
      await db("users").truncate()
      await request(server)
        .post("/api/auth/register")
        .send({ username: "registerTest", password: "registerPass" })
    })
    it("return 200 on success", async () => {
      const response = await request(server)
        .post("/api/auth/login")
        .send({ username: "registerTest", password: "registerPass" })
        expect(response.status).toBe(200);
    });
    it("should return a welcome message", function () {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "registerTest", password: "registerPass" })
        .then(res => {
          expect(res.body.message).toBe("Welcome!");
        });
    });
  });

  describe("GET /api/jokes", function () {
    beforeEach(async () => {
      await db('users').truncate()
      await request(server).post('/api/auth/register').send(testUser)
      })
    it("should ask to log in if no token", function() {
      return request(server)
        .get("/api/jokes")
        .then(res => {
          expect(res.body.message).toBe( "Please log in." )
        })
    })
    it("should display jokes if has token", async function () {
      const { body: { token } } = await request(server).post("/api/auth/login").send(testUser)
      const res = await request(server).get('/api/jokes').set("Authorization", token)
      expect(JSON.stringify(res.body)).toEqual(expect.stringMatching('Did you hear about the guy whose'))
        }, 500)
  })

});