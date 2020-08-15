const db = require('../database/dbConfig.js');
const Users = require('../users/usersModel.js');
const server = require('./server.js');
const request = require('supertest');

describe('GET /', () => {
    it('returns status 200', async () => {
        const res = await request(server).get('/');
        expect(res.status).toBe(200)
    });
    it('should be json', async () => {
        const res = await request(server).get('/');
        expect(res.type).toBe('application/json')
    });
    it('return right object', async () => {
        const res = await request(server).get('/');
        expect(res.body).toEqual({api: 'up'});
    });
});


    describe('post', () => {
        beforeAll(async() => {
            await db('users').truncate();
        })

        it('add new user', async () => {
            await Users.add({username: 'lexi2', password: 'password'});
            await Users.add({username: 'jeff', password: 'password1'});
            const user = await db('users');
            expect(user).toHaveLength(2);
            expect(user[0].username).toBe('lexi2');
        });

        it('post login ', () => {
            return request(server)
            .post('/api/auth/login')
            .send({username: 'test', password: 'password'})
            .then(res => {
              expect(res.type).toMatch(/json/i);
            })
        });
        it('gets to /api/joke should return json', () => {
            return request(server)
            .get('/api/jokes')
            .then(res => {
              expect(res.type).toMatch(/json/i);
            })
          })
          it('Posts login, should return 200', () => {
            return request(server)
            .post('/api/auth/login')
            .send({username: 'test', password: 'password'})
            .then(user => {
              expect(user.username).toBe('lexi2');
            })
          })

    })
    

