import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Shared building blocks for the backlog templates (see BACKLOG.md).
// Every template schema = its own fields + these base fields, so each video in
// the backlog is just a set of props on one of eight templates.

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

export const colorsSchema = z.object({
  blue: zColor(),
  light: zColor(),
  softBlue: zColor(),
  bodyOnBlue: zColor(),
  alert: zColor(),
});

export const defaultColors: z.infer<typeof colorsSchema> = {
  blue: brand.blue,
  light: brand.light,
  softBlue: brand.blueSoft,
  bodyOnBlue: brand.blueText,
  alert: brand.red,
};

/** Background of a scene: light (#FAFBFF) or brand blue. */
export const bgSchema = z.enum(["light", "blue"]);
export type Bg = z.infer<typeof bgSchema>;

/** The brand end card every video closes on (brand visible ≥ 2 s before the end). */
export const endCardSchema = z.object({
  /** Small line above the button, e.g. the CTA ("Bewaar deze voor later"). Empty = none. */
  line: z.string(),
  /** Text in the white pill button. */
  button: z.string(),
  /** Small print under the wordmark. Empty = none. */
  small: z.string(),
  bg: bgSchema,
  seconds: z.number().min(2.2).max(4),
});
export type EndCardProps = z.infer<typeof endCardSchema>;

export const baseSchema = z.object({
  colors: colorsSchema,
  endCard: endCardSchema,
  /** Length of every transition in seconds. */
  transition: z.number().min(0.2).max(0.8),
  /** Optional: an mp3 in public/, e.g. "music.mp3". */
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  /** Instagram UI guides. Keep off for the export. */
  showSafeZones: z.boolean(),
});
export type BaseProps = z.infer<typeof baseSchema>;

export const baseDefaults = (endCard: Partial<EndCardProps> = {}): BaseProps => ({
  colors: defaultColors,
  endCard: {
    line: "",
    button: "activeer buddy",
    small: "Geen app. Geen bankkoppeling.",
    bg: "blue",
    seconds: 2.6,
    ...endCard,
  },
  transition: 0.4,
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
});

/** Total frames of a TransitionSeries: scene frames minus the overlaps. */
export const seriesTotal = (sceneFrames: number[], transitionSec: number) =>
  sceneFrames.reduce((a, b) => a + b, 0) - (sceneFrames.length - 1) * sec(transitionSec);

/** Start frame of every scene in a TransitionSeries. */
export const seriesStarts = (sceneFrames: number[], transitionSec: number) => {
  const t = sec(transitionSec);
  const starts: number[] = [];
  let at = 0;
  for (const f of sceneFrames) {
    starts.push(at);
    at += f - t;
  }
  return starts;
};
