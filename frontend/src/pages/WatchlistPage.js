import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MovieCard from '../components/MovieCard';
import { getWatchlist } from '../services/api';

function WatchlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    getWatchlist()
      .then(({ data }) => setMovies(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>
      {movies.length === 0 ? (
        <div className="empty-state">
          <h3>Your watchlist is empty</h3>
          <p>Browse movies and add them to your watchlist</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchlistPage;
