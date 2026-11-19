import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/kralen/timing.json";

// Concept 102 · "Alles aan één draad." (kralen, USP overzicht)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/kralen/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/kralen/voice-over.mp3";

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

const bead = z.object({
  sender: z.string(),
  short: z.string(),
  amount: z.string(),
  day: z.string(),
  month: z.string(),
});

export const kralenSchema = z.object({
  // In date order: the thread and the table show them in this order.
  beads: z.array(bead).length(5),
  // Order in which they lie around loose in the hook (indices into beads).
  looseOrder: z.array(z.number().int().min(0).max(4)).length(5),
  hook: z.object({
    headline: z.string(),
    chip: z.string(),
  }),
  thread: z.object({
    headline: z.string(),
    forwarded: z.string(),
    subline: z.string(),
  }),
  sheet: z.object({
    headline: z.string(),
    fileTitle: z.string(),
    columns: z.array(z.string()).length(3),
    button: z.string(),
    formats: z.array(z.string()).length(2),
    fileChip: z.string(),
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

export type KralenProps = z.infer<typeof kralenSchema>;

export const defaultKralenProps: KralenProps = {
  beads: [
    { sender: "Zorgverzekeraar", short: "Zorg", amount: "€138,50", day: "1", month: "dec" },
    { sender: "Gemeente", short: "Gemeente", amount: "€61,20", day: "9", month: "dec" },
    { sender: "Energieleverancier", short: "Energie", amount: "€87,60", day: "17", month: "dec" },
    { sender: "Telefoonprovider", short: "Telefoon", amount: "€22,50", day: "22", month: "dec" },
    { sender: "Sportschool", short: "Sport", amount: "€29,95", day: "28", month: "dec" },
  ],
  looseOrder: [2, 4, 0, 3, 1],
  hook: {
    headline: "Wat moet je betalen,\nen wanneer?",
    chip: "Welke eerst?",
  },
  thread: {
    headline: "Buddy rijgt ze\nop datum.",
    forwarded: "Doorgestuurd",
    subline: "Al je rekeningen\nin één overzicht.",
  },
  sheet: {
    headline: "Wil je een\nspreadsheet?",
    fileTitle: "Jouw rekeningen",
    columns: ["Vervalt", "Van", "Bedrag"],
    button: "Exporteer",
    formats: ["CSV", "JSON"],
    fileChip: "rekeningen.csv",
  },
  cta: {
    tagline: "Alles aan\néén draad.",
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
