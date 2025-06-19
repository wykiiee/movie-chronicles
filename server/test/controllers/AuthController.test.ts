import supertest from 'supertest';
import { createTestApp } from '../test-app';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';

describe('AuthController', () => {
	const app = createTestApp();
	const request = supertest(app);

	beforeAll(async () => {
		await setupTestDatabase();
	});

	afterAll(async () => {
		await teardownTestDatabase();
	});

	beforeEach(async () => {
		// Clear database between tests
		await db.delete(schema.users);
	});

	describe('POST /api/auth/register', () => {
		it('should register a new user', async () => {
			const userData = {
				name: 'Test User',
				username: 'testuser',
				email: 'test@example.com',
				password: 'Password123!',
			};

			const response = await request.post('/api/auth/register').send(userData);

			expect(response.status).toBe(201);
			expect(response.body.message).toBe('User registered successfully');
			expect(response.body.data).not.toHaveProperty('token');
			expect(response.body.data.user).toHaveProperty('id');
			expect(response.body.data.user.username).toBe(userData.username);
			expect(response.body.data.user.email).toBe(userData.email);

			// Check for cookies
			expect(response.headers['set-cookie']).toBeDefined();
			const cookies = response.headers['set-cookie'] as unknown as string[];
			expect(
				cookies.some((cookie: string) => cookie.startsWith('accessToken='))
			).toBe(true);
			expect(
				cookies.some((cookie: string) => cookie.startsWith('refreshToken='))
			).toBe(true);

			// Check if user was actually created in the database
			const users = await db
				.select()
				.from(schema.users)
				.where(sql`${schema.users.email} = ${userData.email}`);

			expect(users.length).toBe(1);
			expect(users[0].username).toBe(userData.username);
		});

		it('should return 400 if required fields are missing', async () => {
			const response = await request.post('/api/auth/register').send({
				username: 'testuser',
				// Missing email and password
			});

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty('error');
		});

		it('should return 400 if user already exists', async () => {
			// Create user first
			await db.insert(schema.users).values({
				name: 'Existing User',
				username: 'existinguser',
				email: 'existing@example.com',
				password: await bcrypt.hash('password', 10),
			});

			// Try to register the same user
			const response = await request.post('/api/auth/register').send({
				username: 'existinguser',
				email: 'existing@example.com',
				password: 'password123',
			});

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty('error');
		});
	});

	describe('POST /api/auth/login', () => {
		beforeEach(async () => {
			// Create test user
			await db.insert(schema.users).values({
				name: 'Login User',
				username: 'loginuser',
				email: 'login@example.com',
				password: await bcrypt.hash('password123', 10),
			});
		});

		it('should login successfully with correct credentials', async () => {
			const response = await request.post('/api/auth/login').send({
				email: 'login@example.com',
				password: 'password123',
			});

			expect(response.status).toBe(200);
			expect(response.body.message).toBe('Login successful');
			expect(response.body.data).not.toHaveProperty('token');
			expect(response.body.data.user.email).toBe('login@example.com');

			// Check for cookies
			expect(response.headers['set-cookie']).toBeDefined();
			const cookies = response.headers['set-cookie'] as unknown as string[];
			expect(
				cookies.some((cookie: string) => cookie.startsWith('accessToken='))
			).toBe(true);
			expect(
				cookies.some((cookie: string) => cookie.startsWith('refreshToken='))
			).toBe(true);
		});

		it('should return 400 with incorrect credentials', async () => {
			const response = await request.post('/api/auth/login').send({
				email: 'login@example.com',
				password: 'wrongpassword',
			});

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty('error');
		});

		it('should return 400 if user does not exist', async () => {
			const response = await request.post('/api/auth/login').send({
				email: 'nonexistent@example.com',
				password: 'password123',
			});

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty('error');
		});
	});
});
