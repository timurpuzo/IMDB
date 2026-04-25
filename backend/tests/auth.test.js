const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imdb_test');
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  let token;

  test('POST /api/auth/register — should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe('testuser');
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/register — should reject duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser2',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/register — should reject short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'short',
      email: 'short@example.com',
      password: '123',
    });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login — should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  test('POST /api/auth/login — should reject invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me — should return current user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('test@example.com');
  });

  test('GET /api/auth/me — should reject without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('PUT /api/auth/profile — should update username', async () => {
    const res = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'updateduser' });
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('updateduser');
  });
});
