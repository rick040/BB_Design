import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/weegschaal/timing.json";

// Concept 66 · "Reken maar uit." (weegschaal, USP prijs, vorm rekensom)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/weegschaal/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/weegschaal/voice-over.mp3";

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

export const weegschaalSchema = z.object({
  bill: z.object({ sender: z.string(), amount: z.string(), stamp: z.string() }),
  hook: z.object({ headline: z.string() }),
  fine: z.object({ headline: z.string(), weight: z.string() }),
  buddy: z.object({ headline: z.string(), price: z.string(), per: z.string() }),
  agenda: z.object({ headline: z.string(), month: z.string(), day: z.string(), weekday: z.string(), reminder: z.string() }),
  cta: z.object({
    tagline: z.string(),
    left: z.string(),
    leftLabel: z.string(),
    right: z.string(),
    rightLabel: z.string(),
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

export type WeegschaalProps = z.infer<typeof weegschaalSchema>;

export const defaultWeegschaalProps: WeegschaalProps = {
  bill: { sender: "Energieleverancier", amount: "€87,60", stamp: "Aanmaning" },
  hook: { headline: "Wat kost een vergeten\nrekening?" },
  fine: { headline: "Eén aanmaning kan\nuitlopen op €40.", weight: "€40" },
  buddy: { headline: "Buddy: €3,49\nper maand.", price: "€3,49", per: "per maand" },
  agenda: { headline: "Met een herinnering\nin je agenda.", month: "dec", day: "17", weekday: "do", reminder: "Herinnering" },
  cta: {
    tagline: "Reken maar uit.",
    left: "€3,49",
    leftLabel: "Buddy per maand",
    right: "€40",
    rightLabel: "kan een aanmaning kosten",
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
  transitionFrames: 14,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
