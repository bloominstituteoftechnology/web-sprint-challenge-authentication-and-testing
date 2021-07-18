// Write your tests here
const server = require("./server.js")
const db = require("../data/dbConfig.js")
const supertest = require("supertest")



// ARRANGE
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



// ACT
describe("user tests", () => {


  it("registers a new user", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUser', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe("testUser")
  })


  it("checks that the username is unique before registering", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'uniqueUsername', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe("uniqueUsername")

    //Try registering testUser again
    const res2 = await supertest(server).post("/api/auth/register").send({ username: 'uniqueUsername', password: 'testPassword' })
    expect(res2.statusCode).toBe(400)
    expect(res2.body.message).toBe("Username is already taken. Please use another username.")
  })


  it("checks that the user already exists before logging in", 
  
  async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUser', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('testUser')

    //  Checks where another user testUser exists in the DB or not
    const res3 = await supertest(server).post("/api/auth/login").send({ username: 'userNotInDB', password: 'testPassword' })
    expect(res3.statusCode).toBe(401)
    expect(res3.body.message).toBe('invalid credentials')

  })


  it("checks that an existing user is successfully logged in", 
  
  async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUser', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('testUser')

    const res4 = await supertest(server).post("/api/auth/login").send({ username: 'testUser', password: 'testPassword' })
    expect(res4.statusCode).toBe(200)
    expect(res4.body.message).toBe("welcome, testUser")

  })
})
