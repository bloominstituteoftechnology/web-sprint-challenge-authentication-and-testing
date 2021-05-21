// Write your tests here
const db = require('../data/dbConfig');
const server = require('./server');
const tokenBuilder = require('./auth/token-builder');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const model = require('./auth/auth-model')

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
//doesnt let you register without a password
//lets you register with both a password and username
describe('[POST] /api/auth/register', () =>{
  it('doesnt let you register without a password', async () =>{
    let res = await request(server).post('/api/auth/register').send({ username: 'cnc', password:null})
    expect(res.body.message).toMatch(/username and password required/i)
    expect(res.status).toBe(400)
  });

  it('lets you register with both a password and username', async () =>{
    let res = await request(server).post('/api/auth/register').send({ username: 'cnc', password:'123'})
    expect(res.body.username).toMatch('cnc')
  });
})
//L O G I N 
//doesnt let you login with wrong password 
//logs you in with right password and username
describe('[POST] /api/auth/login', async () =>{
  beforeEach(async () =>{
    await db('users').insert(
      {username:'cnc', password:'123'}
    )
  })
  it('doesnt let you login with wrong password or wrong username', async ()=>{
    let res = await request(server).post('/api/auth/login').send({ username: "cnc", password: "1234" })
    expect(res.body.message).toMatch(/invalid credentials/i)
  });

  it('logs you in with right password and username', async ()=>{
    await db('users').insert(
      {username:'cookie', password:'123'}
    )
    let us = await db('users')
    console.log('BISCOITO')
    console.log(us)
    let data = await request(server).post('/api/auth/login').send({ username: "cookie", password: "123" })
    console.log(`FRUTA2 ${data[0]}`)
    expect(data.body.message).toMatch(/welcome, cnc/i)
  });
})
//J O K E S 
//cant see jokes if not logged in
//can see jokes when logged in
describe('[POST] /api/jokes', async () =>{
  it('can see jokes when logged in', async ()=>{
    const login = await request(server).post('/api/auth/login').send({ username: "cnc", password: "123" })
    let getJokes = await request(server).get('/api/jokes').set('Authorization', login.body.token)
    expect(getJokes.body).toHaveLength(3)
  });

  it('cant see jokes when token does not exist', async ()=>{
    let getJokes = await request(server).get('/api/jokes')
    expect(getJokes.body.message).toMatch(/token required/i)
  });
})