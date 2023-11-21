
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('../api/server')

beforeAll( async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach( async () => {
  await db.seed.run()
})

// afterAll( async () => {
//   await db.destroy()
// })


test('sanity', () => {
  expect(true).toBe(true)
})






describe('[POST] /api/auth/register', () => {
  test('gets success status', async () => {
    const creds = {username: 'hello', password: '1234'}
    const res = await request(server).post('/api/auth/register').send(creds)
    expect(res.status).toBe(201)
  })
  test('adds credentials to database', async () => {
    const creds = {username: 'hello', password: '1234'}
    await request(server).post('/api/auth/register').send(creds)
    const res = await db('users').select('username').where('username', creds.username).first()
    expect(res.username).toBe(creds.username)
  })
})






describe('[POST] /api/auth/login', () => {
  test('gets a success status', async () => {
    const creds = {username: 'hello', password: '1234'}
    const res1 = await request(server).post('/api/auth/register').send(creds)
    expect(res1.status).toBe(201)
    const res = await request(server).post('/api/auth/login').send(creds)
    expect(res.status).toBe(200)
  })
  test('valid login gets a token', async () => {
    const creds = {username: 'hello', password: '1234'}
    await request(server).post('/api/auth/register').send(creds)
    const res = await request(server).post('/api/auth/login').send(creds)
    expect(res.body.token).toBeDefined()
  })
})






describe('[GET] /api/jokes', () => {
  test.only('valid token gets the jokes', async () => {

    const creds = {username: 'hello', password: '1234'}
    const res1 = await request(server).post('/api/auth/register').send(creds)
    expect(res1.status).toBe(201)

    const res2 = await request(server).post('/api/auth/login').send(creds)
    expect(res2.body.token).toBeDefined()

    const res3 = await request(server).get('/api/jokes').set('Authorization', res2.body.token)
    expect(res3.body.message).toHaveLength(3) 
  })



  test('no token gets error', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.body.jokes).not.toBeDefined()
    expect(res.status).toBe(401) 
  })
})
