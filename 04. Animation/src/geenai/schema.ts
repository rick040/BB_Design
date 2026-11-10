import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/geenai/timing.json";

// Concept 63 · "Geen AI. Gewoon vaste regels." (sjabloon)
// USP geen-ai, verhaalvorm mythe tegenover feit.
// The animation follows the voice-over: scene starts and beats come from
// public/vo/geenai/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/geenai/voice-over.mp3";

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

export const geenAiSchema = z.object({
  invoice: z.object({
    sender: z.string(),
    title: z.string(),
    amountLabel: z.string(),
    amount: z.string(),
    dueLabel: z.string(),
    due: z.string(),
    linkLabel: z.string(),
    link: z.string(),
    refLabel: z.string(),
    ref: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    mythChip: z.string(),
    orbLabel: z.string(),
  }),
  nee: z.object({
    word: z.string(),
    factChip: z.string(),
    subline: z.string(),
  }),
  rules: z.object({
    headline: z.string(),
    // One label per hole in the stencil, in spoken order.
    ruleLabels: z.array(z.string()).length(4),
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

export type GeenAiProps = z.infer<typeof geenAiSchema>;

export const defaultGeenAiProps: GeenAiProps = {
  invoice: {
    sender: "Energieleverancier",
    title: "Je factuur van november",
    amountLabel: "Bedrag",
    amount: "€87,60",
    dueLabel: "Vervaldatum",
    due: "do 17 dec",
    linkLabel: "Betaallink",
    link: "Betaal nu",
    refLabel: "Kenmerk",
    ref: "2026 1187 44",
  },
  hook: {
    headline: "Leest er een AI\nmee met je rekeningen?",
    mythChip: "Mythe?",
    orbLabel: "AI",
  },
  nee: {
    word: "Nee.",
    factChip: "Feit",
    subline: "Buddy gebruikt geen AI.",
  },
  rules: {
    headline: "Gewoon\nvaste regels.",
    ruleLabels: ["bedrag", "vervaldatum", "betaallink", "kenmerk"],
  },
  cta: {
    tagline: "Geen AI.\nVaste regels.",
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
