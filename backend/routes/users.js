const express = require('express');
const Watchlist = require('../models/Watchlist');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');
const response = require('../utils/responseFactory');
const recommendationService = require('../services/recommendationService');

const router = express.Router();

// GET /api/users/watchlist
router.get('/watchlist', auth, async (req, res) => {
  try {
    const items = await Watchlist.find({ user: req.user._id })
      .populate('movie')
      .sort('-createdAt');
    response.success(res, items.map((i) => i.movie).filter(Boolean));
  } catch (err) {
    response.error(res, err.message);
  }
});

// POST /api/users/watchlist/:movieId — toggle watchlist
router.post('/watchlist/:movieId', auth, async (req, res) => {
  try {
    const existing = await Watchlist.findOne({
      user: req.user._id,
      movie: req.params.movieId,
    });

    if (existing) {
      await Watchlist.findByIdAndDelete(existing._id);
      return response.success(res, { added: false, message: 'Removed from watchlist' });
    }

    await Watchlist.create({ user: req.user._id, movie: req.params.movieId });
    response.success(res, { added: true, message: 'Added to watchlist' }, 201);
  } catch (err) {
    response.error(res, err.message);
  }
});

// GET /api/users/watchlist/check/:movieId
router.get('/watchlist/check/:movieId', auth, async (req, res) => {
  try {
    const exists = await Watchlist.exists({
      user: req.user._id,
      movie: req.params.movieId,
    });
    response.success(res, { inWatchlist: !!exists });
  } catch (err) {
    response.error(res, err.message);
  }
});

// GET /api/users/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [ratingCount, reviewCount, watchlistCount] = await Promise.all([
      Rating.countDocuments({ user: req.user._id }),
      Review.countDocuments({ user: req.user._id }),
      Watchlist.countDocuments({ user: req.user._id }),
    ]);
    response.success(res, { ratingCount, reviewCount, watchlistCount });
  } catch (err) {
    response.error(res, err.message);
  }
});

// GET /api/users/ratings
router.get('/ratings', auth, async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id })
      .populate('movie')
      .sort('-createdAt');
    response.success(res, ratings);
  } catch (err) {
    response.error(res, err.message);
  }
});

// GET /api/users/reviews
router.get('/reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('movie')
      .sort('-createdAt');
    response.success(res, reviews);
  } catch (err) {
    response.error(res, err.message);
  }
});

// GET /api/users/recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const movies = await recommendationService.getRecommendations(req.user._id);
    response.success(res, movies);
  } catch (err) {
    response.error(res, err.message);
  }
});

module.exports = router;
