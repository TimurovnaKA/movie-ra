export const getCustomMovies = () => {
  try {
    const movies = localStorage.getItem("customMovies");
    return movies ? JSON.parse(movies) : [];
  } catch (error) {
    console.error("Ошибка при загрузке пользовательских фильмов:", error);
    return [];
  }
};

export const saveCustomMovie = (movie) => {
  try {
    const existingMovies = getCustomMovies();
    const newMovie = {
      ...movie,
      id: Date.now(),
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    const updatedMovies = [...existingMovies, newMovie];
    localStorage.setItem("customMovies", JSON.stringify(updatedMovies));
    return newMovie;
  } catch (error) {
    console.error("Ошибка при сохранении фильма:", error);
    throw error;
  }
};

export const deleteCustomMovie = (movieId) => {
  try {
    const existingMovies = getCustomMovies();
    const updatedMovies = existingMovies.filter(
      (movie) => movie.id !== movieId
    );
    localStorage.setItem("customMovies", JSON.stringify(updatedMovies));
    return true;
  } catch (error) {
    console.error("Ошибка при удалении фильма:", error);
    return false;
  }
};

export const updateCustomMovie = (movieId, updatedData) => {
  try {
    const existingMovies = getCustomMovies();
    const movieIndex = existingMovies.findIndex(
      (movie) => movie.id === movieId
    );

    if (movieIndex === -1) {
      throw new Error("Фильм не найден");
    }

    existingMovies[movieIndex] = {
      ...existingMovies[movieIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("customMovies", JSON.stringify(existingMovies));
    return existingMovies[movieIndex];
  } catch (error) {
    console.error("Ошибка при обновлении фильма:", error);
    throw error;
  }
};

export const mergeMoviesWithCustom = (apiMovies) => {
  const customMovies = getCustomMovies();
  return [...customMovies, ...apiMovies];
};

export const isCustomMovie = (movie) => {
  return movie.isCustom === true;
};

export const getMoviesByGenre = (allMovies, genreId) => {
  return allMovies.filter(
    (movie) => movie.genre_ids && movie.genre_ids.includes(genreId)
  );
};

export const searchMovies = (allMovies, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return allMovies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(term) ||
      (movie.overview && movie.overview.toLowerCase().includes(term))
  );
};
