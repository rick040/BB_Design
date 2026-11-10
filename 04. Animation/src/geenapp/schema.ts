import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/geenapp/timing.json";

// Concept 67 · "Geen app. Je mail is genoeg." (volle telefoon)
// One continuous shot without scene cuts. The voice-over drives everything:
// cue frames come from public/vo/geenapp/timing.json (ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene cues (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/geenapp/voice-over.mp3";

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

/** Beats, all hung on spoken words (exported for timeline.py / the cue table). */
export const BEATS = {
  sheetIn: 12,
  storageFull: wordAt("vol"),
  buddyIn: wordAt("Hoeft"),
  cancel: wordAt("niet"),
  bump: wordAt("Buddy"),
  appsGone: wordAt("app", 2),
  mailIn: wordAt("stuurt"),
  forwardTap: wordAt("door"),
  catchMail: wordAt("door") + 16,
  dateChip: wordAt("vervaldatum"),
  throwDate: wordAt("komt"),
  agendaLand: wordAt("agenda"),
  dive: wordAt("agenda") + 14,
  diveLen: 18,
  cta: wordAt("Activeer"),
  tap: wordAt("Buddy", 2),
} as const;

export const geenAppSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
    dateChip: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    subline: z.string(),
    installTitle: z.string(),
    installing: z.string(),
    storageChip: z.string(),
  }),
  noApp: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    button: z.string(),
    month: z.string(),
    day: z.string(),
    date: z.string(),
    reminder: z.string(),
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

export type GeenAppProps = z.infer<typeof geenAppSchema>;

export const defaultGeenAppProps: GeenAppProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
    dateChip: "do 17 dec",
  },
  hook: {
    headline: "Nog een app voor\nje rekeningen?",
    subline: "Je telefoon zit al vol.",
    installTitle: "Rekeningen-app",
    installing: "Installeren",
    storageChip: "Opslag vol",
  },
  noApp: {
    headline: "Hoeft niet.",
    subline: "Buddy werkt zonder app.",
  },
  forward: {
    headline: "Doorsturen.\nDat is alles.",
    subline: "Je mail en je agenda\nzijn genoeg.",
    button: "Doorsturen",
    month: "december",
    day: "do",
    date: "17",
    reminder: "Herinnering wanneer jij kiest",
  },
  cta: {
    tagline: "Geen app.\nJe mail is genoeg.",
    button: "activeer buddy",
    subline: "Geen bankkoppeling.\nBuddy ziet alleen wat jij doorstuurt.",
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
