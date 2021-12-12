const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig');
require('dotenv').config();

test('Expect test env to be testing', () => {
  expect(process.env.NODE_ENV).toEqual('testing')
});

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
});

afterAll(async () => {
  await db.destroy()
})

beforeEach(async () => { 
    await request(server).post('/api/auth/register')
      .send({ username: "NewMabyBis",
              password: "sidurwejfnjkfnvsuvbnsejkrvservhbs"
      })
  })

describe('[POST] /register', () => {
  test('add user to the database', async () => {
    const users = await db('users')
    expect(users).toHaveLength(1)
  })
  test('check the new user is added', async () => {
    const users = await db('users')
    expect(users[0].username).toEqual("NewMabyBis")
  })
  test('check the new user is added', async () => {
    const users = await db('users')
    expect(users[0].password).not.toBe("sidurwejfnjkfnvsuvbnsejkrvservhbs")
  })
  
})

describe('[POST] /login', () => {
  let login
  beforeEach(async () => {
    login = await request(server).post('/api/auth/login')
      .send({ username: "NewMabyBis",
              password: "sidurwejfnjkfnvsuvbnsejkrvservhbs"
      })
  })

  test('User login contains  token', async () => {
    expect(login.text).toMatch('token')
  })
  test('User login contains  token', async () => {
    expect(login.text).toMatch('message')
  })

  test('Greeting the user', async () => {
    expect(login.text).toMatch('welcome, NewMabyBis')
  })
})

