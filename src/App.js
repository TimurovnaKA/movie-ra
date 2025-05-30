import "./App.css";
import Row from "./components/Row/Row";
import Banner from "./components/Banner/Banner";
import Navbar from "./components/Navbar/Navbar";
import MyListRow from "./components/MyListRow/MyListRow";
import requests from "./request";
import {
  FeatureFlagsProvider,
  useFeatureFlag,
  FEATURE_FLAGS,
} from "./hooks/useFeatureFlags";
import { MyListProvider } from "./hooks/useMyList";

function AppContent() {
  const showPremiumContent = useFeatureFlag(FEATURE_FLAGS.PREMIUM_CONTENT);
  const darkMode = useFeatureFlag(FEATURE_FLAGS.DARK_MODE);

  return (
    <div className={`App ${darkMode ? "dark-theme" : "light-theme"}`}>
      <Navbar />
      <Banner />
      <MyListRow />
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

      {showPremiumContent && (
        <Row
          title={"Premium Content"}
          fetchUrl={requests.fetchTopRated}
          isPremium={true}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <FeatureFlagsProvider>
      <MyListProvider>
        <AppContent />
      </MyListProvider>
    </FeatureFlagsProvider>
  );
}

export default App;
