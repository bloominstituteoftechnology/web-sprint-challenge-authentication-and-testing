const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBeTruthy()
})
describe('[POST] /register', () => {
  it('returns a status 201 CREATED', async () => {
    const res = await request(server).post('/register').send({name: 'lilia' })
    expect(res.status).toBe(201)
  })
  it('returns newly created user', async () => {
    const res = await request(server).post('/register').send({name: 'lilia'})
    // console.log(res)
    expect(res.body).toMatchObject({
      id: 4, name: 'lilia'
    })
  })
})