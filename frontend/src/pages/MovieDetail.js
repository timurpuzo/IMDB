import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import {
  getMovie,
  rateMovie,
  deleteRating,
  getMyRating,
  createReview,
  updateReview,
  deleteReview,
  toggleWatchlist,
  checkWatchlist,
} from '../services/api';

function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await getMovie(id);
      setMovie(data.data.movie);
      setReviews(data.data.reviews);

      if (user) {
        const [ratingRes, watchlistRes] = await Promise.all([
          getMyRating(id).catch(() => ({ data: { data: null } })),
          checkWatchlist(id).catch(() => ({ data: { data: { inWatchlist: false } } })),
        ]);
        setMyRating(ratingRes.data.data?.value || 0);
        setInWatchlist(watchlistRes.data.data?.inWatchlist || false);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRate = async (value) => {
    try {
      await rateMovie(id, value);
      setMyRating(value);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRating = async () => {
    try {
      await deleteRating(id);
      setMyRating(0);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleWatchlist = async () => {
    try {
      const { data } = await toggleWatchlist(id);
      setInWatchlist(data.data.added);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (text) => {
    try {
      await createReview(id, text);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    }
  };

  const handleUpdateReview = async (text) => {
    try {
      await updateReview(id, text);
      setEditingReview(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating review');
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!movie) return <div className="empty-state"><h3>Movie not found</h3></div>;

  const poster = movie.posterPath || 'https://via.placeholder.com/300x450?text=No+Image';
  const year = movie.releaseDate ? movie.releaseDate.substring(0, 4) : '';
  const myReview = reviews.find((r) => r.user?._id === user?._id);

  return (
    <div>
      <div className="movie-detail">
        <img src={poster} alt={movie.title} />
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <div className="movie-detail-meta">
            {year && <span>{year}</span>}
            <span style={{ textTransform: 'capitalize' }}>{movie.type}</span>
            <span className="movie-card-rating">★ {movie.averageRating?.toFixed(1) || 'N/A'} ({movie.ratingCount || 0} votes)</span>
          </div>

          <div>
            {movie.genres?.map((g) => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>

          <p className="movie-detail-overview">{movie.overview}</p>

          {movie.cast?.length > 0 && (
            <>
              <h3 style={{ marginTop: 16 }}>Cast</h3>
              <div className="cast-list">
                {movie.cast.map((c, i) => (
                  <div key={i} className="cast-item">
                    {c.name} <span>as {c.character}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {user && (
            <div style={{ marginTop: 20 }}>
              <button
                className={`btn ${inWatchlist ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleToggleWatchlist}
              >
                {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          )}
        </div>
      </div>

      {user && (
        <div className="rating-section">
          <h3>Your Rating</h3>
          <StarRating value={myRating} onChange={handleRate} />
          {myRating > 0 && (
            <button
              className="btn btn-sm btn-danger"
              style={{ marginTop: 8 }}
              onClick={handleDeleteRating}
            >
              Remove Rating
            </button>
          )}
        </div>
      )}

      <div className="reviews-section">
        <h2>Reviews ({reviews.length})</h2>

        {user && !myReview && (
          <ReviewForm onSubmit={handleSubmitReview} />
        )}

        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <span className="review-author">{review.user?.username}</span>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {editingReview && review._id === myReview?._id ? (
              <ReviewForm
                initialText={review.text}
                onSubmit={handleUpdateReview}
                buttonLabel="Update Review"
              />
            ) : (
              <p className="review-text">{review.text}</p>
            )}
            {user && review.user?._id === user._id && (
              <div className="review-actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingReview(!editingReview)}
                >
                  {editingReview ? 'Cancel' : 'Edit'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={handleDeleteReview}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="empty-state">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
