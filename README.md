# IMDB - Internet Movie Database

A full-stack web application for discovering movies and TV shows, reading/writing reviews, managing watchlists, and receiving personalized recommendations.

**Authors:** Timur Puzo & Malek Altarhuni  
**Course:** IT 309 Software Engineering

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
- **[Database Schema Documentation](docs/database-schema.md)** - Complete ER diagram with Mermaid syntax
- **[ER Diagram Visualization](docs/ER-Diagram.md)** - ASCII representation of database relationships

### Key Tables
- **USER** - User accounts and profiles
- **MOVIE** - Movie/TV show information
- **REVIEW** - User reviews
- **RATING** - Numerical ratings (1-10)
- **WATCHLIST** - Personal movie collections
- **GENRE** - Movie categories
- **ACTOR** - Cast information
- **MOVIE_GENRE** - Movie-genre relationships
- **MOVIE_ACTOR** - Movie-actor relationships
```
