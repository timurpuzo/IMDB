const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }
);

ratingSchema.index({ user: 1, movie: 1 }, { unique: true });

// Observer: update movie average after save
ratingSchema.post('save', async function () {
  const Movie = mongoose.model('Movie');
  const movie = await Movie.findById(this.movie);
  if (movie) await movie.recalculateRating();
});

ratingSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Movie = mongoose.model('Movie');
    const movie = await Movie.findById(doc.movie);
    if (movie) await movie.recalculateRating();
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
