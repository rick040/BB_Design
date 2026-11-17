import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/vliegtuig/timing.json";

// Concept 96 · "Alleen wat jij doorstuurt." (papieren vliegtuig)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/vliegtuig/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/vliegtuig/voice-over.mp3";

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

export const vliegtuigSchema = z.object({
  bill: z.object({
    sender: z.string(),
    amount: z.string(),
    dueShort: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    // Other mails in the mailbox; the bill sender is added as the last row.
    mails: z.array(z.string()).length(4),
    appLabel: z.string(),
    chip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    month: z.string(),
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(5),
    dueIndex: z.number().int().min(0).max(4),
    reminderIndex: z.number().int().min(0).max(4),
    reminderLabel: z.string(),
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

export type VliegtuigProps = z.infer<typeof vliegtuigSchema>;

export const defaultVliegtuigProps: VliegtuigProps = {
  bill: {
    sender: "Energieleverancier",
    amount: "€87,60",
    dueShort: "do 17 dec",
  },
  hook: {
    headline: "Je hele mailbox\nkoppelen?",
    mails: ["Huisgenoot", "Werk", "Vakantie", "Bank"],
    appLabel: "Koppeling",
    chip: "Hoeft niet.",
  },
  forward: {
    headline: "Stuur alleen\ndie ene door.",
    button: "Doorsturen",
    subline: "Buddy ziet alleen\nwat jij doorstuurt.",
  },
  agenda: {
    headline: "Buddy zet hem\nin je agenda.",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
    month: "december",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    dueIndex: 3,
    reminderIndex: 0,
    reminderLabel: "Herinnering",
  },
  cta: {
    tagline: "Alleen wat\njij doorstuurt.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    // No red in the ads (Meta strategy, Gate 1): warnings use dark ink.
    alert: "#111827",
  },
  transitionFrames: 12,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
