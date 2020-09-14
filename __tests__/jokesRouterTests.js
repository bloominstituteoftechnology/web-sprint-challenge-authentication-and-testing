const superTest = require('supertest');
const server = require('../api/server');
const db = require("../database/dbConfig")

beforeAll(async () => {
    // run the seeds programatically before each test to start fresh
    await db.seed.run()
})

afterAll(async () => {
    // close the database connection so the test process doesn't hang or give a warning
    await db.destroy()
})



describe("Jokes Router Integration Tests",  ()=> {



    it("POST / Initial test to ensure unAuth user cannot access endpoints", async ()=>{
        let res = await superTest(server)
            .get("/api/jokes")
        expect(res.statusCode).toBe(401)
        expect(res.type).toBe("application/json")
        expect(res.body.you).toBe("shall not pass!")

    })


});