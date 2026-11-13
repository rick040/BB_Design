import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/ballon/timing.json";

// Concept 84 · "Laat hem niet opblazen." (ballon)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/ballon/timing.json (measured from the ElevenLabs alignment).
// [S1] and [S2] share one continuous light scene (the balloon keeps
// inflating); [S3] and [S4] are their own scenes.

export const FPS = 30;

/** Marker starts (frames) = first spoken word of [S1]..[S4]. */
export const MARKERS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/ballon/voice-over.mp3";

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

export const ballonSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    question: z.string(),
    inflate: z.string(),
    lateLabel: z.string(),
    stamp: z.string(),
    balloonLabel: z.string(),
    costChip: z.string(),
  }),
  price: z.object({
    // First line is the price, second line the period.
    headline: z.string(),
    subline: z.string(),
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(5),
    dueIndex: z.number().int().min(0).max(4),
    reminderIndex: z.number().int().min(0).max(4),
    reminderLabel: z.string(),
  }),
  cta: z.object({
    tagline: z.string(),
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

export type BallonProps = z.infer<typeof ballonSchema>;

export const defaultBallonProps: BallonProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    question: "Wat kost een\nvergeten rekening?",
    inflate: "Hij blaast\nzich op.",
    lateLabel: "Te laat",
    stamp: "AANMANING",
    balloonLabel: "€40",
    costChip: "Kan uitlopen op €40",
  },
  price: {
    headline: "€3,49\nper maand.",
    subline: "Herinnering in je agenda,\nwanneer jij kiest.",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    dueIndex: 3,
    reminderIndex: 1,
    reminderLabel: "Herinnering",
  },
  cta: {
    tagline: "Laat hem niet\nopblazen.",
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
