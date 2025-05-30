export const PRICING_PLANS = [
  {
    id: "basic",
    name: "Базовый",
    price: 29,
    currency: "$",
    features: ["HD качество", "1 экран", "Без рекламы", "Базовая библиотека"],
  },
  {
    id: "standard",
    name: "Стандарт",
    price: 49,
    currency: "$",
    features: [
      "Full HD качество",
      "2 экрана",
      "Без рекламы",
      "Полная библиотека",
      "Скачивание",
    ],
  },
  {
    id: "premium",
    name: "Премиум",
    price: 79,
    currency: "$",
    features: [
      "4K качество",
      "4 экрана",
      "Без рекламы",
      "Премиум контент",
      "Скачивание",
      "Эксклюзивы",
    ],
  },
];

export const MOVIE_PRICES = {
  rent: { price: 99, duration: "48 hours" },
  buy: { price: 399, duration: "For ever" },
};

export const getMoviePrice = (movieId, type = "rent") => {
  return MOVIE_PRICES[type];
};

export const isPremiumContent = (movie) => {
  return movie.vote_average > 8.0 || movie.genre_ids?.includes(99);
};
