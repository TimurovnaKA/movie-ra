import "./App.css";
import Row from "./components/Row/Row";
import Banner from "./components/Banner/Banner";
import Navbar from "./components/Navbar/Navbar";
import requests from "./request";
import {
  FeatureFlagsProvider,
  useFeatureFlag,
  FEATURE_FLAGS,
} from "./hooks/useFeatureFlags";
import FeatureFlagDebugPanel from "./components/FeatureFlagDebugPanel";

function AppContent() {
  const showPremiumContent = useFeatureFlag(FEATURE_FLAGS.PREMIUM_CONTENT);
  const darkMode = useFeatureFlag(FEATURE_FLAGS.DARK_MODE);

  return (
    <div className={`App ${darkMode ? "dark-theme" : "light-theme"}`}>
      <Navbar />
      <Banner />
      <Row
        title={"NETFLIX ORIGINALS"}
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
      />
      <Row title={"Trending Now"} fetchUrl={requests.fetchTrending} />
      <Row title={"History Movies"} fetchUrl={requests.fetchHistoryMovies} />
      <Row
        title={"Animation Movies"}
        fetchUrl={requests.fetchAnimationMovies}
      />
      <Row title={"Fantasy Movies"} fetchUrl={requests.fetchFantasyMovies} />
      <Row title={"Romance Movies"} fetchUrl={requests.fetchRomanceMovies} />

      {/* Показываем премиум контент только если флаг включен */}
      {showPremiumContent && (
        <Row
          title={"Premium Content"}
          fetchUrl={requests.fetchTopRated}
          isPremium={true}
        />
      )}
      {process.env.NODE_ENV === "development" && <FeatureFlagDebugPanel />}
    </div>
  );
}

function App() {
  return (
    <FeatureFlagsProvider>
      <AppContent />
    </FeatureFlagsProvider>
  );
}

export default App;
