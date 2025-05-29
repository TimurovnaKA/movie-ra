import "./Banner.css";
import { useState, useEffect } from "react";
import axios from "../../axios";
import requests from "../../request";
import { useFeatureFlag, FEATURE_FLAGS } from "../../hooks/useFeatureFlags";
import { getMoviePrice, isPremiumContent } from "../../services/pricingService";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const Banner = () => {
  const [movie, setMovie] = useState({});
  const [showRentModal, setShowRentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  const showPricing = useFeatureFlag(FEATURE_FLAGS.SHOW_PRICING);
  const enhancedBanner = useFeatureFlag(FEATURE_FLAGS.ENHANCED_BANNER);
  const autoplayTrailer = useFeatureFlag(FEATURE_FLAGS.TRAILER_AUTOPLAY);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const request = await axios.get(requests.fetchNetflixOriginals);

        if (
          request.data &&
          request.data.results &&
          request.data.results.length > 0
        ) {
          const selectedMovie =
            request.data.results[
              Math.floor(Math.random() * request.data.results.length)
            ];
          setMovie(selectedMovie);
        } else {
          setError("No movies found");
        }
      } catch (err) {
        console.error("Error fetching banner data:", err);
        setError("Failed to load movie data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePlayClick = async () => {
    if (!movie?.name && !movie?.title) {
      alert("Movie data not available");
      return;
    }

    if (trailerUrl && showTrailer) {
      // Если трейлер уже показан, скрываем его
      setShowTrailer(false);
      setTrailerUrl("");
    } else {
      // Ищем и показываем трейлер
      try {
        const movieName = movie?.name || movie?.title || movie?.original_name;
        const url = await movieTrailer(movieName);

        if (url) {
          const urlParams = new URLSearchParams(new URL(url).search);
          const videoId = urlParams.get("v");

          if (videoId) {
            setTrailerUrl(videoId);
            setShowTrailer(true);
          } else {
            alert(`Trailer not found for ${movieName}`);
          }
        } else {
          alert(`Trailer not found for ${movieName}`);
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
        alert(`Could not load trailer for ${movie?.name || movie?.title}`);
      }
    }
  };

  const handleMyListClick = () => {
    alert(`Added ${movie?.title || movie?.name || "this content"} to My List`);
  };

  const handleRentClick = () => {
    if (!movie?.id) {
      alert("Movie data not available");
      return;
    }
    setShowRentModal(true);
  };

  const handlePurchase = (type) => {
    if (!movie?.id) {
      alert("Movie data not available");
      return;
    }

    const price = getMoviePrice(movie.id, type);
    const movieName = movie?.title || movie?.name || "Unknown Movie";
    alert(`Purchasing ${movieName} for ${price.price} сом (${price.duration})`);
    setShowRentModal(false);
  };

  const closeModal = () => {
    setShowRentModal(false);
  };

  if (loading) {
    return (
      <div
        className="banner"
        style={{
          backgroundColor: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="banner"
        style={{
          backgroundColor: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        {error}
      </div>
    );
  }

  const isPremium = isPremiumContent(movie);
  const movieTitle =
    movie?.title || movie?.name || movie?.original_name || "Unknown Movie";

  // YouTube player options
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: autoplayTrailer ? 1 : 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <>
      <header
        className={`banner ${enhancedBanner ? "banner--enhanced" : ""}`}
        style={{
          backgroundSize: "cover",
          backgroundImage: movie?.backdrop_path
            ? `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`
            : "linear-gradient(135deg, #e50914, #000)",
          backgroundPosition: "50% 10%",
        }}
      >
        <div className="banner__contents">
          <h1 className="banner__title">
            {movieTitle}
            {enhancedBanner && isPremium && (
              <span className="banner__premium-badge">PREMIUM</span>
            )}
          </h1>

          <div className="banner__buttons">
            <button
              className="banner__button banner__button--play"
              onClick={handlePlayClick}
            >
              {showTrailer ? "Close Trailer" : "Play"}
            </button>
            <button className="banner__button" onClick={handleMyListClick}>
              My List
            </button>

            {/* Показываем кнопки покупки/аренды если флаг включен */}
            {showPricing && movie?.id && (
              <>
                <button
                  className="banner__button banner__button--rent"
                  onClick={handleRentClick}
                >
                  Rent {getMoviePrice(movie.id, "rent").price} сом
                </button>
                <button
                  className="banner__button banner__button--buy"
                  onClick={() => handlePurchase("buy")}
                >
                  Buy {getMoviePrice(movie.id, "buy").price} сом
                </button>
              </>
            )}
          </div>

          <div className="banner__description">
            {movie?.overview || "No description available"}
          </div>

          {enhancedBanner && (
            <div className="banner__metadata">
              {movie?.vote_average && (
                <span className="banner__rating">
                  ★ {movie.vote_average.toFixed(1)}
                </span>
              )}
              {(movie?.release_date || movie?.first_air_date) && (
                <span className="banner__year">
                  {new Date(
                    movie.release_date || movie.first_air_date
                  ).getFullYear()}
                </span>
              )}
              {isPremium && (
                <span className="banner__premium-tag">PREMIUM</span>
              )}
            </div>
          )}
        </div>
        <div className="banner__fadeBottom" />
      </header>

      {/* Trailer Section */}
      {showTrailer && trailerUrl && (
        <div className="trailer-section">
          <div className="trailer-container">
            <div className="trailer-header">
              <h3>Trailer: {movieTitle}</h3>
              <button
                className="trailer-close-btn"
                onClick={() => {
                  setShowTrailer(false);
                  setTrailerUrl("");
                }}
              >
                ✕
              </button>
            </div>
            <div className="trailer-player">
              <YouTube
                videoId={trailerUrl}
                opts={opts}
                onEnd={() => setShowTrailer(false)}
                onError={() => {
                  alert("Error loading trailer");
                  setShowTrailer(false);
                  setTrailerUrl("");
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Rent Modal */}
      {showRentModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="rental-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Choose Rental Option</h3>
            <p
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#ccc",
              }}
            >
              {movieTitle}
            </p>
            <div className="rental-options">
              <button
                className="rental-option"
                onClick={() => handlePurchase("rent")}
              >
                <div>Rent</div>
                <div>{getMoviePrice(movie.id, "rent").price} сом</div>
                <div className="rental-duration">
                  {getMoviePrice(movie.id, "rent").duration}
                </div>
              </button>
              <button
                className="rental-option"
                onClick={() => handlePurchase("buy")}
              >
                <div>Buy</div>
                <div>{getMoviePrice(movie.id, "buy").price} сом</div>
                <div className="rental-duration">
                  {getMoviePrice(movie.id, "buy").duration}
                </div>
              </button>
            </div>
            <button className="close-modal" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
