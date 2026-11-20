import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/brievenbus/timing.json";

// Concept 104 · "De rest ziet hij niet." (brievenbus)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/brievenbus/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/brievenbus/voice-over.mp3";

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

export const brievenbusSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    keyLabel: z.string(),
    mails: z.array(z.string()).length(5),
    chip: z.string(),
  }),
  split: z.object({
    headlineA: z.string(),
    headlineB: z.string(),
    leftLabel: z.string(),
    rightLabel: z.string(),
  }),
  slot: z.object({
    headline: z.string(),
    fields: z.array(z.string()).length(4),
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

export type BrievenbusProps = z.infer<typeof brievenbusSchema>;

export const defaultBrievenbusProps: BrievenbusProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Een app in je\nhele mailbox?",
    keyLabel: "Koppeling",
    mails: ["Werk", "Familie", "Bank", "Dokter", "Vrienden"],
    chip: "Alles leesbaar?",
  },
  split: {
    headlineA: "Een koppeling\nzet alles open.",
    headlineB: "Buddy hoeft\ngeen sleutel.",
    leftLabel: "Met koppeling",
    rightLabel: "Met Buddy",
  },
  slot: {
    headline: "Stuur alleen\ndie ene door.",
    fields: ["€87,60", "do 17 dec", "Betaallink", "Kenmerk"],
  },
  cta: {
    tagline: "De rest ziet\nhij niet.",
    button: "activeer buddy",
    subline: "Alleen wat jij doorstuurt.",
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
