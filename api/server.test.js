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

afterAll( async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(false)
})

// describe('[GET] /jokes', () => {
//   test('a token exists', async () => {
//     const jokes = await request(server).get('./jokes/jokes-router.js')
//     expect(jokes).toBeDefined()
//     expect(jokes).toHaveLength()
//   })
// })


