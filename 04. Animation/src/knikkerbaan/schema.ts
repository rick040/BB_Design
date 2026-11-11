import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/knikkerbaan/timing.json";

// Concept 73 · "Geen gok. Elke keer dezelfde baan." (knikkerbaan)
// One continuous shot: the camera follows a bill down a marble run with fixed
// gates. Scene starts and beats come from public/vo/knikkerbaan/timing.json
// (measured from the ElevenLabs alignment), so the picture follows the voice.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/knikkerbaan/voice-over.mp3";

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

const zBill = z.object({
  sender: z.string(),
  initial: z.string(),
  amount: z.string(),
  due: z.string(),
});

export const knikkerbaanSchema = z.object({
  bills: z.tuple([zBill, zBill]),
  hook: z.object({
    headline: z.string(),
    dieLabel: z.string(),
    nee: z.string(),
  }),
  run: z.object({
    headline: z.string(),
    rule1: z.string(),
    rule2: z.string(),
  }),
  again: z.object({
    headline: z.string(),
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
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type KnikkerbaanProps = z.infer<typeof knikkerbaanSchema>;

export const defaultKnikkerbaanProps: KnikkerbaanProps = {
  bills: [
    { sender: "Energieleverancier", initial: "E", amount: "€87,60", due: "do 17 dec" },
    { sender: "Zorgverzekeraar", initial: "Z", amount: "€134,20", due: "ma 21 dec" },
  ],
  hook: {
    headline: "Gokt er een AI met\njouw rekening?",
    dieLabel: "AI",
    nee: "Nee.",
  },
  run: {
    headline: "Buddy legt hem\nop een vaste baan.",
    rule1: "regel 1: bedrag",
    rule2: "regel 2: vervaldatum",
  },
  again: {
    headline: "Elke rekening\nprecies hetzelfde.",
  },
  cta: {
    tagline: "Geen gok.\nElke keer dezelfde baan.",
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
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
