const server = require("./server.js")
const db = require("../data/dbConfig.js")
const supertest = require("supertest")

// arange 
describe("test", () => {
  beforeEach(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
  })
  afterAll(async () => {
    db.destory()
  })
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

it("/registers", async () => {
  const res = await supertest(server).post("/api/auth/register").send({ username: "user3", password: "password" })
  expect(res.statusCode).toBe(201)
})

it("checks to see if user already exists when registering", async () => {
  const res1 = await supertest(server).post("/api/auth/register").send({ username: "user", password: "user"})
  expect(res1.statusCode).toBe(201)

  const res2 = await supertest(server).post("/api/auth/register").send({  username: "user", password: "user" })
  expect(res2.statusCode).toBe(422)
})

it("checks to see if the user already exists", async () => {
  const res1 = await supertest(server).post("/api/auth/register").send({ username: 'user', password: 'user' })
  expect(res1.statusCode).toBe(201)

  const res2 = await supertest(server).post("/api/auth/login").send({ username: 'user', password: 'user231' })
  expect(res2.statusCode).toBe(401)
})

it("checks to see if user has logged in", async () => {
  const res = await supertest(server).post("/api/auth/register").send({ username: 'user', password: 'password' })
  expect(res.statusCode).toBe(201)

  const resLogin = await supertest(server).post("/api/auth/login").send({ username: 'user', password: 'password2' })
  expect(resLogin.statusCode).toBe(401)
  expect(resLogin.body.message).toBe("Invalid Credentials")

  const resLogin2 = await supertest(server).post("/api/auth/login").send({ username: 'user', password: 'password' })
  expect(resLogin2.statusCode).toBe(200)
  expect(resLogin2.body.message).toBe("welcome, user")
})