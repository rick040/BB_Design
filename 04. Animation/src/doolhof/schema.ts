import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/doolhof/timing.json";

// Concept 126 · "Geen app. Gewoon rechtdoor." (doolhof)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/doolhof/timing.json. Regenerate that file with
//   python3 scripts/vo_timing.py doolhof
// after generating the voice (vo.json or voice-over.mp3 in the same folder),
// and every beat moves to the real take. Texts and colours are props.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/doolhof/voice-over.mp3";
export const VO_ESTIMATED = vo.estimated;

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

export const doolhofSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // One chip per dead end in the maze, in the order the dot hits them.
    chips: z.array(z.string()).length(4),
  }),
  split: z.object({
    leftLabel: z.string(),
    noChip: z.string(),
    rightLabel: z.string(),
    rightWord: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    button: z.string(),
    subline: z.string(),
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(5),
    dueIndex: z.number().int().min(0).max(4),
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
  mazeSeed: z.number().int().min(1).max(9999),
  transitionFrames: z.number().int().min(6).max(24),
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type DoolhofProps = z.infer<typeof doolhofSchema>;

export const defaultDoolhofProps: DoolhofProps = {
  hook: {
    headline: "Nog een app voor\nje rekeningen?",
    chips: ["Downloaden", "Account", "Wachtwoord", "Updates"],
  },
  split: {
    leftLabel: "Nog een app",
    noChip: "Hoeft niet.",
    rightLabel: "Met Buddy",
    rightWord: "rechtdoor.",
  },
  bill: {
    sender: "Telefoonprovider",
    subject: "Je rekening van december",
    amount: "€24,95",
    due: "Vervalt do 17 dec",
  },
  agenda: {
    headline: "Stuur hem door.\nHij staat in je agenda.",
    button: "Doorsturen",
    subline: "Je mail en je agenda\nzijn genoeg.",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    dueIndex: 3,
  },
  cta: {
    tagline: "Geen app.\nGewoon rechtdoor.",
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
  mazeSeed: 23,
  transitionFrames: 12,
  // Off until public/vo/doolhof/voice-over.mp3 exists (ElevenLabs had no credits on 27 Nov 2026).
  withVoice: false,
  voiceVolume: 1,
  showSafeZones: false,
};
