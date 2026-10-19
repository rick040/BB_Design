import { useVideoConfig } from "remotion";

// Phone screens are drawn in logical px on a 340 × 736 screen and scaled per format.
export const SCREEN_W = 340;
export const SCREEN_H = 736;
export const STATUS_H = 44;
export const BEZEL = 12;
export const PHONE_W = SCREEN_W + BEZEL * 2;
export const PHONE_H = SCREEN_H + BEZEL * 2;

// Two formats from the same scenes:
// - wide (16:9, 1920 × 1080): instructions left, phone right;
// - tall (9:16, 1080 × 1920): instructions on top, phone below.
export const useWalkLayout = () => {
  const { width, height } = useVideoConfig();
  const tall = height > width;

  const phoneH = tall ? 1090 : 990;
  const phoneScale = phoneH / PHONE_H;

  return {
    width,
    height,
    tall,
    col: tall ? { left: 72, top: 92, width: width - 144 } : { left: 150, top: 132, width: 790 },
    phone: tall
      ? { cx: width / 2, cy: height - 36 - phoneH / 2, scale: phoneScale }
      : { cx: 1430, cy: height / 2, scale: phoneScale },
    text: tall
      ? { eyebrow: 25, title: 58, item: 30, note: 26, num: 46 }
      : { eyebrow: 24, title: 70, item: 31, note: 27, num: 46 },
  };
};
