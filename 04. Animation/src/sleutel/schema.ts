import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/sleutel/timing.json";

// Concept 72 · "Geen sleutel nodig." (sleutel)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/sleutel/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/sleutel/voice-over.mp3";

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

export const sleutelSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    mailboxLabel: z.string(),
  }),
  nee: z.object({
    // Words land on the spoken words "Nee, die houd je zelf".
    headline: z.string(),
    subline: z.string(),
    mailboxLabel: z.string(),
    bankLabel: z.string(),
  }),
  slot: z.object({
    // Words land on "Je stuurt alleen die ene rekening door".
    headline: z.string(),
    slotLabel: z.string(),
    fields: z.array(z.string()).length(4),
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

export type SleutelProps = z.infer<typeof sleutelSchema>;

export const defaultSleutelProps: SleutelProps = {
  bill: {
    sender: "Telefoonprovider",
    subject: "Je factuur van november",
    amount: "€34,50",
    due: "Vervalt vr 18 dec",
  },
  hook: {
    headline: "Krijgt Buddy\nde sleutel van\nje mailbox?",
    mailboxLabel: "Mailbox",
  },
  nee: {
    headline: "Nee. Die houd\nje zelf.",
    subline: "En je bank blijft dicht.",
    mailboxLabel: "Mailbox",
    bankLabel: "Bank",
  },
  slot: {
    headline: "Je stuurt alleen\ndie ene rekening door.",
    slotLabel: "Doorstuuradres",
    fields: ["Bedrag", "Vervaldatum", "Betaallink", "Kenmerk"],
    subline: "Buddy ziet alleen\nwat jij doorstuurt.",
  },
  cta: {
    tagline: "Geen sleutel.\nAlleen wat jij stuurt.",
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

/** Start frames of the first `n` spoken words at or after `frame`. */
export const wordStartsFrom = (frame: number, n: number): number[] =>
  vo.words.filter((w) => w.start >= frame).slice(0, n).map((w) => w.start);
