import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/doos/timing.json";

// Concept 119 · "Eén lijst. Geen doos." (schoenendoos, USP overzicht, één doorlopend shot)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/doos/timing.json. Rebuild that file with tools/vo_timing.py
// (with --alignment once the ElevenLabs take exists) and everything re-times.

export const FPS = 30;
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/doos/voice-over.mp3";

/** Start frame of the n-th spoken occurrence of a word (punctuation and case ignored). */
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

const row = z.object({ sender: z.string(), due: z.string(), amount: z.string() });

export const doosSchema = z.object({
  hook: z.object({ headline: z.string(), boxLabel: z.string(), chip: z.string() }),
  forward: z.object({ headline: z.string() }),
  overview: z.object({
    headline: z.string(),
    title: z.string(),
    count: z.string(),
    rows: z.array(row).length(6),
    exports: z.array(z.string()).length(2),
  }),
  cta: z.object({ headline: z.string(), button: z.string(), subline: z.string() }),
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

export type DoosProps = z.infer<typeof doosSchema>;

export const defaultDoosProps: DoosProps = {
  hook: {
    headline: "Rekeningen in een\nschoenendoos?",
    boxLabel: "rekeningen",
    chip: "Wat staat er nog open?",
  },
  forward: { headline: "Stuur ze door\nnaar Buddy." },
  overview: {
    headline: "Alles in\néén overzicht.",
    title: "Jouw rekeningen",
    count: "6 open",
    rows: [
      { sender: "Telefoonprovider", due: "di 8 dec", amount: "€34,50" },
      { sender: "Sportschool", due: "do 10 dec", amount: "€29,99" },
      { sender: "Zorgverzekeraar", due: "vr 11 dec", amount: "€128,95" },
      { sender: "Energieleverancier", due: "do 17 dec", amount: "€87,60" },
      { sender: "Gemeente", due: "ma 21 dec", amount: "€62,40" },
      { sender: "Webshop", due: "do 31 dec", amount: "€44,95" },
    ],
    exports: ["CSV", "JSON"],
  },
  cta: {
    headline: "Eén lijst.\nGeen doos.",
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
  // No take exists yet (ElevenLabs quota). Set to true once
  // public/vo/doos/voice-over.mp3 is there.
  withVoice: false,
  voiceVolume: 1,
  showSafeZones: false,
};
