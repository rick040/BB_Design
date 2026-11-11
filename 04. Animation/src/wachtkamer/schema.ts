import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/wachtkamer/timing.json";

// Concept 69 · "Wie is de volgende?" (wachtkamer, USP doelgroep: zorgnota's)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/wachtkamer/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/wachtkamer/voice-over.mp3";

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

const nota = z.object({
  sender: z.string(),
  short: z.string(),
  subject: z.string(),
  amount: z.string(),
  due: z.string(),
});

export const wachtkamerSchema = z.object({
  // Three care bills waiting on their chairs (left, middle, right).
  notas: z.array(nota).length(3),
  hook: z.object({
    headline: z.string(),
    waitLabel: z.string(),
    waitValues: z.array(z.string()).length(3),
    lateLabel: z.string(),
    stamp: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    button: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    nowLabel: z.string(),
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(5),
    // Day column (0..4) each nota lands on.
    notaDays: z.array(z.number().int().min(0).max(4)).length(3),
    reminderIndex: z.number().int().min(0).max(4),
    reminderLabel: z.string(),
  }),
  cta: z.object({
    // First line white, the rest soft blue.
    tagline: z.string(),
    ticket: z.string(),
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

export type WachtkamerProps = z.infer<typeof wachtkamerSchema>;

export const defaultWachtkamerProps: WachtkamerProps = {
  notas: [
    { sender: "Tandarts", short: "Tandarts", subject: "Controle en foto", amount: "€84,20", due: "Vervalt di 15 dec" },
    { sender: "Fysiotherapeut", short: "Fysio", subject: "Drie behandelingen", amount: "€112,50", due: "Vervalt do 17 dec" },
    { sender: "Zorgverzekeraar", short: "Eigen risico", subject: "Eigen risico", amount: "€165,00", due: "Vervalt vr 18 dec" },
  ],
  hook: {
    headline: "Tandarts geweest?\nFysio gehad?",
    waitLabel: "WACHTTIJD",
    waitValues: ["1 WEEK", "2 WEKEN", "3 WEKEN"],
    lateLabel: "Te laat",
    stamp: "AANMANING",
    costChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur ze door\nnaar Buddy.",
    button: "Doorsturen",
  },
  agenda: {
    headline: "Elke nota op tijd\nin je agenda.",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
    nowLabel: "NU",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    notaDays: [1, 3, 4],
    reminderIndex: 0,
    reminderLabel: "Herinnering",
  },
  cta: {
    tagline: "Wie is de\nvolgende?",
    ticket: "Nr. 1",
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
