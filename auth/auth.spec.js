const supertest = require("supertest")
const server = require("../api/server")
const db = require("../database/dbConfig")
require('dotenv').config({
    path: '.env'
})


afterAll(async () => {
	// close the database connection so the test process doesn't hang or give a warning
	await db.destroy()
})

let token;
beforeEach((done) => {
    supertest(server)
    .post('/api/auth/login')
    .send({
        username: 'user7',
        password: 'pass7'
    })
    .end((err, response) => {
        token = response.body.token;
        done();
    })
})

describe('Test custom header', function() {
    it.only('sets header', function(done) {
      supertest(server)
        .get('/api/auth/querystring')
        .set("x-access-token", token)
        .expect(200)
        .end(function(err, res){
            if (err) return done(err);
            done();
        });
    });
  });

describe('GET /api/jokes/', function() {

    it('should require authorization', async () => {
        
        const res = await supertest(server)
            .get("/api/jokes")
            .send({
                username: 'user7',
                password: 'pass7'
            })
        expect(res.statusCode).toBe(401)
        expect(res.type).toBe("application/json")
    })


    it('should return json', function(done) {
        supertest(server)
            .get('/api/jokes/')
            .set('Cookie', [`token=${token}`])
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                console.log('res ', res.body);
                res.body.items.length.should.be.above(0);
                done();
            });
    });

});

describe('create user', function(){

    it('should post register', async () => {
		const res = await supertest(server)
			.post("/api/auth/register")
			.send({
                username: 'user7',
                password: 'pass7'
            })
		expect(res.statusCode).toBe(201)
		expect(res.type).toBe("application/json")
    })
})

describe('sign in', function(){
    it ('should post to login', async () => {
        const res = await supertest(server)
            .post("/api/auth/login")
            .send({
                username: 'user1',
                password: 'pass100'
            })
        expect(res.statusCode).toBe(401)
        expect(res.type).toBe("application/json")
        
    })
})

