import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/deurmat/timing.json";

// Concept 125 · "Net op jezelf. Niet alleen." (deurmat)
// The animation follows the voice-over timeline in public/vo/deurmat/timing.json.
// This run could not generate the voice (ElevenLabs quota 0), so that file holds
// an ESTIMATED word timeline. Generate the voice with the text in CONCEPT-125.md,
// overwrite timing.json with the measured alignment and every beat moves along.

export const FPS = 30;

export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/deurmat/voice-over.mp3";

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

const zBill = z.object({ sender: z.string(), due: z.string(), date: z.string() });

export const deurmatSchema = z.object({
  bills: z.array(zBill).length(5),
  door: z.object({
    headline: z.string(),
    countLabel: z.string(),
    mat: z.string(),
  }),
  sum: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  buddy: z.object({
    headline: z.string(),
    headline2: z.string(),
  }),
  cta: z.object({
    tagline: z.string(),
    button: z.string(),
    subline: z.string(),
    mat: z.string(),
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

export type DeurmatProps = z.infer<typeof deurmatSchema>;

export const defaultDeurmatProps: DeurmatProps = {
  bills: [
    { sender: "Verhuurder", due: "Vervalt 1 dec", date: "1 dec" },
    { sender: "Energieleverancier", due: "Vervalt 8 dec", date: "8 dec" },
    { sender: "Internetprovider", due: "Vervalt 15 dec", date: "15 dec" },
    { sender: "Zorgverzekeraar", due: "Vervalt 22 dec", date: "22 dec" },
    { sender: "Gemeente", due: "Vervalt 31 dec", date: "31 dec" },
  ],
  door: {
    headline: "Net op jezelf?\nDan komen ze.",
    countLabel: "rekeningen",
    mat: "welkom",
  },
  sum: {
    headline: "Vijf rekeningen.\nVijf vervaldatums.",
    subline: "Allemaal van jou.",
  },
  buddy: {
    headline: "Stuur ze door\nnaar Buddy.",
    headline2: "Hij zet ze\nin je agenda.",
  },
  cta: {
    tagline: "Net op jezelf.\nNiet alleen.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
    mat: "welkom thuis",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.red,
  },
  transitionFrames: 12,
  withVoice: false,
  voiceVolume: 1,
  showSafeZones: false,
};
