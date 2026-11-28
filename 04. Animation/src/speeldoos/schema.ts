import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/speeldoos/timing.json";

// Concept 129 · "Geen AI. Gewoon vaste regels." (speeldoos)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/speeldoos/timing.json. Until a real ElevenLabs take exists that
// file is an estimate; regenerate it with
//   python3 scripts/vo_to_timing.py speeldoos --from-alignment
// and every beat below moves with the voice automatically.

export const FPS = 30;

export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/speeldoos/voice-over.mp3";

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

export const speeldoosSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    badge: z.string(),
    mythLabel: z.string(),
    guesses: z.array(z.string()).length(3),
  }),
  nee: z.object({
    headline: z.string(),
    factLabel: z.string(),
  }),
  rules: z.object({
    headline: z.string(),
    fields: z.array(z.object({ label: z.string(), value: z.string() })).length(4),
    subline: z.string(),
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

export type SpeeldoosProps = z.infer<typeof speeldoosSchema>;

export const defaultSpeeldoosProps: SpeeldoosProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Gaat er AI over\nje rekening?",
    badge: "AI",
    mythLabel: "MYTHE",
    guesses: ["± €80?", "ergens in dec?", "link…?"],
  },
  nee: {
    headline: "Nee. Buddy werkt\nals een speeldoos.",
    factLabel: "FEIT",
  },
  rules: {
    headline: "Vaste regels.\nElke keer hetzelfde.",
    fields: [
      { label: "Bedrag", value: "€87,60" },
      { label: "Vervaldatum", value: "do 17 dec" },
      { label: "Betaallink", value: "gevonden" },
      { label: "Kenmerk", value: "4021 8837" },
    ],
    subline: "Zelfde mail? Zelfde uitkomst.",
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
  transitionFrames: 12,
  withVoice: false,
  voiceVolume: 1,
  showSafeZones: false,
};
