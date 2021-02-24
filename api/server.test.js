

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



  describe('POST /api/auth/register', () => {


    test('--CANT REGISTER', async ()=>{
      await Users.insert({username: 'blue', password: 'password'})
      let authLogin = {username: 'newMemb', password: 'password'}
  
      let res = await request(server)
      .post('/api/auth/register', authLogin)

      expect(res.body).toEqual({"message": "Could not register new user."})

    });

    test('--SUCCESSFUL REGISTER', async ()=>{
      const newAcc = {username: 'chadHopkins', password: 'password'}

      let res = await request(server)
      .post('/api/auth/register')
      .send(newAcc)

      expect(res.status).toBe(200)
      expect(res.body.message).toEqual('Welcome User')

    })


  })

  describe('POST /api/auth/login ', () => {

    beforeEach(async ()=>{
      await Users.insert({username: 'user', password : 'password'})

    })
    test('--UNAUTHORIZED LOGIN', async ()=>{
      let wrongLogin = {username: 'noacc', password: 'nothere'}
  
      let res = await request(server)
      .post('/api/auth/login')
      .send(wrongLogin)
      expect(res.status).toEqual(401)
      expect(res.body).toEqual({message: `You are not authorized.`});
      
        
    });

    test('--AUTHORIZED LOGIN', async ()=>{
      let res = await request(server)
      .post('/api/auth/login')
      .send({username: 'user', password : 'password'})

      expect(res.status).toEqual(200);

    })
  
  })
  


});