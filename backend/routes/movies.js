const express = require('express');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const { auth } = require('../middleware/auth');
const response = require('../utils/responseFactory');

const router = express.Router();

// GET /api/movies — list with search, filter, sort, pagination
router.get('/', async (req, res) => {
  try {
    const {
      search,
      genre,
      type,
      sort = '-averageRating',
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (genre) filter.genres = { $in: Array.isArray(genre) ? genre : [genre] };
    if (type) filter.type = type;

    const total = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    response.paginated(res, movies, Number(page), Number(limit), total);
  } catch (err) {
    response.error(res, err.message);
  }
});

// GET /api/movies/genres — list all unique genres
router.get('/genres', async (req, res) => {
  try {
    const genres = await Movie.distinct('genres');
    response.success(res, genres.filter(Boolean).sort());
  } catch (err) {
    response.error(res, err.message);
  }
});

// GET /api/movies/:id — single movie with reviews
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return response.error(res, 'Movie not found', 404);

    const reviews = await Review.find({ movie: movie._id })
      .populate('user', 'username')
      .sort('-createdAt');

    response.success(res, { movie, reviews });
  } catch (err) {
    response.error(res, err.message);
  }
});

// POST /api/movies/:id/rate
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || value < 1 || value > 10) {
      return response.error(res, 'Rating must be between 1 and 10', 400);
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) return response.error(res, 'Movie not found', 404);

    let rating = await Rating.findOne({ user: req.user._id, movie: movie._id });
    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      rating = await Rating.create({ user: req.user._id, movie: movie._id, value });
    }

    response.success(res, rating);
  } catch (err) {
    response.error(res, err.message);
  }
});

// DELETE /api/movies/:id/rate
router.delete('/:id/rate', auth, async (req, res) => {
  try {
    const rating = await Rating.findOneAndDelete({
      user: req.user._id,
      movie: req.params.id,
    });
    if (!rating) return response.error(res, 'Rating not found', 404);
    response.success(res, { message: 'Rating deleted' });
  } catch (err) {
    response.error(res, err.message);
  }
});

// GET /api/movies/:id/my-rating
router.get('/:id/my-rating', auth, async (req, res) => {
  try {
    const rating = await Rating.findOne({ user: req.user._id, movie: req.params.id });
    response.success(res, rating);
  } catch (err) {
    response.error(res, err.message);
  }
});

// POST /api/movies/:id/review
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.length < 10) {
      return response.error(res, 'Review must be at least 10 characters', 400);
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) return response.error(res, 'Movie not found', 404);

    const existing = await Review.findOne({ user: req.user._id, movie: movie._id });
    if (existing) return response.error(res, 'You already reviewed this movie', 400);

    const review = await Review.create({ user: req.user._id, movie: movie._id, text });
    await review.populate('user', 'username');
    response.success(res, review, 201);
  } catch (err) {
    response.error(res, err.message);
  }
});

// PUT /api/movies/:id/review
router.put('/:id/review', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.length < 10) {
      return response.error(res, 'Review must be at least 10 characters', 400);
    }

    const review = await Review.findOneAndUpdate(
      { user: req.user._id, movie: req.params.id },
      { text },
      { new: true }
    ).populate('user', 'username');

    if (!review) return response.error(res, 'Review not found', 404);
    response.success(res, review);
  } catch (err) {
    response.error(res, err.message);
  }
});

// DELETE /api/movies/:id/review
router.delete('/:id/review', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      user: req.user._id,
      movie: req.params.id,
    });
    if (!review) return response.error(res, 'Review not found', 404);
    response.success(res, { message: 'Review deleted' });
  } catch (err) {
    response.error(res, err.message);
  }
});

module.exports = router;
