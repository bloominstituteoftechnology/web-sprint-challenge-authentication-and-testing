const request = require('supertest')
const server = require('./server')

test('sanity', () => {
  expect(true).toBe(false)
})

describe('[GET] /jokes', () => {
  test('a token exists', async () => {
    const jokes = await request(server).get('./jokes/jokes-router.js')
    expect(jokes).toBeDefined()
    expect(jokes).toHaveLength()
  })
})
