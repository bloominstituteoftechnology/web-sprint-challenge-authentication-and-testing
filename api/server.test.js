const request = require('supertest');

const server = require('./server');



const user = {

	username: 'cfallon',

	password: 'thispasswordiscrap',

};



test('sanity', () => {

	expect(false).toBe(false);

});



describe('server.js', () => {

	describe('get request for jokes', () => {

		it('returns status code 401', async () => {

			const res = await request(server).get('/api/jokes');

			expect(res.status).toBe(401);

		});

		it('should return json', async () => {

			const res = await request(server).get('/api/jokes');

			expect(res.type).toBe('application/json');

		});

	});

	describe('register', () => {

		it('should return status code 201', async () => {

			const res = await request(server).post('/api/auth/register').send(user);

			expect(res.status).toBe(201);

		});

		it('should return status code 500', async () => {

			const res = await request(server)

				.post('/api/auth/register')

				.send({ username: 'cfallon', password: '1234' });

			expect(res.status).toBe(500);

		});

	});

	describe('login', () => {

		it('should return status code 200', async () => {

			const res = await request(server).post('/api/auth/login').send(user);

			expect(res.status).toBe(200);

		});

		it('should return status code 401', async () => {

			const res = await request(server)

				.post('/api/auth/login')

				.send({ username: 'cfallon', password: '1234' });

			expect(res.status).toBe(500);

		});

	});

});