const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Watchlist = require('../models/Watchlist');

let token;
let movieId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imdb_test');
  await User.deleteMany({});
  await Movie.deleteMany({});
  await Watchlist.deleteMany({});

  const res = await request(app).post('/api/auth/register').send({
    username: 'watchuser',
    email: 'watch@example.com',
    password: 'password123',
  });
  token = res.body.data.token;

  const movie = await Movie.create({
    title: 'Watchlist Movie',
    overview: 'A movie for watchlist testing',
    genres: ['Comedy'],
    type: 'movie',
  });
  movieId = movie._id.toString();
});

afterAll(async () => {
  await User.deleteMany({});
  await Movie.deleteMany({});
  await Watchlist.deleteMany({});
  await mongoose.connection.close();
});

describe('Watchlist Routes', () => {
  test('POST /api/users/watchlist/:movieId — should add to watchlist', async () => {
    const res = await request(app)
      .post(`/api/users/watchlist/${movieId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body.data.added).toBe(true);
  });

  test('GET /api/users/watchlist/check/:movieId — should confirm in watchlist', async () => {
    const res = await request(app)
      .get(`/api/users/watchlist/check/${movieId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.inWatchlist).toBe(true);
  });

  test('GET /api/users/watchlist — should return watchlist', async () => {
    const res = await request(app)
      .get('/api/users/watchlist')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Watchlist Movie');
  });

  test('POST /api/users/watchlist/:movieId — should toggle (remove)', async () => {
    const res = await request(app)
      .post(`/api/users/watchlist/${movieId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.added).toBe(false);
  });

  test('GET /api/users/watchlist — should be empty after removal', async () => {
    const res = await request(app)
      .get('/api/users/watchlist')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});

describe('User Stats', () => {
  test('GET /api/users/stats — should return stats', async () => {
    const res = await request(app)
      .get('/api/users/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('ratingCount');
    expect(res.body.data).toHaveProperty('reviewCount');
    expect(res.body.data).toHaveProperty('watchlistCount');
  });

  test('GET /api/users/recommendations — should return array', async () => {
    const res = await request(app)
      .get('/api/users/recommendations')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
