export const PRICING_PLANS = [
  {
    id: "basic",
    name: "Базовый",
    price: 299,
    currency: "сом",
    features: ["HD качество", "1 экран", "Без рекламы", "Базовая библиотека"],
  },
  {
    id: "standard",
    name: "Стандарт",
    price: 499,
    currency: "сом",
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
    price: 699,
    currency: "сом",
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
  rent: { price: 99, duration: "48 часов" },
  buy: { price: 399, duration: "навсегда" },
};

export const getMoviePrice = (movieId, type = "rent") => {
  // В реальном приложении здесь был бы API запрос
  return MOVIE_PRICES[type];
};

export const isPremiumContent = (movie) => {
  // Логика определения премиум контента
  return movie.vote_average > 8.0 || movie.genre_ids?.includes(99); // 99 - документальные
};
