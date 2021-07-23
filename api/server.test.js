const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

test('sanity', () => {
  expect(true).toBe(true)
})

test('is the correct environment', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})
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
  // fill in empty quotes 
  // test('responds with registered user', async () => {
  //   const res = await request(server).post('/api/auth/register').send({
  //     username: 'bill', 
  //     password: 'abcd',
  //   })
  //   expect(res.body).toMatchObject({id: 1, name: 'bill', password: 'abcd'})
  // })
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
  test('responds with ', async () => {
    const res = await request(server).post('/login').send({
      username: 'bill', 
      password: 'abcd'
    })
    expect(res.body).toMatchObject({})
  })
  test('responds with error when no username', async () => {
    const res = await request(server).post('/login').send({
      username: '', 
      password: 'abcd'
    })
    expect(res.body).toMatchObject({message: 'username and password required'})
  })
})