import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/zakmes/timing.json";

// Concept 93 · "Geen app. Je hebt het al." (zakmes)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/zakmes/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/zakmes/voice-over.mp3";

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

export const zakmesSchema = z.object({
  bill: z.object({
    sender: z.string(),
    amount: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    appName: z.string(),
    progressLabel: z.string(),
    steps: z.array(z.string()).length(3),
  }),
  open: z.object({
    headline: z.string(),
    subline: z.string(),
    mailLabel: z.string(),
    agendaLabel: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    button: z.string(),
    month: z.string(),
    day: z.string(),
    weekday: z.string(),
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
  transitionFrames: z.number().int().min(6).max(24),
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type ZakmesProps = z.infer<typeof zakmesSchema>;

export const defaultZakmesProps: ZakmesProps = {
  bill: {
    sender: "Energieleverancier",
    amount: "€87,60",
  },
  hook: {
    headline: "Nog een app voor\nje rekeningen?",
    appName: "Rekeningen",
    progressLabel: "Downloaden",
    steps: ["Account aanmaken", "Wachtwoord bedenken", "Meldingen aanzetten?"],
  },
  open: {
    headline: "Hoeft niet.",
    subline: "Je mail en je agenda\nheb je al.",
    mailLabel: "Mail",
    agendaLabel: "Agenda",
  },
  forward: {
    headline: "Stuur je\nrekening door.",
    subline: "Buddy zet de vervaldatum\nin je agenda.",
    button: "Doorsturen",
    month: "dec",
    day: "17",
    weekday: "do",
    reminder: "Herinnering ma 14",
  },
  cta: {
    tagline: "Geen app.\nJe hebt het al.",
    button: "activeer buddy",
    subline: "Werkt met je mail en je agenda.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    // No red in the ads (Gate 1, 15 nov): warnings use dark ink.
    alert: "#111827",
  },
  transitionFrames: 12,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
