const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

test('sanity', () => {
  expect(true).toBe(true)
})

test('is the correct environment', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

// THIS SECTION OF CODE IS NOT WORKING DUE TO THE FOLLOWING ERROR WHICH I COULDN'T RESOLVE:
// ENOENT: no such file or directory, scandir '/Users/johnvehmeyer/Desktop/lambdaProjects/web-sprint-challenge-authentication-and-testing/seeds'
// beforeAll(async () => {
//   await db.migrate.rollback()
//   await db.migrate.latest()
// })
// beforeEach(async () => {
//   await db.seed.run()
// }) 
// afterAll(async () => {
//   await db.destroy()
// })

describe('[POST] /register', () => {
  test('responds with error when no username', async () => {
    const res = await request(server).post('/api/auth/register').send({
      username: '', 
      password: 'abcd',
    })
    expect(res.body).toMatchObject({message: 'username and password required'})
  })
  test('responds with error when no password', async () => {
    const res = await request(server).post('/api/auth/register').send({
      username: 'bill', 
      password: '',
    })
    expect(res.body).toMatchObject({message: 'username and password required'})
  })
})

describe('[POST] /login', () => {
  test('responds with error when no username', async () => {
    const res = await request(server).post('/login').send({
      username: '', 
      password: 'abcd'
    })
    expect(res.status).toBe(404)
  })
  test('responds with error when no password', async () => {
    const res = await request(server).post('/api/auth/login').send({
      username: 'bill', 
      password: '',
    })
    expect(res.body).toMatchObject({message: 'username and password required'})
  })
})