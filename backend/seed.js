require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');
const Movie = require('./models/Movie');

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'];

const sampleMovies = [
  { title: 'The Shawshank Redemption', overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', releaseDate: '1994-09-23', genres: ['Drama'], type: 'movie', posterPath: 'https://picsum.photos/seed/shawshank1994/200/300.jpg' },
  { title: 'The Dark Knight', overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', releaseDate: '2008-07-18', genres: ['Action', 'Drama', 'Thriller'], type: 'movie', posterPath: 'https://picsum.photos/seed/darkknight2008/200/300.jpg' },
  { title: 'Inception', overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', releaseDate: '2010-07-16', genres: ['Action', 'Sci-Fi', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg' },
  { title: 'Pulp Fiction', overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', releaseDate: '1994-10-14', genres: ['Drama', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
  { title: 'The Matrix', overview: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth.', releaseDate: '1999-03-31', genres: ['Action', 'Sci-Fi'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
  { title: 'Interstellar', overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', releaseDate: '2014-11-07', genres: ['Sci-Fi', 'Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { title: 'Breaking Bad', overview: 'A high school chemistry teacher diagnosed with lung cancer turns to manufacturing methamphetamine to secure his family\'s future.', releaseDate: '2008-01-20', genres: ['Drama', 'Thriller'], type: 'tv', posterPath: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg' },
  { title: 'Stranger Things', overview: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.', releaseDate: '2016-07-15', genres: ['Drama', 'Horror', 'Sci-Fi'], type: 'tv', posterPath: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
  { title: 'Spirited Away', overview: 'During her family\'s move, a sulky 10-year-old girl wanders into a world ruled by gods, witches, and spirits.', releaseDate: '2001-07-20', genres: ['Animation', 'Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
  { title: 'Parasite', overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', releaseDate: '2019-05-30', genres: ['Drama', 'Comedy', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
  { title: 'The Godfather', overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.', releaseDate: '1972-03-14', genres: ['Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
  { title: 'Fight Club', overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.', releaseDate: '1999-10-15', genres: ['Drama', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
];

async function seed() {
  await connectDB();

  // Clear existing data
  await Movie.deleteMany({});
  await User.deleteMany({});

  // Create admin user
  await User.create({
    username: 'admin',
    email: 'admin@imdb.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create test user
  await User.create({
    username: 'testuser',
    email: 'test@imdb.com',
    password: 'test123',
    role: 'user',
  });

  // Create movies
  await Movie.insertMany(sampleMovies);

  console.log('Database seeded successfully!');
  console.log('Admin: admin@imdb.com / admin123');
  console.log('User: test@imdb.com / test123');
  console.log(`Movies: ${sampleMovies.length} seeded`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
