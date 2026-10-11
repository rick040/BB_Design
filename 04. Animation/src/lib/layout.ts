import { useVideoConfig } from "remotion";

// Scenes are designed on a 1080 × 900 "stage" (the visual between headline
// and subline). This hook places that stage per format so the same scenes
// work for 9:16 Reels/Stories and 4:5 feed.
export const STAGE_W = 1080;
export const STAGE_H = 900;

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const tall = height / width > 1.5;

  // Instagram covers ~14% top (profile) and ~17-20% bottom (CTA/caption)
  // of a 9:16 ad. Feed (4:5) only needs a comfortable margin.
  const safeTop = tall ? 250 : 80;
  const safeBottom = tall ? 330 : 80;

  const headlineSize = tall ? 104 : 84;
  const sublineSize = tall ? 46 : 38;
  const stageScale = tall ? 1 : 0.78;

  // Room between a 2-line headline and a 2-line subline.
  const headlineBottom = safeTop + headlineSize * 2.05;
  const sublineTop = height - safeBottom - sublineSize * 2.7;
  const stageCenterY = (headlineBottom + sublineTop) / 2;

  return {
    width,
    height,
    tall,
    safeTop,
    safeBottom,
    headlineSize,
    sublineSize,
    stageScale,
    stageCenterY,
    sidePadding: tall ? 70 : 64,
  };
};
