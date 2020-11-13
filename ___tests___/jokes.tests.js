const supertest = require('supertest')
const server = require('../index')
const db = require('../database/dbConfig')

  it(`get jokes`, async () => {
    const res = await supertest(server)
    .get('/api/jokes')
    expect(res.statusCode)
    .toBe(401)
    expect(res.type)
    .toBe('application/json')
    expect(res.body.message)
    .toBe('no token')
  })

  it(`getting jokes if authorized`, async () => {
    await supertest(server)
    .post('/api/auth/register')
    .send({
      username: 'Skelator',
      password: 'battlecat',
    })
    const response = await supertest(server)
    .post('/api/auth/login')
    .send({
      username: 'Skelator',
      password: 'battlecat',
    })
    let token = response.body.token
    if (token !== undefined) {
      const res = await supertest(server)
        .get('/api/jokes')
        .send({ token: token })
      expect(res.statusCode)
      .toBe(200)
      expect(res.type)
      .toBe('application/json')
    }
  })