# IMDB - Internet Movie Database

A full-stack web application for discovering movies and TV shows, reading/writing reviews, managing watchlists, and receiving personalized recommendations.

**Authors:** Timur Puzo & Malek Altarhuni  
**Course:** IT 309 Software Engineering

**GitHub Repository:** [https://github.com/timurpuzo/IMDB](https://github.com/timurpuzo/IMDB)

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router, Axios       |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB with Mongoose               |
| Auth       | JWT, bcrypt.js                      |
| External   | TMDb API (optional seeding)         |

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally on port 27017 (or MongoDB Atlas URI)

## Quick Start

### 1. Clone & install

```bash
git clone <repo-url>
cd IMDB

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/imdb
JWT_SECRET=change_this_to_a_random_string
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 3. Seed the database

```bash
cd backend
node seed.js
```

This creates:
- **Admin account:** `admin@imdb.com` / `admin123`
- **Test account:** `test@imdb.com` / `test123`
- **12 sample movies** with posters, genres, and descriptions

### 4. Run the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Features

### User Features
- **Registration & Login** — JWT-based authentication with email validation
- **Movie Browsing** — Search, filter by genre/type, sort by rating/year
- **Pagination** — Navigate through movie listings
- **Movie Details** — Full synopsis, cast, genres, and community ratings
- **1–10 Star Rating** — Rate movies, edit or remove ratings
- **Reviews** — Write, edit, and delete text reviews
- **Watchlist** — Toggle movies in personal watchlist
- **Profile** — View stats, ratings, reviews, and recommendations
- **Recommendations** — Genre-based suggestions from rating history

### Admin Features
- **Add/Edit/Delete Movies** — Full CRUD through admin panel
- **TMDb Seeding** — Bulk import from TMDb API

## API Endpoints

| Method | Endpoint                        | Auth   | Description                |
|--------|---------------------------------|--------|----------------------------|
| POST   | `/api/auth/register`            | —      | Register new user          |
| POST   | `/api/auth/login`               | —      | Login                      |
| GET    | `/api/auth/me`                  | User   | Current user               |
| PUT    | `/api/auth/profile`             | User   | Update profile             |
| GET    | `/api/movies`                   | —      | List movies (search/filter)|
| GET    | `/api/movies/genres`            | —      | All genres                 |
| GET    | `/api/movies/:id`               | —      | Movie details + reviews    |
| POST   | `/api/movies/:id/rate`          | User   | Rate movie (1–10)          |
| DELETE | `/api/movies/:id/rate`          | User   | Delete rating              |
| GET    | `/api/movies/:id/my-rating`     | User   | Get user's rating          |
| POST   | `/api/movies/:id/review`        | User   | Create review              |
| PUT    | `/api/movies/:id/review`        | User   | Update review              |
| DELETE | `/api/movies/:id/review`        | User   | Delete review              |
| GET    | `/api/users/watchlist`          | User   | Get watchlist              |
| POST   | `/api/users/watchlist/:movieId` | User   | Toggle watchlist           |
| GET    | `/api/users/stats`              | User   | User statistics            |
| GET    | `/api/users/recommendations`    | User   | Recommendations            |
| POST   | `/api/admin/movies`             | Admin  | Add movie                  |
| PUT    | `/api/admin/movies/:id`         | Admin  | Edit movie                 |
| DELETE | `/api/admin/movies/:id`         | Admin  | Delete movie + related     |
| POST   | `/api/admin/seed`               | Admin  | Seed from TMDb             |

## Design Patterns

- **Singleton** — Database connection (`config/database.js`)
- **Factory** — API response formatting (`utils/responseFactory.js`)
- **Adapter** — TMDb API data transformation (`services/tmdbAdapter.js`)
- **Decorator** — Auth middleware on routes (`middleware/auth.js`)
- **Observer** — Auto rating recalculation (`models/Rating.js` post hooks)
- **Strategy** — Recommendation algorithms (`services/recommendationService.js`)

## Testing

```bash
cd backend
npm test
```

Tests located in `backend/tests/`:
- `auth.test.js` — Registration, login, profile
- `movies.test.js` — CRUD, search, ratings, reviews
- `users.test.js` — Watchlist, stats, recommendations

## Project Structure

```
IMDB/
├── backend/
│   ├── config/database.js
│   ├── middleware/auth.js
│   ├── models/          (User, Movie, Rating, Review, Watchlist)
│   ├── routes/          (auth, movies, users, admin)
│   ├── services/        (tmdbAdapter, recommendationService)
│   ├── utils/responseFactory.js
│   ├── tests/
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  (Navbar, MovieCard, StarRating, ReviewForm)
│       ├── hooks/useAuth.js
│       ├── pages/       (Home, MovieDetail, Login, Register, Profile, WatchlistPage, AdminPanel)
│       └── services/api.js
├── docs/
│   ├── ER-Diagram.md
│   └── database-schema.md
└── README.md
```

## Database Schema

For detailed database structure and relationships, see:
- **[ER Diagram Image](docs/ER-Diagram-Image.md)** - Visual ER diagram with image representation

### Database Collections

The application uses MongoDB with Mongoose. The database contains the following eleven collections:

**users** - Stores registered user accounts, including username, email, hashed password, role (user or admin), avatar URL, and timestamps for account creation

**movies** - The main content entity of the application, storing the title, overview, poster image URL, release date, content type (movie or TV show), and computed fields for average rating and total rating count

**reviews** - Stores text-based reviews written by users about specific movies. Each review is linked to a user and a movie via reference IDs, and includes the review text and timestamps for creation and last edit

**ratings** - Stores the numeric score (between 1 and 10) that a user assigns to a specific movie. The system enforces one rating per user per movie, and updates the movie's average rating automatically when a rating is added, changed, or removed

**watchlist** - A junction collection that tracks which movies each user has saved to their personal watchlist, storing references to both the user and the movie along with the date the item was added

**genres** - Stores movie genre categories (Action, Drama, Comedy, etc.)

**actors** - Stores actor information including name, biography, and birth year

**movie_genres** - Junction table implementing many-to-many relationship between movies and genres

**movie_actors** - Junction table implementing many-to-many relationship between movies and actors
