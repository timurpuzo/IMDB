const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Review = require('../models/Review');

let token;
let movieId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imdb_test');
  await User.deleteMany({});
  await Movie.deleteMany({});
  await Rating.deleteMany({});
  await Review.deleteMany({});

  // Register a user
  const res = await request(app).post('/api/auth/register').send({
    username: 'movieuser',
    email: 'movie@example.com',
    password: 'password123',
  });
  token = res.body.data.token;

  // Create a movie
  const movie = await Movie.create({
    title: 'Test Movie',
    overview: 'A test movie for unit tests',
    releaseDate: '2024-01-01',
    genres: ['Action', 'Drama'],
    type: 'movie',
  });
  movieId = movie._id.toString();
});

afterAll(async () => {
  await User.deleteMany({});
  await Movie.deleteMany({});
  await Rating.deleteMany({});
  await Review.deleteMany({});
  await mongoose.connection.close();
});

describe('Movie Routes', () => {
  test('GET /api/movies — should return movies list', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  test('GET /api/movies — should filter by search', async () => {
    const res = await request(app).get('/api/movies?search=Test');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/movies — should return empty for no match', async () => {
    const res = await request(app).get('/api/movies?search=nonexistentxyz');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  test('GET /api/movies — should filter by genre', async () => {
    const res = await request(app).get('/api/movies?genre=Action');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/movies — should filter by type', async () => {
    const res = await request(app).get('/api/movies?type=movie');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/movies/genres — should return genres', async () => {
    const res = await request(app).get('/api/movies/genres');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/movies/:id — should return movie details', async () => {
    const res = await request(app).get(`/api/movies/${movieId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.movie.title).toBe('Test Movie');
    expect(Array.isArray(res.body.data.reviews)).toBe(true);
  });

  test('GET /api/movies/:id — should return 404 for invalid id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/movies/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

describe('Rating Routes', () => {
  test('POST /api/movies/:id/rate — should create rating', async () => {
    const res = await request(app)
      .post(`/api/movies/${movieId}/rate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 8 });
    expect(res.status).toBe(200);
    expect(res.body.data.value).toBe(8);
  });

  test('POST /api/movies/:id/rate — should update existing rating', async () => {
    const res = await request(app)
      .post(`/api/movies/${movieId}/rate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 9 });
    expect(res.status).toBe(200);
    expect(res.body.data.value).toBe(9);
  });

  test('POST /api/movies/:id/rate — should reject invalid value', async () => {
    const res = await request(app)
      .post(`/api/movies/${movieId}/rate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 15 });
    expect(res.status).toBe(400);
  });

  test('POST /api/movies/:id/rate — should reject without auth', async () => {
    const res = await request(app)
      .post(`/api/movies/${movieId}/rate`)
      .send({ value: 5 });
    expect(res.status).toBe(401);
  });

  test('GET /api/movies/:id/my-rating — should return user rating', async () => {
    const res = await request(app)
      .get(`/api/movies/${movieId}/my-rating`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.value).toBe(9);
  });

  test('DELETE /api/movies/:id/rate — should delete rating', async () => {
    const res = await request(app)
      .delete(`/api/movies/${movieId}/rate`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

describe('Review Routes', () => {
  test('POST /api/movies/:id/review — should create review', async () => {
    const res = await request(app)
      .post(`/api/movies/${movieId}/review`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'This is a great test movie for our project' });
    expect(res.status).toBe(201);
    expect(res.body.data.text).toContain('great test movie');
  });

  test('POST /api/movies/:id/review — should reject duplicate', async () => {
    const res = await request(app)
      .post(`/api/movies/${movieId}/review`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Another review that should fail to submit' });
    expect(res.status).toBe(400);
  });

  test('POST /api/movies/:id/review — should reject short text', async () => {
    const res = await request(app)
      .post(`/api/movies/${movieId}/review`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Short' });
    expect(res.status).toBe(400);
  });

  test('PUT /api/movies/:id/review — should update review', async () => {
    const res = await request(app)
      .put(`/api/movies/${movieId}/review`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Updated review text for test movie' });
    expect(res.status).toBe(200);
    expect(res.body.data.text).toContain('Updated review');
  });

  test('DELETE /api/movies/:id/review — should delete review', async () => {
    const res = await request(app)
      .delete(`/api/movies/${movieId}/review`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
