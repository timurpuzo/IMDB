require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Rating = require('./models/Rating');
const Review = require('./models/Review');

const fakeUsers = [
  { username: 'moviefan92', email: 'moviefan92@gmail.com', password: 'pass123456', role: 'user' },
  { username: 'cinephile_jane', email: 'jane.cinema@yahoo.com', password: 'pass123456', role: 'user' },
  { username: 'filmcritic_bob', email: 'bob.reviews@outlook.com', password: 'pass123456', role: 'user' },
  { username: 'sarah_watches', email: 'sarah.w@gmail.com', password: 'pass123456', role: 'user' },
  { username: 'mike_movies', email: 'mike.m@hotmail.com', password: 'pass123456', role: 'user' },
  { username: 'anna_k', email: 'anna.k@gmail.com', password: 'pass123456', role: 'user' },
  { username: 'david_director', email: 'david.d@yahoo.com', password: 'pass123456', role: 'user' },
  { username: 'emma_reviews', email: 'emma.r@gmail.com', password: 'pass123456', role: 'user' },
];

const reviewTexts = [
  'Absolutely stunning film. The cinematography alone makes it worth watching, but the story takes it to another level entirely.',
  'One of the best movies I have ever seen. The acting is phenomenal and the plot keeps you on the edge of your seat the entire time.',
  'A masterpiece of modern cinema. Every scene is carefully crafted and the attention to detail is remarkable.',
  'Great movie but felt a bit long in the middle. Still, the ending made up for it and I would definitely watch it again.',
  'Not my usual genre but I was pleasantly surprised. The character development is excellent and the dialogue feels natural.',
  'Incredible performances from the entire cast. This is the kind of film that stays with you long after the credits roll.',
  'A solid film with great production values. The soundtrack perfectly complements the visuals and enhances every emotional moment.',
  'Thoroughly enjoyed this one. It manages to be both entertaining and thought-provoking, which is a rare combination these days.',
  'The director really outdid themselves with this film. Bold creative choices that all pay off in spectacular fashion.',
  'A bit overrated in my opinion but still a good watch. The first half is stronger than the second, but overall worth your time.',
  'Rewatched this for the third time and it only gets better. You notice new details and appreciate the storytelling even more.',
  'Fantastic movie that deserves all the praise it gets. The ending is perfect and ties everything together beautifully.',
  'Very well made film with strong performances across the board. The pacing is excellent and never drags for a moment.',
  'This film surprised me in the best way possible. Went in with low expectations and came out completely blown away.',
  'A timeless classic that still holds up perfectly today. The themes are universal and the execution is flawless.',
];

async function seedReviews() {
  await connectDB();

  // Create fake users
  const createdUsers = [];
  for (const userData of fakeUsers) {
    const existing = await User.findOne({ email: userData.email });
    if (!existing) {
      const user = await User.create(userData);
      createdUsers.push(user);
    } else {
      createdUsers.push(existing);
    }
  }
  console.log(`Users ready: ${createdUsers.length}`);

  // Get all movies
  const movies = await Movie.find({});
  console.log(`Movies found: ${movies.length}`);

  let ratingsCreated = 0;
  let reviewsCreated = 0;

  // Each user rates and reviews some movies
  for (const user of createdUsers) {
    // Each user rates 8-15 random movies
    const numRatings = Math.floor(Math.random() * 8) + 8;
    const shuffledMovies = movies.sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(numRatings, shuffledMovies.length); i++) {
      const movie = shuffledMovies[i];
      const value = Math.floor(Math.random() * 4) + 6; // Ratings between 6-10

      const existingRating = await Rating.findOne({ user: user._id, movie: movie._id });
      if (!existingRating) {
        const rating = await Rating.create({ user: user._id, movie: movie._id, value });
        ratingsCreated++;
      }
    }

    // Each user reviews 3-6 random movies
    const numReviews = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < Math.min(numReviews, shuffledMovies.length); i++) {
      const movie = shuffledMovies[i];
      const text = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];

      const existingReview = await Review.findOne({ user: user._id, movie: movie._id });
      if (!existingReview) {
        await Review.create({ user: user._id, movie: movie._id, text });
        reviewsCreated++;
      }
    }
  }

  console.log(`\nSeeding complete!`);
  console.log(`Ratings created: ${ratingsCreated}`);
  console.log(`Reviews created: ${reviewsCreated}`);
  process.exit(0);
}

seedReviews().catch((err) => {
  console.error(err);
  process.exit(1);
});
