import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000
});

// Request interceptor - automatically attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Movies
export const getMovies = (params) => API.get('/movies', { params });
export const getGenres = () => API.get('/movies/genres');
export const getMovie = (id) => API.get(`/movies/${id}`);
export const rateMovie = (id, value) => API.post(`/movies/${id}/rate`, { value });
export const deleteRating = (id) => API.delete(`/movies/${id}/rate`);
export const getMyRating = (id) => API.get(`/movies/${id}/my-rating`);
export const createReview = (id, text) => API.post(`/movies/${id}/review`, { text });
export const updateReview = (id, text) => API.put(`/movies/${id}/review`, { text });
export const deleteReview = (id) => API.delete(`/movies/${id}/review`);

// User
export const getWatchlist = () => API.get('/users/watchlist');
export const toggleWatchlist = (movieId) => API.post(`/users/watchlist/${movieId}`);
export const checkWatchlist = (movieId) => API.get(`/users/watchlist/check/${movieId}`);
export const getUserStats = () => API.get('/users/stats');
export const getUserRatings = () => API.get('/users/ratings');
export const getUserReviews = () => API.get('/users/reviews');
export const getRecommendations = () => API.get('/users/recommendations');

// Admin
export const adminCreateMovie = (data) => API.post('/admin/movies', data);
export const adminUpdateMovie = (id, data) => API.put(`/admin/movies/${id}`, data);
export const adminDeleteMovie = (id) => API.delete(`/admin/movies/${id}`);
export const adminSeed = () => API.post('/admin/seed');
