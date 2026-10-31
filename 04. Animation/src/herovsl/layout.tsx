import React from "react";
import { useVideoConfig } from "remotion";

// Layout for the hero VSL. Both formats use the same centred column, so the
// eye never has to jump left and right:
//   headline on top · one object in the middle · Buddy below
//  · wide = 16:9 desktop hero (1920 × 1080)
//  · tall = 4:5 mobile hero (1080 × 1350)
// The object and Buddy are drawn on a fixed 1000 × 760 stage that is centred
// and scaled per format.
export const STAGE_W = 1000;
export const STAGE_H = 760;

export const useHeroLayout = () => {
  const { width, height } = useVideoConfig();
  const wide = width / height > 1.2;
  const scale = wide ? 0.98 : 1.04;
  return {
    width,
    height,
    wide,
    headTop: wide ? 112 : 190,
    headSize: wide ? 100 : 76,
    badge: wide ? 84 : 66,
    stage: {
      left: (width - STAGE_W * scale) / 2,
      top: wide ? 262 : 384,
      scale,
    },
  };
};

/** The 1000 × 760 stage, centred per format. */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const L = useHeroLayout();
  return (
    <div
      style={{
        position: "absolute",
        left: L.stage.left,
        top: L.stage.top,
        width: STAGE_W,
        height: STAGE_H,
        transform: `scale(${L.stage.scale})`,
        transformOrigin: "0 0",
      }}
    >
      {children}
    </div>
  );
};
