import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/wedstrijd/timing.json";

// Concept 77 · "Klaar voordat die app laadt." (wedstrijd)
// USP geen-app. The animation follows the voice-over: scene starts and beats
// come from public/vo/wedstrijd/timing.json (ElevenLabs alignment, one take).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/wedstrijd/voice-over.mp3";

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

export const wedstrijdSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    appName: z.string(),
    installing: z.string(),
    chores: z.array(z.string()).length(4),
  }),
  race: z.object({
    appLane: z.string(),
    buddyLane: z.string(),
    loading: z.string(),
    forwardHeadline: z.string(),
    forwardButton: z.string(),
    agendaHeadline: z.string(),
    agendaSubline: z.string(),
    month: z.string(),
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(5),
    dueIndex: z.number().int().min(0).max(4),
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

export type WedstrijdProps = z.infer<typeof wedstrijdSchema>;

export const defaultWedstrijdProps: WedstrijdProps = {
  bill: {
    sender: "Zorgverzekeraar",
    subject: "Je premie van december",
    amount: "€142,30",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Nog een app\ndownloaden?",
    appName: "Rekeningen-app",
    installing: "Installeren",
    chores: ["Account aanmaken", "Wachtwoord kiezen", "Meldingen toestaan", "Inloggen"],
  },
  race: {
    appLane: "Met een app",
    buddyLane: "Met Buddy",
    loading: "Laden",
    forwardHeadline: "Hoeft niet.\nStuur hem door.",
    forwardButton: "Doorsturen",
    agendaHeadline: "Al in je agenda.",
    agendaSubline: "En die app?\nDie laadt nog.",
    month: "december",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    dueIndex: 3,
  },
  cta: {
    tagline: "Klaar voordat\ndie app laadt.",
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
