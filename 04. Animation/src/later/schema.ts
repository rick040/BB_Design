import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/later/timing.json";

// Concept 87 · "Later is gewoon een datum." (achteraf betalen, verzendetiket)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/later/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/later/voice-over.mp3";

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

export const laterSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
    sticker: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    nowLabel: z.string(),
    laterLabel: z.string(),
    delivered: z.string(),
  }),
  reminder: z.object({
    headline: z.string(),
    stamp: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    button: z.string(),
  }),
  peel: z.object({
    headline: z.string(),
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(3),
    dueIndex: z.number().int().min(0).max(2),
  }),
  cta: z.object({
    // First line white, the rest soft blue.
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

export type LaterProps = z.infer<typeof laterSchema>;

export const defaultLaterProps: LaterProps = {
  bill: {
    sender: "Webshop",
    subject: "Achteraf betalen",
    amount: "€64,95",
    due: "Vervalt do 17 dec",
    sticker: "Betaal later",
  },
  hook: {
    headline: "Nu besteld.\nLater betalen.",
    nowLabel: "Nu",
    laterLabel: "Later",
    delivered: "Bezorgd",
  },
  reminder: {
    headline: "Dan komt er\neen aanmaning.",
    stamp: "AANMANING",
    costChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur de\nbetaalmail door.",
    button: "Doorsturen",
  },
  peel: {
    headline: "Buddy maakt van\nlater een datum.",
    days: [
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    dueIndex: 1,
  },
  cta: {
    tagline: "Later is gewoon\neen datum.",
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
