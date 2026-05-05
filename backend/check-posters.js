const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Movie = require('./models/Movie');

async function checkPosters() {
  await connectDB();
  const movies = await Movie.find({title: {$in: ['The Shawshank Redemption', 'The Dark Knight']}});
  movies.forEach(movie => {
    console.log('Title:', movie.title);
    console.log('Poster:', movie.posterPath);
    console.log('---');
  });
  process.exit(0);
}

checkPosters().catch(console.error);
