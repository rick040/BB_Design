import { createContext, createElement, type ReactNode, useContext } from "react";
import { useVideoConfig } from "remotion";

// Scenes are designed on a 1080 × 900 "stage" (the visual between headline
// and subline). This hook places that stage per format so the same scenes
// work for 9:16 Reels/Stories and 4:5 feed.
export const STAGE_W = 1080;
export const STAGE_H = 900;

// Opt-in "paid Reels" safe zone. In a Reels ad Meta lays the CTA button and
// the ad text over the bottom of the 9:16 frame, so headlines, amounts and the
// CTA pill must stay between y≈270 and y≈1250. Concepts that want this wrap
// their scenes in <AdSafeZoneProvider enabled>. Without the provider nothing
// changes (default false), so older concepts render exactly as before.
const AdSafeZoneContext = createContext(false);

export const AdSafeZoneProvider = ({ enabled, children }: { enabled: boolean; children: ReactNode }) =>
  createElement(AdSafeZoneContext.Provider, { value: enabled }, children);

/** Top/bottom of the paid-Reels safe area (9:16 only). */
export const AD_SAFE = { top: 280, bottom: 670 } as const;

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const tall = height / width > 1.5;
  const adCtx = useContext(AdSafeZoneContext);
  const ad = tall && adCtx;

  // Instagram covers ~14% top (profile) and ~17-20% bottom (CTA/caption)
  // of a 9:16 ad. Feed (4:5) only needs a comfortable margin.
  const safeTop = ad ? AD_SAFE.top : tall ? 250 : 80;
  const safeBottom = ad ? AD_SAFE.bottom : tall ? 330 : 80;

  const headlineSize = ad ? 96 : tall ? 104 : 84;
  const sublineSize = ad ? 44 : tall ? 46 : 38;
  const stageScale = ad ? 0.86 : tall ? 1 : 0.78;

  // Room between a 2-line headline and a 2-line subline.
  const headlineBottom = safeTop + headlineSize * 2.05;
  const sublineTop = height - safeBottom - sublineSize * 2.7;
  // Paid Reels: centre the stage in the space between headline and the
  // bottom safe line; scenes with a subline keep their stage content above
  // stage y≈830.
  const stageCenterY = ad ? (headlineBottom + (height - safeBottom)) / 2 : (headlineBottom + sublineTop) / 2;

  return {
    width,
    height,
    tall,
    adSafeZone: ad,
    safeTop,
    safeBottom,
    headlineSize,
    sublineSize,
    stageScale,
    stageCenterY,
    sidePadding: tall ? 70 : 64,
  };
};
