const superTest = require('supertest');
const server = require('../api/server');
const db = require("../database/dbConfig")
const user_valid = require('../auth/user_validation')
const bcrypt = require("bcryptjs");

beforeAll(async () => {
    // run the seeds programatically before each test to start fresh
    await db.seed.run()
})

afterAll(async () => {
    // close the database connection so the test process doesn't hang or give a warning
    await db.destroy()
})

async function CreateTest(person){
    const [id] = await db('users').insert(person, 'id');

    return db('users')
        .where({ id })
        .first();
}




describe("User Register Tests", ()=>{
    it("POST / tests registering of new user and Loggin in", async()=>{
        let res = await superTest(server)
            .post("/api/auth/register")
            .send({username:"testerBean", password:"BeanPassword"})
        expect(res.statusCode).toBe(201)
        expect(res.type).toBe("application/json")
        expect(res.body.username).toBe("testerBean")

    })

    it("POST / test registering user without the proper information {username}. Should FAIL", async ()=>{
        const res = await superTest(server)
            .post("/api/auth/register")
            .send({
                username: '',
                password:'asfdasdfas',
            })
        expect(res.statusCode).toBe(409)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toBe("Please enter a username")
    })

    it("POST / test registering user without the proper information {password}. Should FAIL", async ()=>{
        const res = await superTest(server)
            .post("/api/auth/register")
            .send({
                username: 'asfdasdfas',
                password:'',
            })
        expect(res.statusCode).toBe(409)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toBe("Please enter a password")
    })

    it("POST / test registering user without the proper information {password}. Should FAIL", async ()=> {

    });

})

describe("Test Logging in a user", ()=>{
    it("POST/ Login user should return a 200", async ()=>{

        const res = await superTest(server)
            .post("/api/auth/login")
            .send({username:"testerBean", password:"BeanPassword"})
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toBe("Welcome testerBean!")
    },99999)
    it("POST / Login user with bad credentials should FAIL", async () =>{
        const res = await superTest(server)
            .post("/api/auth/login")
            .send({username:"testerBean2", password:"BeanPassword"})
        expect(res.statusCode).toBe(401)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toBe("Invalid Credentials")
    })
})

