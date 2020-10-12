//Unit tests - small parts of the code
//Unit testing will be testing parts of the system that work in tandem
//End to end tests - for endpoints


//3 libraries in particular:
//1. jest
//2. supertest - http assertions library
//3. Cross-env - NPM module that deal with OS inconsistencies acroess platforms

// You can avoid polluting the database by CREATING a new DB for testing

const request = require('supertest');
const server = require('./server');

const db = require('../database/dbConfig');
const { expectCt } = require('helmet');
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

})