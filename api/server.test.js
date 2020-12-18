const request = require('supertest'); 
const server = require('./server'); 
const db = require('../data/dbConfig');

//Mock Data
const maricela = { username: "maricela", password: "password"};
const chico = { username: "chico", password: "doggo" };

//Organize DB around tests 
beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db('users').truncate;
}); 
afterAll(async () => {
  await db.destroy();
});

describe('Endpoints', () => {
  describe('/auth/register', () => {
    it('Responds with 200 status sending new user', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send(maricela);
      expect(res.status).toBe(200);
    });
    it('Responds with correct error if no user data', async () => {
      const res = await request(server).post('/api/auth/register');
      expect(res.body).toContain('username and password required');
    }); 
    it('Responds with correct error if username taken', async () => {
      let res = await request(server)
        .post('/api/auth/register')
        .send(chico);
      res = await request(server)
      .post('/api/auth/register')
      .send(chico);
      expect(res.body).toContain('username taken');
    });
  });
  describe('/auth/login', () => {
    beforeEach(async () => {
      await request(server).post('/api/auth/register').send(chico);
    });
    it('Responds with correct error message if no user data', async () => {
      const res = await request(server).post('/api/auth/login');
      expect(res.body).toContain('username and password required');
    });
    it('Returns correct info on succesful login', async () => {
      const res = await request(server).post('/api/auth/login').send(chico);
      expect(res.body.token).toBeTruthy();
      expect(res.body.message).toBe('welcome, chico');
    });
  });
  describe('/jokes', () => {
    it('Returns no data when no token provided', async () => {
      const res = await request(server).get('/api/jokes');
      expect(res.body).toBe('token required');
    });
  })
});
