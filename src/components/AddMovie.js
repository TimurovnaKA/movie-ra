import React, { useState } from "react";
import "./AddMovie.css";

function AddMovie({ onAddMovie }) {
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    poster_path: "",
    backdrop_path: "",
    release_date: "",
    vote_average: "",
    genre_ids: [],
    trailer_url: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreChange = (genreId) => {
    setFormData((prev) => ({
      ...prev,
      genre_ids: prev.genre_ids.includes(genreId)
        ? prev.genre_ids.filter((id) => id !== genreId)
        : [...prev.genre_ids, genreId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newMovie = {
        id: Date.now(),
        title: formData.title,
        overview: formData.overview,
        poster_path: formData.poster_path,
        backdrop_path: formData.backdrop_path,
        release_date: formData.release_date,
        vote_average: parseFloat(formData.vote_average) || 0,
        genre_ids: formData.genre_ids,
        trailer_url: formData.trailer_url,
        isCustom: true,
      };

      const existingMovies = JSON.parse(
        localStorage.getItem("customMovies") || "[]"
      );
      const updatedMovies = [...existingMovies, newMovie];
      localStorage.setItem("customMovies", JSON.stringify(updatedMovies));

      if (onAddMovie) {
        onAddMovie(newMovie);
      }

      setFormData({
        title: "",
        overview: "",
        poster_path: "",
        backdrop_path: "",
        release_date: "",
        vote_average: "",
        genre_ids: [],
        trailer_url: "",
      });

      alert("Фильм успешно добавлен!");
    } catch (error) {
      console.error("Ошибка при добавлении фильма:", error);
      alert("Произошла ошибка при добавлении фильма");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-movie">
      <h2>Добавить новый фильм</h2>
      <form onSubmit={handleSubmit} className="add-movie-form">
        <div className="form-group">
          <label>Название фильма *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Введите название фильма"
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            name="overview"
            value={formData.overview}
            onChange={handleInputChange}
            placeholder="Краткое описание фильма"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>URL постера</label>
          <input
            type="url"
            name="poster_path"
            value={formData.poster_path}
            onChange={handleInputChange}
            placeholder="https://example.com/poster.jpg"
          />
        </div>

        <div className="form-group">
          <label>URL фонового изображения</label>
          <input
            type="url"
            name="backdrop_path"
            value={formData.backdrop_path}
            onChange={handleInputChange}
            placeholder="https://example.com/backdrop.jpg"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Дата выхода</label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Рейтинг (0-10)</label>
            <input
              type="number"
              name="vote_average"
              value={formData.vote_average}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
              placeholder="8.5"
            />
          </div>
        </div>

        <div className="form-group">
          <label>URL трейлера</label>
          <input
            type="url"
            name="trailer_url"
            value={formData.trailer_url}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="form-group">
          <label>Жанры</label>
          <div className="genres-grid">
            {genres.map((genre) => (
              <label key={genre.id} className="genre-checkbox">
                <input
                  type="checkbox"
                  checked={formData.genre_ids.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isLoading || !formData.title}>
          {isLoading ? "Добавление..." : "Добавить фильм"}
        </button>
      </form>
    </div>
  );
}

export default AddMovie;
