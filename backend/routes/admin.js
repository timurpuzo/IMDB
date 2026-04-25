const express = require('express');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const { adminAuth } = require('../middleware/auth');
const response = require('../utils/responseFactory');
const tmdbAdapter = require('../services/tmdbAdapter');

const router = express.Router();

// POST /api/admin/movies — add movie manually
router.post('/movies', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    response.success(res, movie, 201);
  } catch (err) {
    response.error(res, err.message, 400);
  }
});

// PUT /api/admin/movies/:id — edit movie
router.put('/movies/:id', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) return response.error(res, 'Movie not found', 404);
    response.success(res, movie);
  } catch (err) {
    response.error(res, err.message, 400);
  }
});

// DELETE /api/admin/movies/:id — delete movie and related data
router.delete('/movies/:id', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return response.error(res, 'Movie not found', 404);

    await Promise.all([
      Rating.deleteMany({ movie: movie._id }),
      Review.deleteMany({ movie: movie._id }),
      Watchlist.deleteMany({ movie: movie._id }),
      Movie.findByIdAndDelete(movie._id),
    ]);

    response.success(res, { message: 'Movie and related data deleted' });
  } catch (err) {
    response.error(res, err.message);
  }
});

// POST /api/admin/seed — seed movies from TMDb
router.post('/seed', adminAuth, async (req, res) => {
  try {
    const movies = await tmdbAdapter.fetchPopularMovies(1);
    let created = 0;
    for (const movieData of movies) {
      const exists = await Movie.findOne({ tmdbId: movieData.tmdbId });
      if (!exists) {
        // Fetch full details for genres and cast
        try {
          const details = await tmdbAdapter.fetchMovieDetails(movieData.tmdbId);
          await Movie.create(details);
          created++;
        } catch {
          await Movie.create(movieData);
          created++;
        }
      }
    }
    response.success(res, { message: `Seeded ${created} new movies` });
  } catch (err) {
    response.error(res, err.message);
  }
});

module.exports = router;
