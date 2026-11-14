import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/prikbord/timing.json";

// Concept 86 · "Geen draadjes. Gewoon één lijst." (prikbord)
// USP overzicht, vorm mythe tegenover feit. The animation follows the
// voice-over: scene starts and beats come from public/vo/prikbord/timing.json
// (measured from the ElevenLabs alignment). Texts and colours are editable.

export const FPS = 30;

/** Marker starts (frames): S1 hook, S2 "Hoeft niet.", S3 list, S4 sheet, S5 CTA. */
export const MARKERS = vo.sceneStarts as [number, number, number, number, number];
/** Visual scenes: board (S1+S2), list (S3), sheet (S4), CTA (S5). */
export const SCENE_STARTS = [MARKERS[0], MARKERS[2], MARKERS[3], MARKERS[4]] as const;
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/prikbord/voice-over.mp3";

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

const billSchema = z.object({
  sender: z.string(),
  amount: z.string(),
  due: z.string(),
  /** Position in the list once sorted on due date (0 = first). */
  sortIndex: z.number().int().min(0).max(4),
});

export const prikbordSchema = z.object({
  bills: z.array(billSchema).length(5),
  board: z.object({
    headline: z.string(),
    mythTag: z.string(),
    factHeadline: z.string(),
    factTag: z.string(),
    unknownDue: z.string(),
  }),
  list: z.object({
    headlineSend: z.string(),
    headlineList: z.string(),
    title: z.string(),
  }),
  sheet: z.object({
    headline: z.string(),
    fileName: z.string(),
    columns: z.array(z.string()).length(3),
    formats: z.array(z.string()).length(2),
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

export type PrikbordProps = z.infer<typeof prikbordSchema>;
export type Bill = PrikbordProps["bills"][number];

export const defaultPrikbordProps: PrikbordProps = {
  // Arrival order on the board; sortIndex gives the order on due date.
  bills: [
    { sender: "Energieleverancier", amount: "€87,60", due: "17 dec", sortIndex: 3 },
    { sender: "Zorgverzekeraar", amount: "€128,95", due: "1 dec", sortIndex: 0 },
    { sender: "Gemeente", amount: "€41,20", due: "28 dec", sortIndex: 4 },
    { sender: "Telefoonprovider", amount: "€24,50", due: "5 dec", sortIndex: 1 },
    { sender: "Sportschool", amount: "€29,99", due: "9 dec", sortIndex: 2 },
  ],
  board: {
    headline: "Overzicht houden?\nAlles zelf bijhouden.",
    mythTag: "MYTHE",
    factHeadline: "Hoeft niet.",
    factTag: "FEIT",
    unknownDue: "vervalt ?",
  },
  list: {
    headlineSend: "Stuur ze door.",
    headlineList: "Eén lijst.\nOp vervaldatum.",
    title: "Mijn rekeningen",
  },
  sheet: {
    headline: "Liever in je\neigen sheet?",
    fileName: "overzicht.csv",
    columns: ["vervaldatum", "afzender", "bedrag"],
    formats: ["CSV", "JSON"],
  },
  cta: {
    tagline: "Geen draadjes.\nGewoon één lijst.",
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
