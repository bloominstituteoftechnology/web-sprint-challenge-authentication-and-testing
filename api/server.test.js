const request = require('supertest');
const server = require('./server');

test('environment', () => {
expect(process.env.NODE_ENV).toBe('testing')})


describe('[POST] /register', () => {  test('responds with error when no username', async () => {

    const res = await request(server).post('/api/auth/register').send({
      username: '', 
      password: 'password',
})
    expect(res.body).toMatchObject({message: 'username and password required'})
})
test('responds with error when no password', async () => {

    const res = await request(server).post('/api/auth/register').send({
      username: 'sakura', 
      password: '',
})
    expect(res.body).toMatchObject({message: 'username and password required'})
})
})

describe('[POST] /login', () => { test('responds with error when no username', async () => {

    const res = await request(server).post('/login').send({
      username: '', 
      password: 'username'
})
    expect(res.status).toBe(404)
})
  test('responds with error when no password', async () => {

    const res = await request(server).post('/api/auth/login').send({
      username: 'MightGuy', 
      password: '',
})
    expect(res.body).toMatchObject({message: 'username and password required'})
})})