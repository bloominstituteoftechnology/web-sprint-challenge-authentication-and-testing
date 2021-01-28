const request = require('supertest')
const server = require('./api/server')
const db = require('./data/dbConfig')

const userA = { username: 'foo', password: 'bar' }
const userB = { username: 'fizz', password: 'buzz' }
const userC = { username: 'foo', password: 'buzz' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async (done) => {
  await db.destroy()
  done()
})

it('sanity check jokes', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  // 👉 AUTH
  // 👉 AUTH
  // 👉 AUTH
  describe('auth endpoints', () => {
    describe('[POST] /api/auth/register', () => {
      beforeEach(async () => {
        await db('users').truncate()
      })
      it('adds a new user with a bcrypted password to the users table on success', async () => {
        await request(server).post('/api/auth/register').send(userA)
        const user = await db('users').first()
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('username')
        expect(user).toHaveProperty('password')
        expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/)
        expect(user.username).toBe(userA.username)
      }, 500)
      it('responds with the new user with a bcrypted password on success', async () => {
        const { body } = await request(server).post('/api/auth/register').send(userA)
        expect(body).toHaveProperty('id')
        expect(body).toHaveProperty('username')
        expect(body).toHaveProperty('password')
        expect(body.password).toMatch(/^\$2[ayb]\$.{56}$/)
        expect(body.username).toBe(userA.username)
      }, 500)
      it('responds with a proper status code on success', async () => {
        const { status } = await request(server).post('/api/auth/register').send(userA)
        expect(status + '').toMatch(/2/)
      }, 500)
      it('responds with an error status code if username exists in users table', async () => {
        await request(server).post('/api/auth/register').send(userA)
        const { status } = await request(server).post('/api/auth/register').send(userA)
        expect(status + '').toMatch(/4|5/)
      }, 500)
      it('responds with "username taken" message if username exists in users table', async () => {
        await request(server).post('/api/auth/register').send(userA)
        const { body } = await request(server).post('/api/auth/register').send(userA)
        expect(JSON.stringify(body)).toEqual(expect.stringMatching(/taken/i))
      }, 500)
      it('responds with an error status code if username or password are not sent', async () => {
        let res = await request(server).post('/api/auth/register').send({})
        expect(res.status + '').toMatch(/4|5/)
        res = await request(server).post('/api/auth/register').send({ username: 'foo' })
        expect(res.status + '').toMatch(/4|5/)
        res = await request(server).post('/api/auth/register').send({ password: 'bar' })
        expect(res.status + '').toMatch(/4|5/)
      }, 500)
      it('responds with "username and password required" message if either is not sent', async () => {
        let res = await request(server).post('/api/auth/register').send({})
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
        res = await request(server).post('/api/auth/register').send({ username: 'foo' })
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
        res = await request(server).post('/api/auth/register').send({ password: 'bar' })
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
      }, 500)
    })
    describe('[POST] /api/auth/login', () => {
      beforeEach(async () => {
        await db('users').truncate()
        await request(server).post('/api/auth/register').send(userA)
      })
      it('responds with a proper status code on successful login', async () => {
        const res = await request(server).post('/api/auth/login').send(userA)
        expect(res.status).toBe(200)
      }, 500)
      it('responds with a welcome message and a token on successful login', async () => {
        const res = await request(server).post('/api/auth/login').send(userA)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('token')
      }, 500)
      it('responds with an error status code if username or password are not sent', async () => {
        let res = await request(server).post('/api/auth/login').send({})
        expect(res.status + '').toMatch(/4|5/)
        res = await request(server).post('/api/auth/login').send({ username: 'foo' })
        expect(res.status + '').toMatch(/4|5/)
        res = await request(server).post('/api/auth/login').send({ password: 'bar' })
        expect(res.status + '').toMatch(/4|5/)
      }, 500)
      it('responds with "username and password required" message if either is not sent', async () => {
        let res = await request(server).post('/api/auth/login').send({})
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
        res = await request(server).post('/api/auth/login').send({ username: 'foo' })
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
        res = await request(server).post('/api/auth/login').send({ password: 'bar' })
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
      }, 500)
      it('responds with a proper status code on non-existing username', async () => {
        const res = await request(server).post('/api/auth/login').send(userB)
        expect(res.status + '').toMatch(/4|5/)
      }, 500)
      it('responds with "invalid credentials" message on non-existing username', async () => {
        const res = await request(server).post('/api/auth/login').send(userB)
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/invalid/i))
      }, 500)
      it('responds with a proper status code on invalid password', async () => {
        const res = await request(server).post('/api/auth/login').send(userC)
        expect(res.status + '').toMatch(/4|5/)
      }, 500)
      it('responds with "invalid credentials" message on invalid password', async () => {
        const res = await request(server).post('/api/auth/login').send(userC)
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/invalid/i))
      }, 500)
    })
  })

  // 👉 JOKES
  // 👉 JOKES
  // 👉 JOKES
  describe('jokes endpoint', () => {
    describe('[GET] /api/jokes', () => {
      beforeEach(async () => {
        await db('users').truncate()
        await request(server).post('/api/auth/register').send(userA)
      })
      it('responds with an error status code on missing token', async () => {
        const res = await request(server).get('/api/jokes')
        expect(res.status + '').toMatch(/4|5/)
      }, 500)
      it('responds with a "token required" message on missing token', async () => {
        const res = await request(server).get('/api/jokes')
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
      }, 500)
      it('responds with an error status code on invalid token', async () => {
        const res = await request(server).get('/api/jokes').set('Authorization', 'bad token')
        expect(res.status + '').toMatch(/4|5/)
      }, 500)
      it('responds with a "token invalid" message on invalid token', async () => {
        const res = await request(server).get('/api/jokes').set('Authorization', 'bad token')
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/invalid/i))
      }, 500)
      it('responds with the jokes on valid token', async () => {
        const { body: { token } } = await request(server).post('/api/auth/login').send(userA)
        const res = await request(server).get('/api/jokes').set('Authorization', token)
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching('Did you hear about the guy whose'))
      }, 500)
    })
  })
})
