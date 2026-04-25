const API_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

const api = {
  // Auth
  register: (body) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (body) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Movies
  getMovies: (params) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/movies?${q}`);
  },
  getGenres: () => apiRequest('/movies/genres'),
  getMovie: (id) => apiRequest(`/movies/${id}`),
  rateMovie: (id, value) => apiRequest(`/movies/${id}/rate`, { method: 'POST', body: JSON.stringify({ value }) }),
  deleteRating: (id) => apiRequest(`/movies/${id}/rate`, { method: 'DELETE' }),
  getMyRating: (id) => apiRequest(`/movies/${id}/my-rating`),
  createReview: (id, text) => apiRequest(`/movies/${id}/review`, { method: 'POST', body: JSON.stringify({ text }) }),
  updateReview: (id, text) => apiRequest(`/movies/${id}/review`, { method: 'PUT', body: JSON.stringify({ text }) }),
  deleteReview: (id) => apiRequest(`/movies/${id}/review`, { method: 'DELETE' }),

  // Users
  getWatchlist: () => apiRequest('/users/watchlist'),
  toggleWatchlist: (movieId) => apiRequest(`/users/watchlist/${movieId}`, { method: 'POST' }),
  checkWatchlist: (movieId) => apiRequest(`/users/watchlist/check/${movieId}`),
  getStats: () => apiRequest('/users/stats'),
  getRatings: () => apiRequest('/users/ratings'),
  getReviews: () => apiRequest('/users/reviews'),
  getRecommendations: () => apiRequest('/users/recommendations'),

  // Admin
  createMovie: (body) => apiRequest('/admin/movies', { method: 'POST', body: JSON.stringify(body) }),
  updateMovie: (id, body) => apiRequest(`/admin/movies/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteMovie: (id) => apiRequest(`/admin/movies/${id}`, { method: 'DELETE' }),
  seed: () => apiRequest('/admin/seed', { method: 'POST' }),
};
