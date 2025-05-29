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

  const showPricing = useFeatureFlag(FEATURE_FLAGS.SHOW_PRICING);
  const enhancedBanner = useFeatureFlag(FEATURE_FLAGS.ENHANCED_BANNER);
  const autoplayTrailer = useFeatureFlag(FEATURE_FLAGS.TRAILER_AUTOPLAY);

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
    width: "740",
    playerVars: {
      autoplay: 1,
    },
  };

  const handlePlayClick = () => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || movie?.title || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((err) => {
          console.log(err);
          alert("Трейлер не найден для данного фильма");
        });
    }
  };

  const handleRentClick = () => {
    setShowRentModal(true);
  };

  const handlePurchase = (type) => {
    const price = getMoviePrice(movie.id, type);
    alert(
      `Purchasing ${movie?.title || movie?.name} for ${price.price} сом (${
        price.duration
      })`
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
              className="banner__button banner__button--play"
              onClick={handlePlayClick}
            >
              {trailerUrl ? "Close Trailer" : "▶ Play"}
            </button>
            <button
              className={`banner__button ${
                isInMyList(movie.id) ? "banner__button--in-list" : ""
              }`}
              onClick={handleMyListClick}
            >
              {isInMyList(movie.id) ? "✓ In My List" : "+ My List"}
            </button>

            {/* Показываем кнопки покупки/аренды если флаг включен */}
            {showPricing && (
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
          <h1 className="banner__description">{movie?.overview}</h1>

          {enhancedBanner && (
            <div className="banner__metadata">
              <span className="banner__rating">
                ★ {movie?.vote_average?.toFixed(1)}
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

      {/* YouTube Trailer */}
      {trailerUrl && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <YouTube videoId={trailerUrl} opts={opts} className="youtube" />
        </div>
      )}

      {/* Rent Modal */}
      {showRentModal && (
        <div className="modal-overlay" onClick={() => setShowRentModal(false)}>
          <div className="rental-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Choose Rental Option</h3>
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
            <button
              className="close-modal"
              onClick={() => setShowRentModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
