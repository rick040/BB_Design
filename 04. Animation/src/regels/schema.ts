import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/regels/timing.json";

// Concept 63 · "Geen AI. Gewoon vaste regels." (mythe tegenover feit)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/regels/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/regels/voice-over.mp3";

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

export const regelsSchema = z.object({
  hook: z.object({
    headline: z.string(),
    aiChip: z.string(),
    mythTag: z.string(),
  }),
  fact: z.object({
    no: z.string(),
    headline: z.string(),
    factTag: z.string(),
  }),
  rules: z.object({
    headline: z.string(),
    subline: z.string(),
    sheetTitle: z.string(),
    lines: z.array(z.object({ label: z.string(), value: z.string() })).length(4),
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

export type RegelsProps = z.infer<typeof regelsSchema>;

export const defaultRegelsProps: RegelsProps = {
  hook: {
    headline: "Dus Buddy leest je\nrekening met AI?",
    aiChip: "AI",
    mythTag: "Mythe?",
  },
  fact: {
    no: "Nee.",
    headline: "Er gaat geen AI\nover je mail.",
    factTag: "Feit",
  },
  rules: {
    headline: "Buddy leest met\nvaste regels.",
    subline: "Alleen wat jij doorstuurt.",
    sheetTitle: "Energieleverancier",
    lines: [
      { label: "Bedrag", value: "€87,60" },
      { label: "Vervaldatum", value: "do 17 dec" },
      { label: "Betaallink", value: "gevonden" },
      { label: "Kenmerk", value: "4021 7790" },
    ],
  },
  cta: {
    tagline: "Geen AI.\nGewoon vaste regels.",
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
  transitionFrames: 14,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
