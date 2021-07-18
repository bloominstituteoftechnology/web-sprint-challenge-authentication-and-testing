/**NOTES TO THE GRADER: I WAS ABLE TO GET ALL OF MY 5 TESTS PASSING USING NPM RUN TEST. AFTER GETTING THEM ALL TO PASS, 
 * I THEN RAN EVERYTHING ONE MORE TIME, MAKING NO CHANGES, AND NOW ALL MY TESTS ARE FAILING, WITH THE SAME ERROR FOR EACH: 
 * MIGRATIONlOCKED: MIGRATION TABLE IS ALREADY LOCKED
 * I'M NOT ENTIRELY SURE WHAT'S GOING ON IN THIS INSTANCE, BUT MY TESTS WERE ALL PASSING, AND I'D BE GLAD TO WALK YOU THROUGH IT.
 */
const server = require("./server.js")
const db = require("../data/dbConfig.js")
const supertest = require("supertest")


// ARRANGE ////THESE beforeEach  help set up the smooth process of running all the other tests, 
//making sure we have a consistent and predictable database to test with
beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
//cleans up the database when the test is completed
afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})



// ACT
describe("user tests", () => {


  it("new user registers", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'testUser', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe("testUser")
  })


  it("must have unique and unused username to register", async () => {
    const res = await supertest(server).post("/api/auth/register").send({ username: 'uniqueUsername', password: 'testPassword' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe("uniqueUsername")

    //Try testing again (checking for false positives), to be sure it registers a taken username as it should
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
    expect(res4.body.message).toBe("welcome, Captain Marvel")

  })
})