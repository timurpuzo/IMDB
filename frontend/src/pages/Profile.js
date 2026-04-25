import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MovieCard from '../components/MovieCard';
import {
  getUserStats,
  getUserRatings,
  getUserReviews,
  getRecommendations,
  updateProfile,
} from '../services/api';

function Profile() {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ ratingCount: 0, reviewCount: 0, watchlistCount: 0 });
  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });
  const [tab, setTab] = useState('ratings');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setForm({ username: user.username, email: user.email });

    getUserStats().then(({ data }) => setStats(data.data)).catch(() => {});
    getUserRatings().then(({ data }) => setRatings(data.data)).catch(() => {});
    getUserReviews().then(({ data }) => setReviews(data.data)).catch(() => {});
    getRecommendations().then(({ data }) => setRecommendations(data.data)).catch(() => {});
  }, [user, navigate]);

  const handleSave = async () => {
    try {
      await updateProfile(form);
      await loadUser();
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user.username[0].toUpperCase()}</div>
        <div>
          {editing ? (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--dark)', color: 'var(--text)' }}
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--dark)', color: 'var(--text)' }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <h2>{user.username}</h2>
              <p style={{ color: 'var(--text-dim)' }}>{user.email}</p>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.ratingCount}</div>
          <div className="stat-label">Ratings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.reviewCount}</div>
          <div className="stat-label">Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.watchlistCount}</div>
          <div className="stat-label">Watchlist</div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <>
          <h2 className="section-title">Recommended For You</h2>
          <div className="movie-grid" style={{ marginBottom: 32 }}>
            {recommendations.slice(0, 6).map((m) => (
              <MovieCard key={m._id} movie={m} />
            ))}
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button className={`btn ${tab === 'ratings' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('ratings')}>My Ratings</button>
        <button className={`btn ${tab === 'reviews' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('reviews')}>My Reviews</button>
      </div>

      {tab === 'ratings' && (
        <div>
          {ratings.length === 0 ? (
            <div className="empty-state"><p>No ratings yet</p></div>
          ) : (
            ratings.map((r) => (
              <div key={r._id} className="review-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to={`/movie/${r.movie?._id}`} style={{ fontWeight: 600 }}>{r.movie?.title}</Link>
                <span className="movie-card-rating">★ {r.value}/10</span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div>
          {reviews.length === 0 ? (
            <div className="empty-state"><p>No reviews yet</p></div>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <Link to={`/movie/${r.movie?._id}`} className="review-author">{r.movie?.title}</Link>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
