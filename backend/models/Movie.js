const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    overview: {
      type: String,
      default: '',
    },
    posterPath: {
      type: String,
      default: '',
    },
    backdropPath: {
      type: String,
      default: '',
    },
    releaseDate: {
      type: String,
      default: '',
    },
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    type: {
      type: String,
      enum: ['movie', 'tv'],
      default: 'movie',
    },
    cast: [
      {
        name: String,
        character: String,
      },
    ],
    tmdbId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

movieSchema.index({ title: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ type: 1 });
movieSchema.index({ averageRating: -1 });

// Observer pattern: recalculate average when called
movieSchema.methods.recalculateRating = async function () {
  const Rating = mongoose.model('Rating');
  const stats = await Rating.aggregate([
    { $match: { movie: this._id } },
    {
      $group: {
        _id: '$movie',
        averageRating: { $avg: '$value' },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    this.averageRating = Math.round(stats[0].averageRating * 10) / 10;
    this.ratingCount = stats[0].ratingCount;
  } else {
    this.averageRating = 0;
    this.ratingCount = 0;
  }
  await this.save();
};

module.exports = mongoose.model('Movie', movieSchema);
