import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/weekdoos/timing.json";

// Concept 95 · "Elke nota op zijn dag." (weekdoos)
// USP doelgroep (zorgnota's), vorm mythe tegenover feit.
// The animation follows the voice-over: scene starts and beats come from
// public/vo/weekdoos/timing.json (measured from the ElevenLabs alignment).

export const FPS = 30;

export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/weekdoos/voice-over.mp3";

/** Start frame of the n-th occurrence of a spoken word (punctuation ignored). */
export const wordAt = (word: string, nth = 1): number => {
  let seen = 0;
  for (const w of vo.words) {
    if (w.w.replace(/[.,?!:]/g, "").toLowerCase() === word.toLowerCase()) {
      seen++;
      if (seen === nth) return w.start;
    }
  }
  throw new Error(`word not in voice-over: ${word}`);
};

const nota = z.object({
  sender: z.string(),
  amount: z.string(),
  due: z.string(),
  slot: z.string(),
});

export const weekdoosSchema = z.object({
  notas: z.array(nota).length(3),
  hook: z.object({ headline: z.string() }),
  fact: z.object({ headline: z.string() }),
  forward: z.object({
    headline: z.string(),
    chip: z.string(),
    agendaChip: z.string(),
    subline: z.string(),
  }),
  cta: z.object({ tagline: z.string(), button: z.string(), subline: z.string() }),
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

export type WeekdoosProps = z.infer<typeof weekdoosSchema>;

export const defaultWeekdoosProps: WeekdoosProps = {
  notas: [
    { sender: "Tandarts", amount: "€68,40", due: "do 3 dec", slot: "do 3" },
    { sender: "Fysio", amount: "€42,00", due: "ma 14 dec", slot: "ma 14" },
    { sender: "Apotheek", amount: "€12,95", due: "vr 18 dec", slot: "vr 18" },
  ],
  hook: { headline: "Mythe: zorgnota's\nonthoud je vanzelf." },
  fact: { headline: "Feit: elk een\nandere datum." },
  forward: {
    headline: "Stuur ze door\nnaar Buddy.",
    chip: "Doorgestuurd",
    agendaChip: "In je agenda",
    subline: "Elke nota op zijn eigen dag.",
  },
  cta: {
    tagline: "Elke nota\nop zijn dag.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    // No red in ads (Gate 1): the "alert" tone is dark ink.
    alert: "#111827",
  },
  transitionFrames: 12,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
