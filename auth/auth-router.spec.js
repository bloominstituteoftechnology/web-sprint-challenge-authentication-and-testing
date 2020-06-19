let server = require('../api/server');

let supertest = require('supertest');

let authRouter = require('./auth-router');
let db = require('../database/dbConfig');


    describe("POST /login flow", () => {
        it('should return status 200 OK', async () => {
            let user = {
                username: "legacy",
                password: "mypw"
            }
            return  await supertest(server)
                .post('/api/auth/register')
                .send(user)
                .then(res => {
                    // console.log(res.body, 'asdfasdf')
                    // console.log(res.status)
                    expect(res.status).toBe(201);
                    // expect(res.body.data.username).toBe(user.username)
                })
        })
        
        it("Should succesfully give 200 status, succesful message",  async() => {
            let user = {
                username: "legacy",
                password: "mypw"
            }

            return await supertest(server)
            .post('/api/auth/login')
            .send(user)
            .then(res => {
                console.log(res.status, "from login")
                console.log(res.body, 'from login flow')
                expect(res.status).toBe(200)
                expect(res.body.message).toEqual("Login success" )

            })
        })
    })

describe("auth-router.js", () => {
    beforeEach(async () => {
        await db("users").truncate();
    })

    describe("POST /register", () => {
        it('should return status 201 OK', async () => {
            let user = {
                username: "legacy",
                password: "mypw"
            }
            return await supertest(server)
                .post('/api/auth/register')
                .send(user)
                .then(res => {
                    console.log(res.body)
                    expect(res.status).toBe(201);
                    expect(res.body.data.username).toBe(user.username)
                })
        })

        it('should give 400 error for no username or password', async () => {
            let user = {
                username: "Bass",
                password: null
            }

            return await supertest(server)
            .post('/api/auth/register')
            .send(user)
            .then(res => {
                console.log(res.status)
                console.log(res.body)
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: 'Provide a username and password' })
            })
        })
    })

    describe("POST /login", () => {
        it("should return status 401", async () => {
            let user = {
                username: "legacy",
                password: "mypw"
            }
            return await supertest(server)
            .post('/api/auth/login')
            .send(user)
            .then(res => {
                console.log(res.status, 'fail login')
                expect(res.status).toBe(401) // no record on server
            })
        })
    })

    // describe("POST /login flow", () => {
    //     it('should return status 200 OK', async () => {
    //         let user = {
    //             username: "legacy",
    //             password: "mypw"
    //         }
    //         return  await supertest(server)
    //             .post('/api/auth/register')
    //             .send(user)
    //             .then(res => {
    //                 // console.log(res.body, 'asdfasdf')
    //                 // console.log(res.status)
    //                 expect(res.status).toBe(201);
    //                 // expect(res.body.data.username).toBe(user.username)
    //             })
    //     })
        
    //     it("Should succesfully give 200 status, succesful message",  async() => {
    //         let user = {
    //             username: "legacy",
    //             password: "mypw"
    //         }

    //         return await supertest(server)
    //         .post('/api/auth/login')
    //         .send(user)
    //         .then(res => {
    //             console.log(res.status, "from login")
    //         })
    //     })
    // })
})