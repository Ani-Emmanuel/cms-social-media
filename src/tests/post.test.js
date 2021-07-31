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
	if (mongoose.connection.db.databaseName === 'mealertest') {
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

describe('Posts endpoints', () => {
	let token1,
		token2,
		postId = '';

	beforeAll(async () => {
		//user1
		await request
			.post('/api/v1/registration')
			.set('content-type', 'multipart/form-data')
			.field('name', 'Ani Emmanuel')
			.field('email', 'mailsforanih@gmail.com')
			.field('password', 'password')
			.attach('image', `${__dirname}/mockfiles/test.jpeg`);

		//user1 login
		const user1 = await request
			.post('/api/v1/login')
			.set('content-type', 'application/json')
			.send({
				email: 'mailsforanih@gmail.com',
				password: 'password'
			});

		//user1 token
		token1 = user1.body.data;
	});

	beforeAll(async () => {
		//user2
		await request
			.post('/api/v1/registration')
			.set('content-type', 'multipart/form-data')
			.field('name', 'Ani Emmanuel')
			.field('email', 'angelsforus@gmail.com')
			.field('password', 'password')
			.attach('image', `${__dirname}/mockfiles/typescript.jpeg`);

		//user2 login
		const user2 = await request
			.post('/api/v1/login')
			.set('content-type', 'application/json')
			.send({
				email: 'angelsforus@gmail.com',
				password: 'password'
			});

		//user2 token
		token2 = user2.body.data;
	});

	it('should create a post successfully with token in the header', async () => {
		const response = await request
			.post('/api/v1/create-post')
			.set('Authorization', `Bearer ${token1}`)
			.field('title', 'Jest')
			.field('description', 'Jest is an awesome test suite')
			.attach('image', `${__dirname}/mockfiles/test.jpeg`);

		const {
			body: { message, code, data, error },
			statusCode
		} = response;
		postId = data._id;
		expect(message).toBe('post created');
		expect(code).toBe(201);
		expect(statusCode).toBe(201);
		expect(error).toBeFalsy();
		expect(data).toHaveProperty('userId');
		expect(data).toHaveProperty('_id');
		expect(data).toHaveProperty('image');
	});

	it('should not create a post without token in the header', async () => {
		const response = await request
			.post('/api/v1/create-post')
			.set('content-type', 'multipart/form-data')
			.field('title', 'Jest')
			.field('description', 'Jest is an awesome test suite')
			.attach('image', `${__dirname}/mockfiles/test.jpeg`);

		const {
			body: { message, code, data, error },
			statusCode
		} = response;

		expect(message).toBe('please login to perform this action');
		expect(code).toBe(401);
		expect(statusCode).toBe(401);
		expect(error).toBeTruthy();
	});

	it('should get one post', async () => {
		const response = await request
			.get(`/api/v1/get-one-post/${postId}`)
			.set('Authorization', `Bearer ${token1}`);

		const {
			body: { message, code, data, error },
			statusCode
		} = response;

		expect(message).toBe(null);
		expect(code).toBe(200);
		expect(statusCode).toBe(200);
		expect(error).toBeFalsy();
		expect(data[0]).toHaveProperty('userId');
		expect(data[0]).toHaveProperty('_id');
		expect(data[0]).toHaveProperty('userId');
		expect(data[0]).toHaveProperty('image');
	});

	it('should ask you to login if you did not you valid token', async () => {
		const response = await request.get(`/api/v1/get-one-post/${postId}`);

		const {
			body: { message, code, data, error },
			statusCode
		} = response;

		expect(message).toBe('please login to perform this action');
		expect(code).toBe(401);
		expect(statusCode).toBe(401);
		expect(error).toBeTruthy();
	});

	it('should get all post but you must have a token', async () => {
		const response = await request
			.get(`/api/v1/get-all-posts`)
			.set('Authorization', `Bearer ${token2}`);

		const {
			body: { message, code, data, error },
			statusCode
		} = response;

		expect(message).toBe(null);
		expect(code).toBe(200);
		expect(statusCode).toBe(200);
		expect(error).toBeFalsy();
		expect(data[0]).toHaveProperty('userId');
		expect(data[0]).toHaveProperty('_id');
		expect(data[0]).toHaveProperty('userId');
		expect(data[0]).toHaveProperty('image');
	});

	it('should be able to update post created by self', async () => {
		const response = await request
			.patch(`/api/v1/update-post/${postId}`)
			.set('Authorization', `Bearer ${token1}`)
			.send({ title: 'TypeScript' });
		const {
			body: { data, message, error },
			statusCode
		} = response;
		const { title } = data;
		expect(message).toBe('updated success');
		expect(error).toBeFalsy();
		expect(statusCode).toBe(200);
		expect(title).toBe('TypeScript');
		expect(data).toHaveProperty('_id');
	});

	it('should not update posts that is not yours', async () => {
		const response = await request
			.patch(`/api/v1/update-post/${postId}`)
			.set('Authorization', `Bearer ${token2}`)
			.send({ title: 'TypeScript' });
		const {
			body: { data, message, error },
			statusCode
		} = response;

		expect(message).toBe('you are not authorized');
		expect(error).toBeTruthy();
		expect(statusCode).toBe(401);
	});

	it('should return not found when it invalid post id', async () => {
		const response = await request
			.patch(`/api/v1/update-post/6103d109f4af2083afd5d524`)
			.set('Authorization', `Bearer ${token2}`)
			.send({ title: 'TypeScript' });
		const {
			body: { data, message, error },
			statusCode
		} = response;

		expect(message).toBe('post does not exist');
		expect(error).toBeTruthy();
		expect(statusCode).toBe(404);
	});

	it('should not delete post you did not create', async () => {
		const response = await request
			.delete(`/api/v1/delete-post/${postId}`)
			.set('Authorization', `Bearer ${token2}`);
		const {
			body: { data, message, error },
			statusCode
		} = response;

		expect(message).toBe('you are not authorized');
		expect(error).toBeTruthy();
		expect(statusCode).toBe(401);
	});

	it('should return not found if the post id did not match any post', async () => {
		const response = await request
			.delete(`/api/v1/delete-post/6103d109f4af2083afd5d524`)
			.set('Authorization', `Bearer ${token2}`);
		const {
			body: { data, message, error },
			statusCode
		} = response;

		expect(message).toBe('post does not exist');
		expect(error).toBeTruthy();
		expect(statusCode).toBe(404);
	});

	it('should delete post you created', async () => {
		const response = await request
			.delete(`/api/v1/delete-post/${postId}`)
			.set('Authorization', `Bearer ${token1}`);
		const {
			body: { data, message, error },
			statusCode
		} = response;

		expect(message).toBe('post deleted successfully');
		expect(error).toBeFalsy();
		expect(statusCode).toBe(200);
	});
});
