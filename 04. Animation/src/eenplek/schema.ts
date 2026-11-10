import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/eenplek/timing.json";

// Concept 68 · "Alles op één plek." (eenplek, split screen)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/eenplek/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/eenplek/voice-over.mp3";

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

const zBill = z.object({
  sender: z.string(),
  amount: z.string(),
  due: z.string(),
  /** Day of the month, used to sort the overview. */
  dueDay: z.number().int().min(1).max(31),
});

export const eenplekSchema = z.object({
  /** In arrival order (left pile → overview). The overview sorts them by dueDay. */
  bills: z.array(zBill).length(5),
  split: z.object({
    headline: z.string(),
    leftLabel: z.string(),
    rightLabel: z.string(),
    note: z.string(),
  }),
  forward: z.object({ headline: z.string() }),
  overview: z.object({
    headline: z.string(),
    title: z.string(),
    month: z.string(),
    dueColumn: z.string(),
    amountColumn: z.string(),
    exportChips: z.array(z.string()).length(2),
  }),
  cta: z.object({
    // First line white, the rest soft blue.
    tagline: z.string(),
    cardLabel: z.string(),
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
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type EenplekProps = z.infer<typeof eenplekSchema>;

export const defaultEenplekProps: EenplekProps = {
  bills: [
    { sender: "Sportschool", amount: "€29,99", due: "15 dec", dueDay: 15 },
    { sender: "Zorgverzekeraar", amount: "€128,95", due: "1 dec", dueDay: 1 },
    { sender: "Energieleverancier", amount: "€87,60", due: "17 dec", dueDay: 17 },
    { sender: "Telefoonprovider", amount: "€24,50", due: "4 dec", dueDay: 4 },
    { sender: "Gemeente", amount: "€96,40", due: "9 dec", dueDay: 9 },
  ],
  split: {
    headline: "Waar was die\nrekening ook alweer?",
    leftLabel: "Zonder Buddy",
    rightLabel: "Met Buddy",
    note: "nog betalen??",
  },
  forward: { headline: "Stuur ze door." },
  overview: {
    headline: "Buddy zet ze\nonder elkaar.",
    title: "Overzicht",
    month: "december",
    dueColumn: "Vervalt",
    amountColumn: "Bedrag",
    exportChips: ["CSV", "JSON"],
  },
  cta: {
    tagline: "Alles op\néén plek.",
    cardLabel: "5 rekeningen",
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
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
