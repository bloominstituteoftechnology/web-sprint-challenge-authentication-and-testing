const superTest = require('supertest');
const server = require('../api/server');

test("GET / and test its up and returning the welcome data", async ()=>{
    const res = await superTest(server).get("/")
    expect(res.statusCode).toBe(200)
    expect(res.type).toBe("application/json")
    expect(res.body.data).toBe("welcome to the api")
})