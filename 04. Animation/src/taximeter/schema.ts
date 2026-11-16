import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/taximeter/timing.json";

// Concept 92 · "Vast tarief. Geen meter." (taximeter, USP prijs, rekensom)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/taximeter/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/taximeter/voice-over.mp3";

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

/** 12.5 -> "€12,50" */
export const euro = (v: number) => `€${v.toFixed(2).replace(".", ",")}`;

export const taximeterSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    headline2: z.string(),
    meterLabel: z.string(),
    stamp: z.string(),
    costChip: z.string(),
    /** Extra costs the meter runs up to on the word "veertig". */
    meterMax: z.number(),
  }),
  forward: z.object({
    headline: z.string(),
    button: z.string(),
    stoppedLabel: z.string(),
    agendaChip: z.string(),
    agendaDate: z.string(),
  }),
  cta: z.object({
    tagline: z.string(),
    price: z.number(),
    priceLabel: z.string(),
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

export type TaximeterProps = z.infer<typeof taximeterSchema>;

export const defaultTaximeterProps: TaximeterProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Vergeten rekening?\nDe meter loopt.",
    headline2: "En hij\ntikt door.",
    meterLabel: "EXTRA KOSTEN",
    stamp: "AANMANING",
    costChip: "Kan uitlopen op €40",
    meterMax: 40,
  },
  forward: {
    headline: "Stuur hem door.\nBuddy herinnert je.",
    button: "Doorsturen",
    stoppedLabel: "METER STIL",
    agendaChip: "Herinnering in je agenda",
    agendaDate: "14",
  },
  cta: {
    tagline: "Vast tarief.",
    price: 3.49,
    priceLabel: "PER MAAND",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    // No red in ads (Gate 1): alerts in dark ink.
    alert: "#111827",
  },
  transitionFrames: 14,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
