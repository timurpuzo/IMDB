require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');
const Movie = require('./models/Movie');

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'];

const sampleMovies = [
  { title: 'The Shawshank Redemption', overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', releaseDate: '1994-09-23', genres: ['Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', cast: [{ name: 'Tim Robbins', character: 'Andy Dufresne' }, { name: 'Morgan Freeman', character: 'Red' }] },
  { title: 'The Dark Knight', overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', releaseDate: '2008-07-18', genres: ['Action', 'Drama', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', cast: [{ name: 'Christian Bale', character: 'Bruce Wayne' }, { name: 'Heath Ledger', character: 'Joker' }] },
  { title: 'Inception', overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', releaseDate: '2010-07-16', genres: ['Action', 'Sci-Fi', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg', cast: [{ name: 'Leonardo DiCaprio', character: 'Cobb' }, { name: 'Joseph Gordon-Levitt', character: 'Arthur' }] },
  { title: 'Pulp Fiction', overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', releaseDate: '1994-10-14', genres: ['Drama', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', cast: [{ name: 'John Travolta', character: 'Vincent Vega' }, { name: 'Samuel L. Jackson', character: 'Jules Winnfield' }] },
  { title: 'The Matrix', overview: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth.', releaseDate: '1999-03-31', genres: ['Action', 'Sci-Fi'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', cast: [{ name: 'Keanu Reeves', character: 'Neo' }, { name: 'Laurence Fishburne', character: 'Morpheus' }] },
  { title: 'Interstellar', overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', releaseDate: '2014-11-07', genres: ['Sci-Fi', 'Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', cast: [{ name: 'Matthew McConaughey', character: 'Cooper' }, { name: 'Anne Hathaway', character: 'Brand' }] },
  { title: 'Breaking Bad', overview: 'A high school chemistry teacher diagnosed with lung cancer turns to manufacturing methamphetamine to secure his family\'s future.', releaseDate: '2008-01-20', genres: ['Drama', 'Thriller'], type: 'tv', posterPath: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg', cast: [{ name: 'Bryan Cranston', character: 'Walter White' }, { name: 'Aaron Paul', character: 'Jesse Pinkman' }] },
  { title: 'Stranger Things', overview: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.', releaseDate: '2016-07-15', genres: ['Drama', 'Horror', 'Sci-Fi'], type: 'tv', posterPath: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', cast: [{ name: 'Millie Bobby Brown', character: 'Eleven' }, { name: 'Finn Wolfhard', character: 'Mike' }] },
  { title: 'Spirited Away', overview: 'During her family\'s move, a sulky 10-year-old girl wanders into a world ruled by gods, witches, and spirits.', releaseDate: '2001-07-20', genres: ['Animation', 'Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', cast: [{ name: 'Rumi Hiiragi', character: 'Chihiro (voice)' }, { name: 'Miyu Irino', character: 'Haku (voice)' }] },
  { title: 'Parasite', overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', releaseDate: '2019-05-30', genres: ['Drama', 'Comedy', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', cast: [{ name: 'Song Kang-ho', character: 'Ki-taek' }, { name: 'Lee Sun-kyun', character: 'Dong-ik' }] },
  { title: 'The Godfather', overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.', releaseDate: '1972-03-14', genres: ['Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', cast: [{ name: 'Marlon Brando', character: 'Don Vito Corleone' }, { name: 'Al Pacino', character: 'Michael Corleone' }] },
  { title: 'Fight Club', overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.', releaseDate: '1999-10-15', genres: ['Drama', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', cast: [{ name: 'Brad Pitt', character: 'Tyler Durden' }, { name: 'Edward Norton', character: 'The Narrator' }] },
  { title: 'Forrest Gump', overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.', releaseDate: '1994-07-06', genres: ['Drama', 'Romance'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', cast: [{ name: 'Tom Hanks', character: 'Forrest Gump' }, { name: 'Robin Wright', character: 'Jenny' }] },
  { title: 'The Avengers', overview: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.', releaseDate: '2012-05-04', genres: ['Action', 'Sci-Fi'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/cezAe8LHsE8Jt6sVqMTi9iCwPw.jpg', cast: [{ name: 'Robert Downey Jr.', character: 'Tony Stark' }, { name: 'Chris Evans', character: 'Steve Rogers' }] },
  { title: 'Joker', overview: 'During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.', releaseDate: '2019-10-04', genres: ['Drama', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', cast: [{ name: 'Joaquin Phoenix', character: 'Arthur Fleck' }, { name: 'Robert De Niro', character: 'Murray Franklin' }] },
  { title: 'Game of Thrones', overview: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.', releaseDate: '2011-04-17', genres: ['Drama', 'Fantasy', 'Action'], type: 'tv', posterPath: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', cast: [{ name: 'Emilia Clarke', character: 'Daenerys Targaryen' }, { name: 'Kit Harington', character: 'Jon Snow' }] },
  { title: 'The Office', overview: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.', releaseDate: '2005-03-24', genres: ['Comedy'], type: 'tv', posterPath: 'https://image.tmdb.org/t/p/w500/rP6YlCq7tWfVf8pZzCyfTfJhWp.jpg', cast: [{ name: 'Steve Carell', character: 'Michael Scott' }, { name: 'John Krasinski', character: 'Jim Halpert' }] },
  { title: 'Avatar', overview: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.', releaseDate: '2009-12-18', genres: ['Action', 'Sci-Fi', 'Adventure'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/c6VPgVsO4kZQr8r2eJ1rZcC9Y.jpg', cast: [{ name: 'Sam Worthington', character: 'Jake Sully' }, { name: 'Zoe Saldana', character: 'Neytiri' }] },
  { title: 'Titanic', overview: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.', releaseDate: '1997-12-19', genres: ['Drama', 'Romance'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIG30Kf.jpg', cast: [{ name: 'Leonardo DiCaprio', character: 'Jack Dawson' }, { name: 'Kate Winslet', character: 'Rose DeWitt Bukater' }] },
  { title: 'The Lion King', overview: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.', releaseDate: '1994-06-24', genres: ['Animation', 'Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', cast: [{ name: 'Matthew Broderick', character: 'Simba (voice)' }, { name: 'Jeremy Irons', character: 'Scar (voice)' }] },
  { title: 'Jurassic Park', overview: 'A pragmatic paleontologist touring an almost complete theme park on an island is tasked with protecting a couple of kids after a power failure causes the park\'s cloned dinosaurs to run loose.', releaseDate: '1993-06-11', genres: ['Action', 'Sci-Fi', 'Adventure'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', cast: [{ name: 'Sam Neill', character: 'Dr. Alan Grant' }, { name: 'Laura Dern', character: 'Dr. Ellie Sattler' }] },
  { title: 'The Silence of the Lambs', overview: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.', releaseDate: '1991-02-14', genres: ['Drama', 'Thriller', 'Horror'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', cast: [{ name: 'Jodie Foster', character: 'Clarice Starling' }, { name: 'Anthony Hopkins', character: 'Dr. Hannibal Lecter' }] },
  { title: 'Gladiator', overview: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', releaseDate: '2000-05-05', genres: ['Action', 'Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', cast: [{ name: 'Russell Crowe', character: 'Maximus' }, { name: 'Joaquin Phoenix', character: 'Commodus' }] },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', overview: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.', releaseDate: '2001-12-19', genres: ['Action', 'Adventure', 'Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2YQDqwpQ8cXnEz5C9.jpg', cast: [{ name: 'Elijah Wood', character: 'Frodo' }, { name: 'Ian McKellen', character: 'Gandalf' }] },
  { title: 'Saving Private Ryan', overview: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.', releaseDate: '1998-07-24', genres: ['Drama', 'War'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/hgi66Rcv2B7E9CyNQzNtMZY8kA.jpg', cast: [{ name: 'Tom Hanks', character: 'Captain Miller' }, { name: 'Matt Damon', character: 'Private Ryan' }] },
  { title: 'The Dark Knight Rises', overview: 'Eight years after the Joker\'s reign of anarchy, the Dark Knight is forced to return to confront the mercenary Bane.', releaseDate: '2012-07-20', genres: ['Action', 'Drama', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg', cast: [{ name: 'Christian Bale', character: 'Bruce Wayne' }, { name: 'Tom Hardy', character: 'Bane' }] },
  { title: 'Schindler\'s List', overview: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', releaseDate: '1993-12-15', genres: ['Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', cast: [{ name: 'Liam Neeson', character: 'Oskar Schindler' }, { name: 'Ben Kingsley', character: 'Itzhak Stern' }] },
  { title: 'Whiplash', overview: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.', releaseDate: '2014-10-10', genres: ['Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/lIv1Qin0q8Z7X7X7X7X7X7X7X7X7X7X7X.jpg', cast: [{ name: 'Miles Teller', character: 'Andrew' }, { name: 'J.K. Simmons', character: 'Fletcher' }] },
  { title: 'The Prestige', overview: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.', releaseDate: '2006-10-20', genres: ['Drama', 'Mystery', 'Thriller'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/d9d7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X.jpg', cast: [{ name: 'Christian Bale', character: 'Alfred' }, { name: 'Hugh Jackman', character: 'Robert' }] },
  { title: 'Mad Max: Fury Road', overview: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.', releaseDate: '2015-05-15', genres: ['Action', 'Sci-Fi'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg', cast: [{ name: 'Tom Hardy', character: 'Max' }, { name: 'Charlize Theron', character: 'Furiosa' }] },
  { title: 'The Grand Budapest Hotel', overview: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel\'s glorious years under an exceptional concierge.', releaseDate: '2014-03-28', genres: ['Comedy', 'Drama'], type: 'movie', posterPath: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpHzdJX.jpg', cast: [{ name: 'Ralph Fiennes', character: 'Gustave' }, { name: 'Tony Revolori', character: 'Zero' }] },
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
