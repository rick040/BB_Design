import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/glasla/timing.json";

// Concept 65 · "Niks verstopt. Alles in zicht." (glazen la, USP inzage)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/glasla/timing.json (measured from the ElevenLabs alignment).
// Every text and colour below is editable in Remotion Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/glasla/voice-over.mp3";

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

const field = z.object({ label: z.string(), value: z.string() });

export const glaslaSchema = z.object({
  /** The four things Buddy keeps from a forwarded bill. */
  fields: z.array(field).length(4),
  sender: z.string(),
  hook: z.object({ headline: z.string(), frontLabel: z.string() }),
  drawer: z.object({ headline: z.string(), subline: z.string() }),
  inspect: z.object({
    headline: z.string(),
    to: z.string(),
    subject: z.string(),
    send: z.string(),
    receiptTitle: z.string(),
    subline: z.string(),
  }),
  expiry: z.object({
    question: z.string(),
    headline: z.string(),
    dueLabel: z.string(),
    days: z.number().int().min(5).max(21),
    goneLabel: z.string(),
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

export type GlaslaProps = z.infer<typeof glaslaSchema>;

export const defaultGlaslaProps: GlaslaProps = {
  fields: [
    { label: "Bedrag", value: "€87,60" },
    { label: "Vervaldatum", value: "do 17 dec" },
    { label: "Betaallink", value: "betalen/8F2K" },
    { label: "Kenmerk", value: "2026-11-4471" },
  ],
  sender: "Energieleverancier",
  hook: { headline: "Wat weet Buddy\nvan jou?", frontLabel: "?" },
  drawer: { headline: "Alleen wat jij\ndoorstuurt.", subline: "Van één doorgestuurde rekening." },
  inspect: {
    headline: "Wil je het\nzien?",
    to: "gegevens@",
    subject: "Wat heeft Buddy van mij?",
    send: "Versturen",
    receiptTitle: "Dit heeft Buddy van je",
    subline: "Je ziet precies wat Buddy van je heeft.",
  },
  expiry: {
    question: "En daarna?",
    headline: "14 dagen na de\nvervaldatum: weg.",
    dueLabel: "do 17 dec",
    days: 14,
    goneLabel: "Verwijderd",
  },
  cta: {
    tagline: "Niks verstopt.\nAlles in zicht.",
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
  transitionFrames: 12,
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
