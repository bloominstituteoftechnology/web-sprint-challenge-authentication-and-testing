//Unit tests - small parts of the code
//Intergration testing will be testing parts of the system that work with one another
//End to end tests - for endpoints


//3 libraries in particular:

//1. jest
//2. supertest - http assertions library
//3. Cross-env - NPM module that deal with OS inconsistencies acroess platforms

// You can avoid polluting the database by CREATING a new DB for testing

const request = require('supertest');
const server = require('./server');

const db = require('../database/dbConfig');
const { expectCt } = require('helmet'); // Broken ??
const { as } = require('../database/dbConfig');

const testUser = { username: "sprinter", password: "testing"};

describe('server.js', () =>{
    describe("Get REQUEST for jokes", () =>{
            it("should send a status code of 400 when not logged in", async () =>{
                const res = await request(server).get("/api/jokes")
                expect(res.status).toBe(400)
            })
            it("should return JSON", async () =>{
                const res = await request(server).get("/api/jokes")
                expect(res.type).toBe("application/json")
            })
    })
    describe('registering NEW USER', () => {
        it("should return status 201 when adding new user", async () => {
            await db('users').truncate() //Clearing he table ..is that wise on a production/development db?
            const res = await request(server)
                .post("/api/auth/register")
                .send(testUser);
                expect(res.status).toBe(201)
                console.log(testUser)
        })
        it("should return status 500 with invaid user", async () => {
            await db('users').truncate() //Clearing he table ..is that wise on a production/development db?
            const res = await request(server)
                .post("/api/auth/register")
                .send({user: "test", pass: "pass"});
            expect(res.status).toBe(500)
        })
    })
    // describe('LOGIN with user', () => {
    //     it("should return status 200 when loggin in with user", async () => {
    //         //await db('users').truncate() //Clearing he table ..is that wise on a production/development db?
    //         const res = await request(server)
    //             .post("/api/auth/login")
    //             .send(testUser);
    //             expect(res.status).toBe(200)
    //     })
    //     it("should return status 401 when loggin in with invalid user", async () => {
    //         //await db('users').truncate() //Clearing he table ..is that wise on a production/development db?
    //         const res = await request(server)
    //             .post("/api/auth/login/")
    //             .send({username: "test ", password: "test"});
    //             expect(res.status).toBe(401)

    //     })
    //     })
    describe("POST /login", () => {

        it("should return 200", async () => {
            await request(server)
                .post("/api/auth/login")
                .send(testUser)
                .then(res => expect(res.status).toBe(200))
                .catch(error => console.log(error));
        });

        it("should return a user with o token property", async () => {
            await request(server)
                .post("/api/auth/login")
                .send(testUser)
                .then(res => expect(res.body).toHaveProperty("token"))
                .catch(error => console.log(error));
        });
    });

    })

