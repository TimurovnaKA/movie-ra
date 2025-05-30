import "./Banner.css";
import { useState, useEffect } from "react";
import axios from "../../axios";
import requests from "../../request";
import { useFeatureFlag, FEATURE_FLAGS } from "../../hooks/useFeatureFlags";
import { getMoviePrice, isPremiumContent } from "../../services/pricingService";
import { useMyList } from "../../hooks/useMyList";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const Banner = () => {
  const [movie, setMovie] = useState([]);
  const [showRentModal, setShowRentModal] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  const showPricing = useFeatureFlag(FEATURE_FLAGS.SHOW_PRICING);
  const enhancedBanner = useFeatureFlag(FEATURE_FLAGS.ENHANCED_BANNER);

  const { addToMyList, removeFromMyList, isInMyList } = useMyList();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      const selectedMovie =
        request.data.results[
          Math.floor(Math.random() * request.data.results.length)
        ];
      setMovie(selectedMovie);
      return request;
    }
    fetchData();
  }, []);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  const handlePlayClick = () => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      setIsLoadingTrailer(true);
      const movieName = movie?.name || movie?.title || movie?.original_name;

      movieTrailer(movieName)
        .then((url) => {
          if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            const videoId = urlParams.get("v");
            if (videoId) {
              setTrailerUrl(videoId);
            } else {
              throw new Error("Video ID not found");
            }
          } else {
            throw new Error("No trailer URL found");
          }
        })
        .catch((err) => {
          console.log("Trailer search error:", err);
          alert(
            `Трейлер для "${movieName}" не найден. Попробуйте другой фильм.`
          );
        })
        .finally(() => {
          setIsLoadingTrailer(false);
        });
    }
  };

  const handleRentClick = () => {
    setShowRentModal(true);
  };

  const handlePurchase = (type) => {
    const price = getMoviePrice(movie.id, type);
    const movieTitle = movie?.title || movie?.name || movie?.original_name;
    alert(
      `Purchase "${movieTitle}" for ${price.price} $ (${price.duration})\n\nThanks for your purchase! 🎬`
    );
    setShowRentModal(false);
  };

  const handleMyListClick = () => {
    if (isInMyList(movie.id)) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  const isPremium = isPremiumContent(movie);

  return (
    <>
      <header
        className={`banner ${enhancedBanner ? "banner--enhanced" : ""}`}
        style={{
          backgroundSize: "cover",
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
          backgroundPosition: "50% 10%",
        }}
      >
        <div className="banner__contents">
          <h1 className="banner__title">
            {movie?.title || movie.name || movie?.original_name}
            {enhancedBanner && isPremium && (
              <span className="banner__premium-badge">PREMIUM</span>
            )}
          </h1>
          <div className="banner__buttons">
            <button
              className={`banner__button ${
                isInMyList(movie.id) ? "banner__button--in-list" : ""
              }`}
              onClick={handleMyListClick}
            >
              {isInMyList(movie.id) ? "✓ On my list" : "+ My list"}
            </button>

            {showPricing && (
              <>
                <button
                  className="banner__button banner__button--rent"
                  onClick={handleRentClick}
                >
                  🎬 Rent {getMoviePrice(movie.id, "rent").price} $
                </button>
                <button
                  className="banner__button banner__button--buy"
                  onClick={handleRentClick}
                >
                  💎 Buy {getMoviePrice(movie.id, "buy").price} $
                </button>
              </>
            )}
          </div>
          <h1 className="banner__description">{movie?.overview}</h1>

          {enhancedBanner && (
            <div className="banner__metadata">
              <span className="banner__rating">
                ⭐ {movie?.vote_average?.toFixed(1)}
              </span>
              <span className="banner__year">
                {new Date(
                  movie?.release_date || movie?.first_air_date
                ).getFullYear()}
              </span>
              {isPremium && (
                <span className="banner__premium-tag">PREMIUM</span>
              )}
            </div>
          )}
        </div>
        <div className="banner__fadeBottom" />
      </header>

      {showRentModal && (
        <div className="modal-overlay" onClick={() => setShowRentModal(false)}>
          <div className="rental-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🎬 Choose an option</h3>
            <p
              style={{
                textAlign: "center",
                marginBottom: "20px",
                opacity: 0.8,
              }}
            >
              {movie?.title || movie?.name || movie?.original_name}
            </p>
            <div className="rental-options">
              <button
                className="rental-option"
                onClick={() => handlePurchase("rent")}
              >
                <div>🎬 Rent</div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {getMoviePrice(movie.id, "rent").price} $
                </div>
                <div className="rental-duration">
                  {getMoviePrice(movie.id, "rent").duration}
                </div>
              </button>
              <button
                className="rental-option"
                onClick={() => handlePurchase("rent")}
              >
                <div>🎬 Buy</div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {getMoviePrice(movie.id, "rent").price} $
                </div>
                <div className="rental-duration">
                  {getMoviePrice(movie.id, "rent").duration}
                </div>
              </button>
            </div>
            <button
              className="close-modal"
              onClick={() => setShowRentModal(false)}
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
