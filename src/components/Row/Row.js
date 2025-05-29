import { useState, useEffect } from "react";
import axios from "../../axios"; // Use your configured axios instance
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import { useMyList } from "../../hooks/useMyList";

const baseUrl = "https://image.tmdb.org/t/p/original";

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const { addToMyList, removeFromMyList, isInMyList } = useMyList();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
        return request;
      } catch (error) {
        console.error(`Error fetching data for ${title}:`, error);
      }
    }
    fetchData();
  }, [fetchUrl, title]);

  const opts = {
    height: "390",
    width: "740",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || movie?.title || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleMyListClick = (movie, event) => {
    event.stopPropagation();
    if (isInMyList(movie.id)) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="row__poster-container"
            onMouseEnter={() => setHoveredMovie(movie.id)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            <img
              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`${baseUrl}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name || movie.title}
            />
            {hoveredMovie === movie.id && (
              <div className="row__poster-overlay">
                <button
                  className={`add-to-list-btn ${
                    isInMyList(movie.id) ? "in-list" : ""
                  }`}
                  onClick={(e) => handleMyListClick(movie, e)}
                  title={
                    isInMyList(movie.id)
                      ? "Remove from My List"
                      : "Add to My List"
                  }
                >
                  {isInMyList(movie.id) ? "✓" : "+"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {trailerUrl && (
        <YouTube videoId={trailerUrl} opts={opts} className="youtube" />
      )}
    </div>
  );
};

export default Row;
