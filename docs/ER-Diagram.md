# IMDB Clone ER Diagram

## Database Schema Visualization

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      USER       │    │      MOVIE      │    │      GENRE      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ _id (PK)        │    │ _id (PK)        │    │ _id (PK)        │
│ username        │    │ title           │    │ name            │
│ email           │    │ description     │    └─────────────────┘
│ passwordHash    │    │ releaseYear     │           │
│ role            │    │ posterUrl       │           │
│ avatarUrl       │    │ type            │    ┌─────────────────┐
│ createdAt       │    │ averageRating   │    │      ACTOR      │
└─────────────────┘    │ ratingCount     │    ├─────────────────┤
         │              │ createdAt       │    │ _id (PK)        │
         │              └─────────────────┘    │ name            │
         │                       │              │ bio             │
         │                       │              │ birthYear       │
         │                       │              └─────────────────┘
         │                       │                       │
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     REVIEW      │              │
         │              ├─────────────────┤              │
         │              │ _id (PK)        │              │
         │              │ userId (FK)     │◄─────────────┘
         │              │ movieId (FK)    │
         │              │ text            │              │
         │              │ createdAt       │              │
         │              │ updatedAt       │              │
         │              └─────────────────┘              │
         │                       │                       │
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     RATING      │              │
         │              ├─────────────────┤              │
         │              │ _id (PK)        │              │
         │              │ userId (FK)     │◄─────────────┘
         │              │ movieId (FK)    │
         │              │ score           │
         │              │ createdAt       │
         │              └─────────────────┘
         │                       │
         │                       │
         │              ┌─────────────────┐
         │              │   WATCHLIST     │
         │              ├─────────────────┤
         │              │ _id (PK)        │
         │              │ userId (FK)     │◄─────────────┐
         │              │ movieId (FK)    │              │
         │              │ addedAt         │              │
         │              └─────────────────┘              │
         │                       │                       │
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │  MOVIE_GENRE    │              │
         │              ├─────────────────┤              │
         │              │ movieId (FK)    │◄─────────────┘
         │              │ genreId (FK)    │
         │              └─────────────────┘
         │                       │
         │                       │
         │              ┌─────────────────┐
         │              │  MOVIE_ACTOR    │
         │              ├─────────────────┤
         │              │ movieId (FK)    │◄─────────────┐
         │              │ actorId (FK)    │              │
         │              └─────────────────┘              │
         │                                               │
         └───────────────────────────────────────────────┘
```

## Table Relationships

### Primary Relationships:
- **USER** → **REVIEW**: One-to-many (user can write many reviews)
- **USER** → **RATING**: One-to-many (user can rate many movies)
- **USER** → **WATCHLIST**: One-to-many (user can have many watchlist items)
- **MOVIE** → **REVIEW**: One-to-many (movie can have many reviews)
- **MOVIE** → **RATING**: One-to-many (movie can have many ratings)
- **MOVIE** → **WATCHLIST**: One-to-many (movie can be in many watchlists)

### Many-to-Many Relationships:
- **MOVIE** ↔ **GENRE** (via MOVIE_GENRE junction table)
- **MOVIE** ↔ **ACTOR** (via MOVIE_ACTOR junction table)

## Key Features

- **User Management**: Authentication, roles (admin/user), profiles
- **Movie Catalog**: Detailed movie information with ratings
- **Review System**: User-generated reviews with timestamps
- **Rating System**: Numerical ratings with average calculation
- **Watchlist**: Personal movie collections
- **Genre Classification**: Categorize movies by genres
- **Actor Information**: Cast details and biographies

## Technical Implementation

- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcrypt password hashing
- **Relationships**: Referenced by ObjectId
- **Data Integrity**: Enforced at application level
- **Performance**: Indexed on frequently queried fields
