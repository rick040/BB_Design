import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/broodrooster/timing.json";

// Concept 74 · "Jij kiest het moment." (broodrooster)
// One continuous shot of a toaster. The animation follows the voice-over:
// scene starts and beats come from public/vo/broodrooster/timing.json
// (measured from the ElevenLabs alignment). Texts and colours are editable.

export const FPS = 30;

/** Frame of the first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/broodrooster/voice-over.mp3";

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

const day = z.object({ day: z.string(), date: z.string() });

export const broodroosterSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    lateLabel: z.string(),
    stamp: z.string(),
    costChip: z.string(),
  }),
  dial: z.object({
    headline: z.string(),
    subline: z.string(),
    /** Five weekdays on the dial and in the agenda, left to right. */
    days: z.array(day).length(5),
    dueIndex: z.number().int().min(0).max(4),
    chosenIndex: z.number().int().min(0).max(4),
  }),
  agenda: z.object({
    headline: z.string(),
    month: z.string(),
    reminderLabel: z.string(),
    dueLabel: z.string(),
  }),
  cta: z.object({
    tagline: z.string(),
    button: z.string(),
  }),
  colors: z.object({
    blue: zColor(),
    light: zColor(),
    softBlue: zColor(),
    bodyOnBlue: zColor(),
    alert: zColor(),
  }),
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type BroodroosterProps = z.infer<typeof broodroosterSchema>;

export const defaultBroodroosterProps: BroodroosterProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt vr 18 dec",
  },
  hook: {
    headline: "Laat je hem liggen,\ndan brandt hij aan.",
    lateLabel: "Te laat",
    stamp: "AANMANING",
    costChip: "Kan uitlopen op €40",
  },
  dial: {
    headline: "Stuur hem door.\nJij draait de knop.",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    dueIndex: 4,
    chosenIndex: 1,
  },
  agenda: {
    headline: "Precies op tijd\nin je agenda.",
    month: "december",
    reminderLabel: "Herinnering",
    dueLabel: "Vervalt",
  },
  cta: {
    tagline: "Jij kiest\nhet moment.",
    button: "activeer buddy",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.red,
  },
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
