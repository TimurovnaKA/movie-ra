import { useState } from "react";
import "./MyListRow.css";
import { useMyList } from "../../hooks/useMyList";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseUrl = "https://image.tmdb.org/t/p/original";

const MyListRow = () => {
  const { myList, removeFromMyList } = useMyList();
  const [trailerUrl, setTrailerUrl] = useState("");

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

  const handleRemove = (movieId, event) => {
    event.stopPropagation();
    removeFromMyList(movieId);
  };

  if (myList.length === 0) {
    return (
      <div className="row">
        <h2>My List</h2>
        <div className="my-list-empty">
          <p>Your list is empty. Add movies and shows to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <h2>My List ({myList.length})</h2>
      <div className="row__posters">
        {myList.map((movie) => (
          <div key={movie.id} className="my-list-item">
            <img
              onClick={() => handleClick(movie)}
              className="row__poster row__posterLarge"
              src={`${baseUrl}${movie.poster_path || movie.backdrop_path}`}
              alt={movie.name || movie.title}
            />
            <button
              className="remove-from-list"
              onClick={(e) => handleRemove(movie.id, e)}
              title="Remove from My List"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {trailerUrl && (
        <YouTube videoId={trailerUrl} opts={opts} className="youtube" />
      )}
    </div>
  );
};

export default MyListRow;
