// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

beforeAll( async ()=> {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async ()=> {
  await db('users').truncate()
})

afterAll( async ()=> {
  await db.destroy()
})
