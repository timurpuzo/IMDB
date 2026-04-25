import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getMovies,
  adminCreateMovie,
  adminUpdateMovie,
  adminDeleteMovie,
  adminSeed,
} from '../services/api';

const emptyForm = {
  title: '',
  overview: '',
  posterPath: '',
  releaseDate: '',
  genres: '',
  type: 'movie',
};

function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchMovies = useCallback(async () => {
    try {
      const { data } = await getMovies({ page, limit: 20, sort: '-createdAt' });
      setMovies(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    }
  }, [page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
    };

    try {
      if (editId) {
        await adminUpdateMovie(editId, payload);
        setEditId(null);
      } else {
        await adminCreateMovie(payload);
      }
      setForm(emptyForm);
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving movie');
    }
  };

  const handleEdit = (movie) => {
    setEditId(movie._id);
    setForm({
      title: movie.title || '',
      overview: movie.overview || '',
      posterPath: movie.posterPath || '',
      releaseDate: movie.releaseDate || '',
      genres: (movie.genres || []).join(', '),
      type: movie.type || 'movie',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie and all related data?')) return;
    try {
      await adminDeleteMovie(id);
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting movie');
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const { data } = await adminSeed();
      alert(data.data.message);
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || 'Error seeding movies');
    }
    setSeeding(false);
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: 'var(--gold)' }}>Admin Panel</h1>
        <button className="btn btn-secondary" onClick={handleSeed} disabled={seeding}>
          {seeding ? 'Seeding...' : 'Seed from TMDb'}
        </button>
      </div>

      <div className="admin-form">
        <h2>{editId ? 'Edit Movie' : 'Add Movie'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Overview</label>
            <textarea name="overview" value={form.overview} onChange={handleChange} rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Poster URL</label>
              <input name="posterPath" value={form.posterPath} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Release Date</label>
              <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Genres (comma separated)</label>
              <input name="genres" value={form.genres} onChange={handleChange} placeholder="Action, Drama" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary">
              {editId ? 'Update' : 'Add Movie'}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm(emptyForm); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="section-title">All Movies ({pagination.total || 0})</h2>
      <div className="admin-movie-list">
        {movies.map((movie) => (
          <div key={movie._id} className="admin-movie-item">
            <div>
              <h4>{movie.title}</h4>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                {movie.type} · {movie.releaseDate?.substring(0, 4) || 'N/A'} · ★ {movie.averageRating?.toFixed(1)}
              </span>
            </div>
            <div className="admin-actions">
              <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(movie)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(movie._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page} of {pagination.pages}</span>
          <button className="btn btn-secondary" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
