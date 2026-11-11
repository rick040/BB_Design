import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/spaarpot/timing.json";

// Concept 76 · "Zonde? Reken even mee." (spaarpot, mythe tegenover feit)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/spaarpot/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/spaarpot/voice-over.mp3";

/** Start frame of the n-th occurrence of a spoken word (punctuation ignored). */
export const wordAt = (word: string, nth = 1): number => {
  let seen = 0;
  for (const w of vo.words) {
    if (w.w.replace(/[.,?!]/g, "").toLowerCase() === word.toLowerCase()) {
      seen++;
      if (seen === nth) return w.start;
    }
  }
  throw new Error(`word not in voice-over: ${word}`);
};

export const spaarpotSchema = z.object({
  hook: z.object({
    headline: z.string(),
    tag: z.string(),
    tagSub: z.string(),
    subline: z.string(),
  }),
  fact: z.object({
    headline: z.string(),
    stamp: z.string(),
    // Counter rolls through these values while the coins pour out.
    counter: z.array(z.string()).min(2),
    note: z.string(),
  }),
  buddy: z.object({
    headline: z.string(),
    weekday: z.string(),
    date: z.string(),
    reminder: z.string(),
    times: z.array(z.string()).min(2),
  }),
  cta: z.object({
    price: z.string(),
    per: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  colors: z.object({
    blue: zColor(),
    light: zColor(),
    softBlue: zColor(),
    bodyOnBlue: zColor(),
    alert: zColor(),
  }),
  transitionFrames: z.number().int().min(6).max(24),
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type SpaarpotProps = z.infer<typeof spaarpotSchema>;

export const defaultSpaarpotProps: SpaarpotProps = {
  hook: {
    headline: "Weer een\nabonnement?",
    tag: "€3,49",
    tagSub: "per maand",
    subline: "Zonde van je geld.",
  },
  fact: {
    headline: "Zonde?",
    stamp: "AANMANING",
    counter: ["€0", "€5", "€10", "€15", "€20", "€25", "€30", "€35", "€40"],
    note: "Een aanmaning kan\nuitlopen op €40.",
  },
  buddy: {
    headline: "Buddy zet een\nherinnering\nin je agenda.",
    weekday: "di",
    date: "16",
    reminder: "Herinnering",
    times: ["09:00", "12:30", "19:00"],
  },
  cta: {
    price: "€3,49",
    per: "per maand",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.red,
  },
  transitionFrames: 12,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
