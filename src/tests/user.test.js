const { readdir, unlink, mkdirSync, existsSync } = require('fs');
const { join } = require('path');
const supertest = require('supertest');
const app = require('../../index');
const mongoose = require('mongoose');
const request = supertest(app);

beforeAll(() => {
	process.env.NODE_ENV = 'test'; //just to double ensure you are running on a test environment

	// creating the directory if the directory does not exist
	if (!existsSync(join(__dirname, '../uploads'))) {
		mkdirSync(join(__dirname, '../uploads/test'), { recursive: true });
	}
});

afterAll(async () => {
	if (mongoose.connection.db.databaseName === 'testsocial') {
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
	}

	//remove all the files uploaded during test
	const path = join(__dirname, '../uploads/test');
	readdir(path, (err, files) => {
		if (err) throw err;

		for (const file of files) {
			unlink(join(path, file), (error) => {
				if (error) throw error;
			});
		}
	});
});

describe('User Endpoints', () => {
	it('should create a user with image sucessfully', async () => {
		const response = await request
			.post('/api/v1/registration')
			.set('content-type', 'multipart/form-data')
			.field('name', 'Ani Emmanuel')
			.field('email', 'oscar.johnson.e@gmail.com')
			.field('password', 'password')
			.attach('image', `${__dirname}/mockfiles/test.jpeg`);

		const {
			body: { message, code, data },
			statusCode
		} = response;

		expect(message).toBe('user created');
		expect(code).toBe(201);
		expect(statusCode).toBe(201);
		expect(data.name).toBe('Ani Emmanuel');
		expect(data.email).toBe('oscar.johnson.e@gmail.com');
		expect(data).toHaveProperty('_id');
		expect(data).toHaveProperty('image');
	});

	it('should create a user without image successfully', async () => {
		const response = await request
			.post('/api/v1/registration')
			.set('content-type', 'application/json')
			.send({
				name: 'Arinzechukwu Arthur',
				email: 'angeldemariae@gmail.com',
				password: 'password'
			});

		const {
			body: { message, code, data },
			statusCode
		} = response;

		expect(message).toBe('user created');
		expect(code).toBe(201);
		expect(statusCode).toBe(201);
		expect(data).toHaveProperty('_id');
		expect(data).not.toHaveProperty('image');
	});

	it('should it should fail because of wrong email format', async () => {
		const response = await request
			.post('/api/v1/registration')
			.set('content-type', 'application/json')
			.send({
				name: 'Arinzechukwu Arthur',
				email: '.@.angeldemariae@gmail.com',
				password: 'password'
			});

		const {
			body: { message, code, error },
			statusCode
		} = response;

		console.log(response);
		expect(message[0].message).toBe('"email" must be a valid email');
		expect(code).toBe(400);
		expect(statusCode).toBe(400);
		expect(error).toBeTruthy();
	});

	it('should fail because user already exist', async () => {
		const response = await request
			.post('/api/v1/registration')
			.set('content-type', 'application/json')
			.send({
				name: 'Arinzechukwu Arthur',
				email: 'angeldemariae@gmail.com',
				password: 'password'
			});

		const {
			body: { message, code, error },
			statusCode
		} = response;

		expect(code).toBe(409);
		expect(statusCode).toBe(409);
		expect(message).toBe('user already exist');
		expect(error).toBeTruthy();
	});

	it('should log a registered user in', async () => {
		const response = await request
			.post('/api/v1/login')
			.set('content-type', 'application/json')
			.send({
				email: 'angeldemariae@gmail.com',
				password: 'password'
			});

		const {
			body: { message, code, error, data },
			statusCode
		} = response;

		expect(statusCode).toBe(200);
		expect(code).toBe(200);
		expect(message).toBe('success');
		expect(error).toBeFalsy();
		expect(typeof data).toBe('string');
		expect(response.body).toHaveProperty('data');
	});
});
