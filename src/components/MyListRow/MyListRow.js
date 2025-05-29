import React from "react";
import { useMyList } from "../../hooks/useMyList";
import "./MyListRow.css";

const MyListRow = () => {
  const { myList, removeFromMyList } = useMyList();

  if (myList.length === 0) {
    return (
      <div className="mylist-row">
        <h2>My List</h2>
        <div className="mylist-empty">
          <p>
            Your list is empty. Add movies and shows you want to watch later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mylist-row">
      <h2>My List ({myList.length})</h2>
      <div className="mylist-posters">
        {myList.map((movie) => (
          <div key={movie.id} className="mylist-item">
            <img
              className="mylist-poster"
              src={`https://image.tmdb.org/t/p/original${
                movie.poster_path || movie.backdrop_path
              }`}
              alt={movie.name || movie.title}
            />
            <div className="mylist-overlay">
              <button
                className="remove-btn"
                onClick={() => removeFromMyList(movie.id)}
                title="Remove from My List"
              >
                ✕
              </button>
              <div className="mylist-info">
                <h4>{movie.title || movie.name}</h4>
                <p>★ {movie.vote_average?.toFixed(1)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListRow;
