import React, { useState, useEffect } from "react";
import "./DatabasePanel.css";
import { sanityService } from "../../services/sanityClient";

const DatabasePanel = ({ isOpen, onClose }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("movies");
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    genre: "",
    rating: 0,
    isPremium: false,
  });

  useEffect(() => {
    if (isOpen) {
      loadMovies();
    }
  }, [isOpen]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await sanityService.getMovies();
      setMovies(data);
    } catch (error) {
      console.error("Failed to load movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await sanityService.addMovie(newMovie);
      setNewMovie({
        title: "",
        description: "",
        genre: "",
        rating: 0,
        isPremium: false,
      });
      loadMovies();
      alert("Фильм успешно добавлен!");
    } catch (error) {
      alert("Ошибка при добавлении фильма");
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот фильм?")) {
      try {
        await sanityService.deleteMovie(id);
        loadMovies();
        alert("Фильм удален!");
      } catch (error) {
        alert("Ошибка при удалении фильма");
      }
    }
  };

  const handleSyncWithTMDB = async () => {
    alert("Синхронизация с TMDB запущена!");
  };

  if (!isOpen) return null;

  return (
    <div className="database-panel-overlay">
      <div className="database-panel">
        <div className="database-panel-header">
          <h2>Sanity Database Management</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="database-tabs">
          <button
            className={`tab ${activeTab === "movies" ? "active" : ""}`}
            onClick={() => setActiveTab("movies")}
          >
            Movies ({movies.length})
          </button>
          <button
            className={`tab ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            Add Movie
          </button>
          <button
            className={`tab ${activeTab === "sync" ? "active" : ""}`}
            onClick={() => setActiveTab("sync")}
          >
            Sync
          </button>
        </div>

        <div className="database-content">
          {activeTab === "movies" && (
            <div className="movies-list">
              {loading ? (
                <div className="loading">Loading movies...</div>
              ) : (
                <>
                  <div className="movies-grid">
                    {movies.map((movie) => (
                      <div key={movie._id} className="movie-card">
                        <div className="movie-info">
                          <h4>{movie.title}</h4>
                          <p>{movie.description?.substring(0, 100)}...</p>
                          <div className="movie-meta">
                            <span className="genre">{movie.genre}</span>
                            <span className="rating">★ {movie.rating}</span>
                            {movie.isPremium && (
                              <span className="premium">PREMIUM</span>
                            )}
                          </div>
                        </div>
                        <div className="movie-actions">
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteMovie(movie._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {movies.length === 0 && !loading && (
                    <div className="empty-state">
                      <p>No movies found in database</p>
                      <button onClick={() => setActiveTab("add")}>
                        Add First Movie
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "add" && (
            <form className="add-movie-form" onSubmit={handleAddMovie}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newMovie.description}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, description: e.target.value })
                  }
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Genre</label>
                  <select
                    value={newMovie.genre}
                    onChange={(e) =>
                      setNewMovie({ ...newMovie, genre: e.target.value })
                    }
                  >
                    <option value="">Select Genre</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="horror">Horror</option>
                    <option value="romance">Romance</option>
                    <option value="sci-fi">Sci-Fi</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={newMovie.rating}
                    onChange={(e) =>
                      setNewMovie({
                        ...newMovie,
                        rating: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newMovie.isPremium}
                    onChange={(e) =>
                      setNewMovie({ ...newMovie, isPremium: e.target.checked })
                    }
                  />
                  Premium Content
                </label>
              </div>

              <button type="submit" className="submit-btn">
                Add Movie
              </button>
            </form>
          )}

          {activeTab === "sync" && (
            <div className="sync-section">
              <h3>Synchronization Tools</h3>
              <p>Sync your Sanity database with external sources</p>

              <div className="sync-options">
                <div className="sync-option">
                  <h4>TMDB Sync</h4>
                  <p>Import movies from The Movie Database</p>
                  <button className="sync-btn" onClick={handleSyncWithTMDB}>
                    Sync with TMDB
                  </button>
                </div>

                <div className="sync-option">
                  <h4>Bulk Operations</h4>
                  <p>Perform bulk operations on your database</p>
                  <div className="bulk-actions">
                    <button
                      className="danger-btn"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to clear all movies?"
                          )
                        ) {
                          alert("Bulk delete functionality");
                        }
                      }}
                    >
                      Clear All Movies
                    </button>
                  </div>
                </div>
              </div>

              <div className="database-stats">
                <h4>Database Statistics</h4>
                <div className="stats-grid">
                  <div className="stat">
                    <span className="stat-label">Total Movies</span>
                    <span className="stat-value">{movies.length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Premium Content</span>
                    <span className="stat-value">
                      {movies.filter((m) => m.isPremium).length}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Average Rating</span>
                    <span className="stat-value">
                      {movies.length
                        ? (
                            movies.reduce((sum, m) => sum + m.rating, 0) /
                            movies.length
                          ).toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabasePanel;
