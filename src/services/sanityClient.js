import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "your-project-id",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-01-01",
  token: "your-auth-token",
});

export const sanityQueries = {
  getAllMovies: `*[_type == "movie"]{
    _id,
    title,
    description,
    releaseDate,
    poster{
      asset->{
        _id,
        url
      }
    },
    backdrop{
      asset->{
        _id,
        url
      }
    },
    genre,
    rating,
    isPremium,
    price,
    duration,
    cast[]->{
      name,
      role
    }
  }`,

  getMoviesByGenre: (genre) => `*[_type == "movie" && genre match "${genre}"]{
    _id,
    title,
    description,
    poster{
      asset->{
        _id,
        url
      }
    },
    genre,
    rating,
    isPremium
  }`,

  getPremiumContent: `*[_type == "movie" && isPremium == true]{
    _id,
    title,
    description,
    poster{
      asset->{
        _id,
        url
      }
    },
    genre,
    rating,
    price
  }`,
};

export const sanityService = {
  async getMovies() {
    try {
      return await sanityClient.fetch(sanityQueries.getAllMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  },

  async getMoviesByGenre(genre) {
    try {
      return await sanityClient.fetch(sanityQueries.getMoviesByGenre(genre));
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      return [];
    }
  },

  async getPremiumContent() {
    try {
      return await sanityClient.fetch(sanityQueries.getPremiumContent);
    } catch (error) {
      console.error("Error fetching premium content:", error);
      return [];
    }
  },

  async addMovie(movieData) {
    try {
      const doc = {
        _type: "movie",
        title: movieData.title,
        description: movieData.description,
        releaseDate: movieData.releaseDate,
        genre: movieData.genre,
        rating: movieData.rating,
        isPremium: movieData.isPremium || false,
        price: movieData.price || 0,
        duration: movieData.duration,
        tmdbId: movieData.id,
      };

      return await sanityClient.create(doc);
    } catch (error) {
      console.error("Error adding movie:", error);
      throw error;
    }
  },

  async updateMovie(id, updates) {
    try {
      return await sanityClient.patch(id).set(updates).commit();
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  async deleteMovie(id) {
    try {
      return await sanityClient.delete(id);
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error;
    }
  },

  async syncWithTMDB(tmdbMovies) {
    try {
      const existingMovies = await this.getMovies();
      const existingTmdbIds = existingMovies.map((m) => m.tmdbId);

      const newMovies = tmdbMovies.filter(
        (movie) => !existingTmdbIds.includes(movie.id)
      );

      const addPromises = newMovies.map((movie) =>
        this.addMovie({
          title: movie.title || movie.name,
          description: movie.overview,
          releaseDate: movie.release_date || movie.first_air_date,
          genre: movie.genre_ids?.[0] || "unknown",
          rating: movie.vote_average,
          id: movie.id,
          isPremium: movie.vote_average > 8.0,
        })
      );

      return await Promise.all(addPromises);
    } catch (error) {
      console.error("Error syncing with TMDB:", error);
      throw error;
    }
  },
};
