const server = require("./server.js");
const db = require("../data/dbConfig.js");
const supertest = require("supertest");



// Write your tests here

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe("user testing", () => {

  it("register a user", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUsername', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
  })

  it("checks if username is unique / middleware function", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'uniqueUsername', password: 'uniquePassword' })
    expect(res.statusCode).toBe(201)

  })

  it("checks if user already exists", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: "checkIfUserExists", password: "checkIfUserExists" })
    expect(res.statusCode).toBe(201)

  })

  it("", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: "checkIfUserLoggedIn", password: "checkIfUserLoggedIn" })
    expect(res.statusCode).toBe(201)

    const resRoundTwo = await supertest(server).post("/api/auth/login").send({ username: "checkIfUserLoggedIn", password: "checkIfUserLoggedIn" })
    expect(resRoundTwo.statusCode).toBe(200)

  })
})