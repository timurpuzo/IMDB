# Design Patterns Implementation

This document describes the architectural and design patterns implemented in the IMDB Clone application.

## Architectural Patterns

### Singleton Pattern
**Location:** `backend/config/database.js`

The database connection uses the Singleton pattern to ensure only one connection instance exists throughout the application lifecycle. This prevents multiple connection pools and optimizes resource usage.

```javascript
let connection = null;
const connectDB = async () => {
  if (connection) return connection;
  connection = await mongoose.connect(process.env.MONGODB_URI);
  return connection;
};
```

## Design Patterns

### Strategy Pattern
**Location:** `backend/services/recommendationService.js`

The recommendation system uses the Strategy pattern to allow pluggable recommendation algorithms. Different strategies can be swapped at runtime without changing the client code.

- `GenreBasedStrategy` - Recommends movies based on user's top-rated genres
- `PopularityStrategy` - Recommends highly-rated popular movies
- `RecommendationService` - Context class that manages strategy selection

```javascript
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
}
```

### Adapter Pattern
**Location:** `backend/services/tmdbAdapter.js`

The TMDb Adapter transforms external API data from TMDb format into our internal Movie schema format. This decouples our application from the external API structure.

```javascript
class TmdbAdapter {
  adaptMovie(tmdbMovie, type = 'movie') {
    return {
      title: tmdbMovie.title || tmdbMovie.name,
      overview: tmdbMovie.overview || '',
      posterPath: tmdbMovie.poster_path
        ? `${this.imageBase}${tmdbMovie.poster_path}`
        : '',
      // ... transforms TMDb data to our schema
    };
  }
}
```

### Factory Pattern
**Location:** `backend/utils/responseFactory.js`

The response factory creates standardized API responses with consistent structure across all endpoints. This ensures uniform response format for success, error, and paginated responses.

```javascript
const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

const error = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const paginated = (res, data, page, limit, total) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};
```

### Decorator Pattern
**Location:** `backend/middleware/auth.js`

The authentication middleware wraps route handlers to add authentication functionality. This allows authentication to be added to any route without modifying the route handler itself.

```javascript
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### Observer Pattern
**Location:** `backend/models/Rating.js` and `backend/models/Movie.js`

The rating system uses the Observer pattern through Mongoose post hooks. When a rating is saved or deleted, it automatically triggers the movie's rating recalculation.

```javascript
// Rating.js - Observer: update movie average after save
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
```

## Pattern Summary

| Pattern | Type | Location | Purpose |
|---------|------|----------|---------|
| Singleton | Architectural | config/database.js | Single database connection instance |
| Strategy | Design | services/recommendationService.js | Pluggable recommendation algorithms |
| Adapter | Design | services/tmdbAdapter.js | Transform external API data |
| Factory | Design | utils/responseFactory.js | Standardized API responses |
| Decorator | Design | middleware/auth.js | Add authentication to routes |
| Observer | Design | models/Rating.js, Movie.js | Auto-update movie ratings |

All patterns solve specific problems in the application and are actively used, not just present for demonstration purposes.
