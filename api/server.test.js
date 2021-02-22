

const request = require('supertest');

const db = require('../data/dbConfig');
const server = require('./server');
const Users = require('../model/authModel');

beforeAll( async ()=>{
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async ()=>{
  await db('users').truncate();
})

afterAll(async ()=>{
  await db.destroy();
})

//Checks testing enviorment.
describe('server.js', ()=>{

  describe('GET /api/auth/login ', () => {

    
    test('--UNAUTHORIZED', async ()=>{
      let wrongLogin = {username: 'noacc', password: 'nothere'}
  
      let res = await request(server)
      .post('/api/auth/login', wrongLogin)
      expect(res.status).toEqual(401)
      expect(res.body).toEqual({message: `You are not authorized.`});
      
        
    });
  
  })

  describe('GET /api/auth/register', () => {


    test('--CANT REGISTER', async ()=>{
      await Users.insert({username: 'blue', password: 'password'})
      let authLogin = {username: 'newMemb', password: 'password'}
  
      let res = await request(server)
      .post('/api/auth/register', authLogin)

      expect(res.status).toEqual(500)

        
    });


  })
  


});