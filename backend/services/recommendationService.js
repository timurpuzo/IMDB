const Rating = require('../models/Rating');
const Movie = require('../models/Movie');

// Strategy pattern: pluggable recommendation algorithms
class GenreBasedStrategy {
  async recommend(userId, limit = 10) {
    // Find user's top-rated genres
    const ratings = await Rating.find({ user: userId, value: { $gte: 7 } }).populate('movie');
    const genreCount = {};

    ratings.forEach((r) => {
      if (r.movie && r.movie.genres) {
        r.movie.genres.forEach((g) => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    if (topGenres.length === 0) return [];

    const ratedMovieIds = ratings.map((r) => r.movie?._id).filter(Boolean);
    return Movie.find({
      genres: { $in: topGenres },
      _id: { $nin: ratedMovieIds },
    })
      .sort({ averageRating: -1 })
      .limit(limit);
  }
}

class PopularityStrategy {
  async recommend(userId, limit = 10) {
    const ratedMovieIds = (await Rating.find({ user: userId })).map((r) => r.movie);
    return Movie.find({ _id: { $nin: ratedMovieIds } })
      .sort({ averageRating: -1, ratingCount: -1 })
      .limit(limit);
  }
}

class RecommendationService {
  constructor() {
    this.strategies = {
      genre: new GenreBasedStrategy(),
      popularity: new PopularityStrategy(),
    };
    this.currentStrategy = 'genre';
  }

  setStrategy(strategyName) {
    if (this.strategies[strategyName]) {
      this.currentStrategy = strategyName;
    }
  }

  async getRecommendations(userId, limit = 10) {
    let results = await this.strategies[this.currentStrategy].recommend(userId, limit);
    // Fallback to popularity if genre-based returns too few
    if (results.length < 3 && this.currentStrategy === 'genre') {
      results = await this.strategies.popularity.recommend(userId, limit);
    }
    return results;
  }
}

module.exports = new RecommendationService();
