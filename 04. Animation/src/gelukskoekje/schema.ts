import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/gelukskoekje/timing.json";

// Concept 105 · "Geen AI. Geen gok." (gelukskoekje)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/gelukskoekje/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/gelukskoekje/voice-over.mp3";

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

export const gelukskoekjeSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    label: z.string(),
    headline: z.string(),
    aiChip: z.string(),
    // The vague "prediction" on the fortune slip, one line each.
    guess: z.array(z.string()).length(2),
  }),
  fact: z.object({
    label: z.string(),
    headline: z.string(),
    forwardedChip: z.string(),
    rules: z.array(z.object({ name: z.string(), value: z.string() })).length(4),
  }),
  outcome: z.object({
    headline: z.string(),
    // What Buddy actually read, replacing the two guess lines.
    exact: z.array(z.string()).length(2),
  }),
  cta: z.object({
    // First line white, the rest soft blue.
    tagline: z.string(),
    slip: z.string(),
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

export type GelukskoekjeProps = z.infer<typeof gelukskoekjeSchema>;

export const defaultGelukskoekjeProps: GelukskoekjeProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    label: "MYTHE",
    headline: "Een AI die je\nrekening raadt?",
    aiChip: "AI",
    guess: ["Ergens in december?", "Rond de €80?"],
  },
  fact: {
    label: "FEIT",
    headline: "Nee.\nVaste regels.",
    forwardedChip: "Doorgestuurd",
    rules: [
      { name: "Bedrag", value: "€87,60" },
      { name: "Vervaldatum", value: "do 17 dec" },
      { name: "Betaallink", value: "gevonden" },
      { name: "Kenmerk", value: "3021 4471" },
    ],
  },
  outcome: {
    headline: "Het echte bedrag.\nDe echte datum.",
    exact: ["€87,60", "Vervalt do 17 dec"],
  },
  cta: {
    tagline: "Geen AI.\nGeen gok.",
    slip: "Vaste regels.",
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
