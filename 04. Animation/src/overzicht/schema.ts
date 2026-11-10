import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/overzicht/timing.json";

// Concept 68 · "Alles op één lijst." (overzicht, twee schermen naast elkaar)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/overzicht/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/overzicht/voice-over.mp3";

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

const bill = z.object({
  sender: z.string(),
  amount: z.string(),
  due: z.string(),
  /** Sort key for "op datum" (lower = earlier). */
  dueOrder: z.number().int(),
  /** How the loose bill looks in the "zonder Buddy" panel. */
  look: z.enum(["sticky", "letter", "mail", "receipt"]),
});

export const overzichtSchema = z.object({
  bills: z.array(bill).length(4),
  labels: z.object({ without: z.string(), with: z.string() }),
  hook: z.object({ headline: z.string(), subline: z.string(), question: z.string() }),
  forward: z.object({ headline: z.string() }),
  list: z.object({ headline: z.string(), subline: z.string(), export: z.string() }),
  cta: z.object({
    // Words of the tagline pop on the spoken words.
    tagline: z.string(),
    stackLabel: z.string(),
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

export type OverzichtProps = z.infer<typeof overzichtSchema>;

export const defaultOverzichtProps: OverzichtProps = {
  bills: [
    { sender: "Zorgverzekeraar", amount: "€138,50", due: "1 dec", dueOrder: 3, look: "letter" },
    { sender: "Gemeente", amount: "€96,00", due: "28 nov", dueOrder: 2, look: "mail" },
    { sender: "Telefoonprovider", amount: "€24,99", due: "5 dec", dueOrder: 4, look: "sticky" },
    { sender: "Sportschool", amount: "€29,95", due: "20 nov", dueOrder: 1, look: "receipt" },
  ],
  labels: { without: "Zonder Buddy", with: "Met Buddy" },
  hook: {
    headline: "Waar staan al je\nrekeningen?",
    subline: "Overal een beetje.",
    question: "Vervalt?",
  },
  forward: { headline: "Stuur ze door\nnaar Buddy." },
  list: {
    headline: "Alles in één\noverzicht.",
    subline: "Op datum, met het bedrag erbij.",
    export: "Exporteer naar CSV of JSON",
  },
  cta: {
    tagline: "Alles op\néén lijst.",
    stackLabel: "4 rekeningen · op datum",
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
