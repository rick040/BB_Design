import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/metronoom/timing.json";

// Concept 89 · "Geen AI. Gewoon op de maat." (metronoom)
// One continuous shot, no scene cuts. Every beat sits on a spoken word from
// public/vo/metronoom/timing.json (measured from the ElevenLabs alignment).
// All texts and colours are editable in Remotion Studio.

export const FPS = 30;
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/metronoom/voice-over.mp3";
export const WORDS = vo.words;

const norm = (w: string) => w.replace(/[.,?!]/g, "").toLowerCase();
/** Start frame of the n-th occurrence of a spoken word (punctuation ignored). */
export const wordAt = (word: string, nth = 1): number => {
  let seen = 0;
  for (const w of vo.words) {
    if (norm(w.w) === word.toLowerCase()) {
      seen++;
      if (seen === nth) return w.start;
    }
  }
  throw new Error(`word not in voice-over: ${word}`);
};
/** Index of the first spoken word of scene marker n (0-based). */
export const sceneWordIndex = (scene: number) => vo.words.findIndex((w) => w.start === SCENE_STARTS[scene]);

const field = z.object({ label: z.string(), value: z.string() });
const bill = z.object({
  sender: z.string(),
  subject: z.string(),
  fields: z.array(field).length(4),
});

export const metronoomSchema = z.object({
  hook: z.object({
    headline: z.string(),
    cloudLabel: z.string(),
    guesses: z.array(z.string()).min(2).max(8),
  }),
  rules: z.object({
    headline: z.string(),
    counter: z.string(),
  }),
  repeat: z.object({ headline: z.string() }),
  cta: z.object({
    tagline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  bill,
  secondBill: bill,
  colors: z.object({
    blue: zColor(),
    light: zColor(),
    softBlue: zColor(),
    bodyOnBlue: zColor(),
    alert: zColor(),
  }),
  swingDegrees: z.number().min(10).max(40),
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type MetronoomProps = z.infer<typeof metronoomSchema>;

export const defaultMetronoomProps: MetronoomProps = {
  hook: {
    headline: "Leest er een AI\nmee met je rekening?",
    cloudLabel: "AI",
    guesses: ["€12,89?", "morgen?", "€1.289?", "of toch niet?", "€128?", "volgend jaar?"],
  },
  rules: {
    // Line 1 white, line 2 soft blue; words pop on the spoken words.
    headline: "Nee. Buddy leest\nop de maat.",
    counter: "tik {n} van 4",
  },
  repeat: { headline: "Elke rekening,\ndezelfde vier tikken." },
  cta: {
    tagline: "Geen AI.\nGewoon op de maat.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  bill: {
    sender: "Zorgverzekeraar",
    subject: "Je premie van december",
    fields: [
      { label: "Bedrag", value: "€128,95" },
      { label: "Vervaldatum", value: "vr 18 dec" },
      { label: "Betaallink", value: "link in de mail" },
      { label: "Kenmerk", value: "4021 7788 1903" },
    ],
  },
  secondBill: {
    sender: "Energieleverancier",
    subject: "Je factuur van december",
    fields: [
      { label: "Bedrag", value: "€87,60" },
      { label: "Vervaldatum", value: "ma 21 dec" },
      { label: "Betaallink", value: "link in de mail" },
      { label: "Kenmerk", value: "7730 1145 0062" },
    ],
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    // No red in the current ad set (Gate 1): the "AI" cloud uses dark ink.
    alert: "#111827",
  },
  swingDegrees: 26,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
