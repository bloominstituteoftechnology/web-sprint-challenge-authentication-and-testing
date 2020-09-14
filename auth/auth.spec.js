let supertest = require('supertest');
let server = require('../api/server');

let authRouter = require('./auth-router');
let db = require('../database/dbConfig');


    describe("create user", () => {
        it('should post register', async () => {
            const res = await supertest(server)
                .post("/api/auth/register")
                .send({
                    username: 'Musst',
                    password: 'pls'
                })
            expect(res.statusCode).toBe(201)
            expect(res.type).toBe("application/json")
        })

        it("Should succesfully give 200 status, succesful message",  async() => {
            let user = {
                username: "MustafaCajib",
                password: "abc123"
            }

            return await supertest(server)
            .post('/api/auth/login')
            .send(user)
            .then(res => {
                expect(res.status).toBe(200)
                expect(res.body.message).toEqual("Welcome MustafaCajib!" )

            })
        })
    })