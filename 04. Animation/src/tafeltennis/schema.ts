import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/tafeltennis/timing.json";

// Concept 80 · "Alleen wat jij toespeelt." (tafeltennis)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/tafeltennis/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/tafeltennis/voice-over.mp3";

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

export const tafeltennisSchema = z.object({
  mailbox: z.object({
    title: z.string(),
    senders: z.array(z.string()).length(4),
    /** Row that becomes the bill in scene 3. */
    billIndex: z.number().int().min(0).max(3),
    ownChip: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({ headline: z.string() }),
  nee: z.object({ headline: z.string() }),
  serve: z.object({
    headline: z.string(),
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
  transitionFrames: z.number().int().min(6).max(24),
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type TafeltennisProps = z.infer<typeof tafeltennisSchema>;

export const defaultTafeltennisProps: TafeltennisProps = {
  mailbox: {
    title: "Je mailbox",
    senders: ["Sportschool", "Webshop", "Bank", "Energieleverancier"],
    billIndex: 3,
    ownChip: "Van jou",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: { headline: "Kijkt Buddy mee\nin je mailbox?" },
  nee: { headline: "Nee. Je mailbox\nblijft van jou." },
  serve: {
    headline: "Jij kiest wat\nje toespeelt.",
    subline: "Buddy zet hem in je agenda.",
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
    tagline: "Alleen wat\njij toespeelt.",
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
