import React from "react";
import { AbsoluteFill } from "remotion";
import { useLayout } from "../lib/layout";

// Studio-only guide: shaded areas get covered by Instagram's UI.
export const SafeZones: React.FC = () => {
  const L = useLayout();
  const band: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    background: "rgba(255, 0, 90, 0.22)",
    borderColor: "rgba(255, 0, 90, 0.9)",
    borderStyle: "dashed",
    borderWidth: 0,
    color: "#fff",
    font: "600 26px Geist, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...band, top: 0, height: L.safeTop, borderBottomWidth: 3 }}>
        {L.tall ? "Instagram: profile / close" : "margin"}
      </div>
      <div style={{ ...band, bottom: 0, height: L.safeBottom, borderTopWidth: 3 }}>
        {L.tall ? "Instagram: caption / CTA button" : "margin"}
      </div>
    </AbsoluteFill>
  );
};
