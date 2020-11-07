const supertest = require("supertest")
const server = require("../api/server")
const db = require("../database/dbConfig")

beforeAll(async () => {
  await db("users").truncate()
})

describe("users integration tests", () => {
  it("registers a new user", async () => {
    const res = await supertest(server)
      .post("/register")
      .send({ username: "neu", password: "neuwrld" })
    expect(res.statusCode).toBe(201)
    expect(res.type).toBe("application/json")
  })
})

