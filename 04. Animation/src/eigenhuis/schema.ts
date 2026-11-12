import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/eigenhuis/timing.json";

// Concept 79 · "Je eigen huis. Meteen op orde." (plattegrond, één doorlopend shot)
// The animation follows the voice-over: cue frames and beats come from
// public/vo/eigenhuis/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Cue frames = first spoken word after each [S] marker. */
export const CUES = vo.sceneStarts as [number, number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/eigenhuis/voice-over.mp3";

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

const zBill = z.object({
  label: z.string(),
  sender: z.string(),
  amount: z.string(),
  date: z.string(),
});

export const eigenHuisSchema = z.object({
  // Four bills, in the order the voice names them (huur, energie, internet, zorg).
  bills: z.array(zBill).length(4),
  rooms: z.object({
    living: z.string(),
    kitchen: z.string(),
    bedroom: z.string(),
    bath: z.string(),
    hall: z.string(),
    mat: z.string(),
  }),
  unknownDue: z.string(),
  headlines: z.object({
    hook: z.string(),
    rooms: z.string(),
    forward: z.string(),
    agenda: z.string(),
    nudge: z.string(),
  }),
  agenda: z.object({
    month: z.string(),
    bell: z.string(),
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
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type EigenHuisProps = z.infer<typeof eigenHuisSchema>;

export const defaultEigenHuisProps: EigenHuisProps = {
  bills: [
    { label: "Huur", sender: "Verhuurder", amount: "€925,00", date: "di 1" },
    { label: "Energie", sender: "Energieleverancier", amount: "€87,60", date: "vr 4" },
    { label: "Internet", sender: "Telefoonprovider", amount: "€45,00", date: "di 8" },
    { label: "Zorgverzekering", sender: "Zorgverzekeraar", amount: "€142,30", date: "di 15" },
  ],
  rooms: {
    living: "WOONKAMER",
    kitchen: "KEUKEN",
    bedroom: "SLAAPKAMER",
    bath: "BADKAMER",
    hall: "GANG",
    mat: "WELKOM",
  },
  unknownDue: "vervalt ?",
  headlines: {
    hook: "Net op\njezelf?",
    rooms: "Alles op\njouw naam.",
    forward: "Stuur ze door\nnaar Buddy.",
    agenda: "Elke vervaldatum\nin je agenda.",
    nudge: "Met een seintje\nwanneer jij wilt.",
  },
  agenda: {
    month: "december",
    bell: "seintje",
  },
  cta: {
    tagline: "Je eigen huis.\nMeteen op orde.",
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
