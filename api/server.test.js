// Write your tests here
const db = require('../data/dbConfig');
const server = require('./server');
const tokenBuilder = require('./auth/token-builder');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const model = require('./auth/auth-model');
const { hpkp } = require('helmet');

//AAAAAAAAAAAAAAAAAAAAAAAAAAA

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback() // takes back the db to the stone age
  await db.migrate.latest() // bringing to the latest
})
beforeEach(async () => {
  await db('users').truncate() // wipes rows, and resets id numbers
})
afterAll(async () => {
  await db.destroy()
})


//R E G I S T E R 
describe('[POST] /api/auth/register', () =>{
  //doesnt let you register without a password

  it('doesnt let you register without a password', async () =>{
    let res = await request(server).post('/api/auth/register').send({ username: 'cnc', password:''})
    expect(res.status).toBe(400)
  });

  //lets you register with both a password and username
  it('lets you register with both a password and username', async () =>{
    let res = await request(server).post('/api/auth/register').send({ username: 'cnc', password:'123'})
    expect(res.body.username).toMatch('cnc')
  });
})
//L O G I N 

describe('[POST] /api/auth/login', async () =>{
  //logs you in with right password and username
  it('logs you in with right password and username', async ()=>{
    const data = await request(server).post('/api/auth/register').send({username:"ghost", password:"doodoo"})
    // console.log(data.body)
    const req = await request(server).post('/api/auth/login').send({username:"ghost", password:"doodoo"})
    expect(req.body.message).toMatch("welcome, ghost")
  });
  //doesnt let you login with wrong password 
  it('doesnt let you login with wrong password ',async ()=>{
    const data = await request(server).post('/api/auth/register').send({username:"ghost", password:"doodoo"})
    const req = await request(server).post('/api/auth/login').send({username:"ghost", password:"false"})
    expect(req.body.message).toMatch("invalid credentials");
  })
})
//J O K E S 
//cant see jokes if not logged in
//can see jokes when logged in
describe('[POST] /api/jokes', async () =>{
  it('can see jokes when logged in', async ()=>{
    const signup = await request(server).post('/api/auth/register').send({ username: "cnc", password: "123" })
    const login = await request(server).post('/api/auth/login').send({ username: "cnc", password: "123" })
    let getJokes = await request(server).get('/api/jokes').set('Authorization', login.body.token)
    expect(getJokes.body).toHaveLength(3)
  });

  it('cant see jokes when token does not exist', async ()=>{
    let getJokes = await request(server).get('/api/jokes')
    expect(getJokes.status).toBe(401)
  });
})