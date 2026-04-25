import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const year = movie.releaseDate ? movie.releaseDate.substring(0, 4) : '';
  const poster = movie.posterPath || 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <Link to={`/movie/${movie._id}`} className="movie-card">
      <img src={poster} alt={movie.title} loading="lazy" />
      <div className="movie-card-body">
        <h3 title={movie.title}>{movie.title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="movie-card-rating">
            ★ {movie.averageRating ? movie.averageRating.toFixed(1) : 'N/A'}
          </span>
          <span className="movie-card-year">{year}</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
