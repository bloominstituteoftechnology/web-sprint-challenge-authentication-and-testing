const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

test('is the correct environment', () => {
  expect(process.env.DB_ENV).toBe('testing')
})
beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
}) // migrate
beforeEach(async () => {
  await db.seed.run()
}) // truncate and seed fresh data
afterAll(async () => {
  await db.destroy()
}) // disconnect from the db