const axios = require('axios');

// Adapter pattern: transforms TMDb data into our schema
class TmdbAdapter {
  constructor() {
    this.baseUrl = process.env.TMDB_BASE_URL;
    this.apiKey = process.env.TMDB_API_KEY;
    this.imageBase = 'https://image.tmdb.org/t/p/w500';
  }

  async fetchPopularMovies(page = 1) {
    const { data } = await axios.get(`${this.baseUrl}/movie/popular`, {
      params: { api_key: this.apiKey, page },
    });
    return data.results.map((m) => this.adaptMovie(m, 'movie'));
  }

  async fetchPopularTVShows(page = 1) {
    const { data } = await axios.get(`${this.baseUrl}/tv/popular`, {
      params: { api_key: this.apiKey, page },
    });
    return data.results.map((m) => this.adaptTV(m));
  }

  async fetchMovieDetails(tmdbId) {
    const { data } = await axios.get(`${this.baseUrl}/movie/${tmdbId}`, {
      params: { api_key: this.apiKey, append_to_response: 'credits' },
    });
    return this.adaptMovieDetails(data);
  }

  adaptMovie(tmdbMovie, type = 'movie') {
    return {
      title: tmdbMovie.title || tmdbMovie.name,
      overview: tmdbMovie.overview || '',
      posterPath: tmdbMovie.poster_path
        ? `${this.imageBase}${tmdbMovie.poster_path}`
        : '',
      backdropPath: tmdbMovie.backdrop_path
        ? `${this.imageBase}${tmdbMovie.backdrop_path}`
        : '',
      releaseDate: tmdbMovie.release_date || tmdbMovie.first_air_date || '',
      tmdbId: tmdbMovie.id,
      type,
    };
  }

  adaptTV(tmdbShow) {
    return this.adaptMovie(
      { ...tmdbShow, title: tmdbShow.name, release_date: tmdbShow.first_air_date },
      'tv'
    );
  }

  adaptMovieDetails(tmdbMovie) {
    const adapted = this.adaptMovie(tmdbMovie);
    adapted.genres = (tmdbMovie.genres || []).map((g) => g.name);
    adapted.cast = (tmdbMovie.credits?.cast || []).slice(0, 10).map((c) => ({
      name: c.name,
      character: c.character,
    }));
    return adapted;
  }
}

module.exports = new TmdbAdapter();
