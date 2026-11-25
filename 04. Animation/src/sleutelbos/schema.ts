import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/sleutelbos/timing.json";

// Concept 120 · "Houd je sleutels." (sleutelbos)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/sleutelbos/timing.json. Right now that file is an ESTIMATE
// (tools/vo_estimate.py) because no voice take could be generated; replace it
// with the timing from the ElevenLabs alignment and everything re-times itself.

export const FPS = 30;

export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/sleutelbos/voice-over.mp3";

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

export const sleutelbosSchema = z.object({
  keys: z.array(z.string()).length(4),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    lock: z.string(),
    chip: z.string(),
  }),
  refuse: z.object({
    headline: z.string(),
    mailFrom: z.string(),
    mailSubject: z.string(),
    subline: z.string(),
  }),
  read: z.object({
    headline: z.string(),
    amountLabel: z.string(),
    dateLabel: z.string(),
    date: z.string(),
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

export type SleutelbosProps = z.infer<typeof sleutelbosSchema>;

export const defaultSleutelbosProps: SleutelbosProps = {
  keys: ["Mailbox", "Werk", "Familie", "Foto's"],
  bill: {
    sender: "Zorgverzekeraar",
    subject: "Je nota van november",
    amount: "€128,95",
    due: "Vervalt vr 12 dec",
  },
  hook: {
    headline: "Je mailbox\nkoppelen?",
    lock: "Koppeling",
    chip: "Alle sleutels?",
  },
  refuse: {
    headline: "Buddy hoeft\ngeen sleutels.",
    mailFrom: "Zorgverzekeraar",
    mailSubject: "Je nota van november",
    subline: "Jij stuurt alleen\nde rekening door.",
  },
  read: {
    headline: "Hij leest bedrag\nen datum.",
    amountLabel: "Bedrag",
    dateLabel: "Datum",
    date: "vr 12 dec",
  },
  cta: {
    tagline: "Houd je\nsleutels.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    // No red in the creatives (Meta strategy, 15 Nov): dark ink instead.
    alert: "#111827",
  },
  transitionFrames: 12,
  // false until public/vo/sleutelbos/voice-over.mp3 exists (no credits on 25 Nov).
  withVoice: false,
  voiceVolume: 1,
  showSafeZones: false,
};
