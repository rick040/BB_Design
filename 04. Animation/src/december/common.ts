import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import type { PaletteColors } from "../lib/palette";
import { decPalette } from "./theme";

export const FPS = 30;
export const REEL = { width: 1080, height: 1920 } as const; // 9:16 Reels + Stories
export const FEED = { width: 1080, height: 1350 } as const; // 4:5 feed, carrousel, static

/** Zelfde vijf kleursleutels als PaletteColors, voor in elk schema. */
export const decColorsSchema = z.object({
  blue: zColor(),
  light: zColor(),
  softBlue: zColor(),
  bodyOnBlue: zColor(),
  alert: zColor(),
});

export const defaultDecColors: PaletteColors = { ...decPalette };
