import { useState, useEffect, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import { getMovies, getGenres } from '../services/api';

function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenreList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('-averageRating');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, sort, limit: 12 };
      if (search) params.search = search;
      if (genre) params.genre = genre;
      if (type) params.type = type;

      const { data } = await getMovies(params);
      setMovies(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [search, genre, type, sort, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    getGenres().then(({ data }) => setGenreList(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, genre, type, sort]);

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="movie">Movie</option>
          <option value="tv">TV Show</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="-averageRating">Rating: High → Low</option>
          <option value="averageRating">Rating: Low → High</option>
          <option value="-releaseDate">Year: Newest</option>
          <option value="releaseDate">Year: Oldest</option>
          <option value="title">Title: A-Z</option>
        </select>
      </div>

      {loading ? (
        <div className="movie-grid">
          {[...Array(12)].map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <h3>No movies found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
          <div className="pagination">
            <button
              className="btn btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>Page {pagination.page} of {pagination.pages || 1}</span>
            <button
              className="btn btn-secondary"
              disabled={page >= (pagination.pages || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
