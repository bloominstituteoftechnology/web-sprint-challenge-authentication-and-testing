// Write your tests here
// test('sanity', () => {
//   expect(true).toBe(true)
// })

const request = require("supertest")
const server = require("../api/server")
const db= require("../data/dbConfig")

// beforeEach(async () => {
// 	await db.seed.run()
// })

// afterAll(async () => {
// 	await db.destroy() // closes the database connection
// })

// describe('get request to view jokes', ()=>{
//     test("GET /", async () => {
//         const res = await request(server).get("/api/jokes/")
//         expect(res.statusCode).toBe(200)
//         expect(res.type).toBe("application/json")
//         expect(res.body.length).toBe(3)
//         expect(res.body[0].joke).toBe("I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later.")
//     })  
// })

describe('POST /register user', ()=>{
    test("checks the status code", async () => {
      await db('users').truncate()
        const res = await request(server).post("/api/auth/register").send({username: 'J', password: 'T'})
        expect(res.status).toBe(201)
        expect(res.type).toBe("application/json")
    })  

    test("checks the data sent", async () => {
      await db('users').truncate()
        const res = await request(server).post("/api/auth/register").send({username: 'J', password: 'T'})
        expect(res.body.id).toBe(1)
        expect(res.body.username).toBe('J')
    })  
})

describe('POST /login users', ()=>{
  test("logs in user", async () => {
      const res = await request(server).post("/api/auth/login").send({username: 'J', password: 'T'})
      expect(res.statusCode).toBe(200)
      expect(res.type).toBe("application/json")
      expect(res.body.message).toBe('Welcome, J!')
  })  

  test("rejects user with invalid credentials and gives correct error code", async () => {
    const res = await request(server).post("/api/auth/login").send({username: 'John', password: '$2a$14$F8VPm/IOSys2zUYP5ja0lObZol/ubBgnJ8YDUhexxskdyfe4CBtQm'})
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('invalid credentials')
}) 
})


