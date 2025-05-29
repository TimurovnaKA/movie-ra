import { useState, createContext, useContext } from "react";

const FeatureFlagsContext = createContext();

export const FEATURE_FLAGS = {
  SHOW_PRICING: "show_pricing",
  ENHANCED_BANNER: "enhanced_banner",
  PREMIUM_CONTENT: "premium_content",
  TRAILER_AUTOPLAY: "trailer_autoplay",
  DARK_MODE: "dark_mode",
  USER_RECOMMENDATIONS: "user_recommendations",
};

export const FeatureFlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState({
    [FEATURE_FLAGS.SHOW_PRICING]: true,
    [FEATURE_FLAGS.ENHANCED_BANNER]: false,
    [FEATURE_FLAGS.PREMIUM_CONTENT]: true,
    [FEATURE_FLAGS.TRAILER_AUTOPLAY]: false,
    [FEATURE_FLAGS.DARK_MODE]: true,
    [FEATURE_FLAGS.USER_RECOMMENDATIONS]: false,
  });

  const toggleFlag = (flagName) => {
    setFlags((prev) => ({
      ...prev,
      [flagName]: !prev[flagName],
    }));
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, toggleFlag }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlag = (flagName) => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error("useFeatureFlag must be used within FeatureFlagsProvider");
  }
  return context.flags[flagName] || false;
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagsProvider");
  }
  return context;
};
