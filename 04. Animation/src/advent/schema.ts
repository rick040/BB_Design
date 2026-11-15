import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/advent/timing.json";

// Concept 90 · "Geen verrassingen. Gewoon je agenda." (adventskalender)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/advent/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/advent/voice-over.mp3";

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

export const adventSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    /** Numbers on the twelve calendar doors (left to right, top to bottom). */
    doors: z.array(z.string()).length(12),
    /** Door that hides the nice surprise (index into doors). */
    niceIndex: z.number().int().min(0).max(11),
    /** Door that hides the reminder letter (index into doors). */
    badIndex: z.number().int().min(0).max(11),
    lateLabel: z.string(),
    stamp: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    button: z.string(),
  }),
  pick: z.object({
    headline: z.string(),
    subline: z.string(),
    month: z.string(),
    days: z.array(day).length(5),
    dueIndex: z.number().int().min(0).max(4),
    reminderIndex: z.number().int().min(0).max(4),
    reminderText: z.string(),
    reminderTime: z.string(),
  }),
  cta: z.object({
    // First line white, the rest soft blue.
    tagline: z.string(),
    doorNumber: z.string(),
    button: z.string(),
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

export type AdventProps = z.infer<typeof adventSchema>;

export const defaultAdventProps: AdventProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Verrassing achter\nelk deurtje?",
    doors: ["3", "11", "7", "20", "14", "1", "17", "9", "22", "5", "12", "24"],
    niceIndex: 0,
    badIndex: 6,
    lateLabel: "Te laat",
    stamp: "AANMANING",
    costChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door\nnaar Buddy.",
    button: "Doorsturen",
  },
  pick: {
    headline: "En jij kiest\nwanneer.",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
    month: "december",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    dueIndex: 3,
    reminderIndex: 0,
    reminderText: "Energieleverancier €87,60 · vervalt do 17",
    reminderTime: "ma 14",
  },
  cta: {
    tagline: "Geen verrassingen.\nGewoon je agenda.",
    doorNumber: "24",
    button: "activeer buddy",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    // No red in the ads (Meta strategy, Gate 1): warnings in near-black.
    alert: "#111827",
  },
  transitionFrames: 12,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
