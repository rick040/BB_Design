import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/wachtkamer/timing.json";

// Concept 70 · "Elke nota op zijn beurt." (wachtkamer)
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
  subject: z.string(),
  amount: z.string(),
  due: z.string(),
});

export const wachtkamerSchema = z.object({
  notas: z.array(nota).length(3),
  hook: z.object({
    headline: z.string(),
    boardLabel: z.string(),
    unknownDue: z.string(),
    chip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  call: z.object({
    headline: z.string(),
    boardLabel: z.string(),
    /** Which nota is called (0..2). */
    calledIndex: z.number().int().min(0).max(2),
    agendaDay: z.string(),
    agendaMonth: z.string(),
    agendaTitle: z.string(),
    agendaNote: z.string(),
    subline: z.string(),
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

export type WachtkamerProps = z.infer<typeof wachtkamerSchema>;

export const defaultWachtkamerProps: WachtkamerProps = {
  notas: [
    { sender: "Tandarts", subject: "Controle en foto", amount: "€84,50", due: "di 22 dec" },
    { sender: "Fysio", subject: "Drie behandelingen", amount: "€37,00", due: "vr 18 dec" },
    { sender: "Zorgverzekeraar", subject: "Eigen risico", amount: "€385,00", due: "ma 28 dec" },
  ],
  hook: {
    headline: "Komen je zorgnota's\nook altijd tegelijk?",
    boardLabel: "Nu aan de beurt",
    unknownDue: "Vervalt ?",
    chip: "Drie nota's, drie datums",
  },
  forward: {
    headline: "Stuur ze door\nnaar Buddy.",
    button: "Doorsturen",
    subline: "Buddy leest het bedrag\nen de vervaldatum.",
  },
  call: {
    headline: "Je bent op tijd\naan de beurt.",
    boardLabel: "Nu aan de beurt",
    calledIndex: 1,
    agendaDay: "do 17",
    agendaMonth: "dec",
    agendaTitle: "Fysio €37,00 betalen",
    agendaNote: "Vervalt vr 18 dec",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
  },
  cta: {
    tagline: "Elke nota\nop zijn beurt.",
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
