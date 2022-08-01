import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'a@a.com', password: '123456' });
		expect(res.statusCode).toBe(422);
	});
	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.com', password: '123456' });
		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).toBeDefined();
	});
	it('Login - wrong pass', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.com', password: '1' });
		expect(res.statusCode).toBe(401);
	});
	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'a@a.com', password: '123456' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`)
			.send();
		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBeDefined();
	});
	it('Info - wrong jwt', async () => {
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer abc`)
			.send();
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
