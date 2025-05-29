import React from "react";
import { useFeatureFlags, FEATURE_FLAGS } from "../hooks/useFeatureFlags";

const FeatureFlagDebugPanel = () => {
  const { flags, toggleFlag } = useFeatureFlags();

  const debugPanelStyle = {
    position: "fixed",
    top: "80px",
    right: "20px",
    background: "rgba(0, 0, 0, 0.9)",
    color: "white",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "15px",
    zIndex: 1000,
    fontSize: "12px",
    minWidth: "200px",
    maxHeight: "400px",
    overflowY: "auto",
  };

  const flagItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "8px 0",
    padding: "5px",
    borderRadius: "4px",
    background: "rgba(255, 255, 255, 0.1)",
  };

  const switchStyle = {
    position: "relative",
    width: "40px",
    height: "20px",
    backgroundColor: "#ccc",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const switchActiveStyle = {
    ...switchStyle,
    backgroundColor: "#e50914",
  };

  const switchKnobStyle = {
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "16px",
    height: "16px",
    backgroundColor: "white",
    borderRadius: "50%",
    transition: "transform 0.3s",
  };

  const switchKnobActiveStyle = {
    ...switchKnobStyle,
    transform: "translateX(20px)",
  };

  return (
    <div style={debugPanelStyle}>
      <h4
        style={{
          margin: "0 0 15px 0",
          textAlign: "center",
          borderBottom: "1px solid #333",
          paddingBottom: "10px",
        }}
      >
        Feature Flags Debug
      </h4>

      {Object.entries(FEATURE_FLAGS).map(([key, flagName]) => (
        <div key={flagName} style={flagItemStyle}>
          <span style={{ fontSize: "11px", flex: 1 }}>
            {key.replace(/_/g, " ")}
          </span>
          <div
            style={flags[flagName] ? switchActiveStyle : switchStyle}
            onClick={() => toggleFlag(flagName)}
          >
            <div
              style={flags[flagName] ? switchKnobActiveStyle : switchKnobStyle}
            />
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: "15px",
          fontSize: "10px",
          color: "#888",
          textAlign: "center",
        }}
      >
        Click switches to toggle features
      </div>
    </div>
  );
};

export default FeatureFlagDebugPanel;
