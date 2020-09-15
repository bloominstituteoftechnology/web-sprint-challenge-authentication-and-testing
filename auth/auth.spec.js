let supertest = require('supertest');
let server = require('../api/server');

let authRouter = require('./auth-router');
let db = require('../database/dbConfig');


    describe("create user", () => {
        it('should register new user', async () => {
            const res = await supertest(server)
                .post("/api/auth/register")
                .send({
                    username: "Reggie",
                    password: "321cba"
                })
            expect(res.statusCode).toBe(201)
            expect(res.type).toBe("application/json")
        })

        it("Should return 200 status",  async() => {
            let user = {
                username: "Reggie",
                password: "321cba"
            }

            return await supertest(server)
            .post('/api/auth/login')
            .send(user)
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.body.message).toEqual("Welcome Reggie!" )

            })
        })
    })