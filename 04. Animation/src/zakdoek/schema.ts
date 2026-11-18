import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/zakdoek/timing.json";

// Concept 98 · "Geen knopen meer." (zakdoek)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/zakdoek/timing.json (measured from the ElevenLabs alignment).

export const FPS = 30;
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/zakdoek/voice-over.mp3";

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

/** Split line between the two screens (y in px, 9:16). */
export const SPLIT_Y = 900;
/** Dark tone for "without Buddy" (no red, see Gate 1 in the changelog). */
export const INK = "#111827";

export const zakdoekSchema = z.object({
  bill: z.object({ sender: z.string(), subject: z.string(), amount: z.string(), due: z.string() }),
  hook: z.object({
    headline: z.string(),
    subline: z.string(),
    knotTags: z.array(z.string()).length(3),
  }),
  split: z.object({
    without: z.string(),
    with: z.string(),
    forwardHeadline: z.string(),
    button: z.string(),
    agendaHeadline: z.string(),
    chooseLine: z.string(),
    forgotChip: z.string(),
    reminderLabel: z.string(),
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(5),
    dueIndex: z.number().int().min(0).max(4),
    reminderIndex: z.number().int().min(0).max(4),
  }),
  cta: z.object({ tagline: z.string(), button: z.string(), subline: z.string() }),
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

export type ZakdoekProps = z.infer<typeof zakdoekSchema>;

export const defaultZakdoekProps: ZakdoekProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Een knoop in\nje zakdoek?",
    subline: "Welke rekening\nwas dat alweer?",
    knotTags: ["?", "??", "?"],
  },
  split: {
    without: "Zonder Buddy",
    with: "Met Buddy",
    forwardHeadline: "Stuur hem door.",
    button: "Doorsturen",
    agendaHeadline: "In je agenda.",
    chooseLine: "Jij kiest wanneer.",
    forgotChip: "Welke was het?",
    reminderLabel: "Herinnering",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    dueIndex: 3,
    reminderIndex: 0,
  },
  cta: {
    tagline: "Geen knopen\nmeer.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: INK,
  },
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
