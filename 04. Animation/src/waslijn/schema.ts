import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/waslijn/timing.json";

// Concept 99 · "Alles in het zicht." (waslijn)
// USP inzage: je ziet precies wat Buddy van je rekening heeft, en veertien
// dagen na de vervaldatum is het weg. Eén doorlopend shot langs een waslijn.
// De animatie volgt de stem: scènestarts en beats komen uit
// public/vo/waslijn/timing.json (gemeten uit de ElevenLabs-alignment).

export const FPS = 30;

/** Scènestarts (frames) = eerste gesproken woord per [S]-marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/waslijn/voice-over.mp3";

/** Startframe van de n-de keer dat een woord gesproken wordt (leestekens genegeerd). */
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

export const waslijnSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    boxLabel: z.string(),
    chip: z.string(),
  }),
  line: z.object({
    headline: z.string(),
    subline: z.string(),
    // Precies vier velden: bedrag, vervaldatum, betaallink, kenmerk.
    fields: z.array(field).length(4),
  }),
  gone: z.object({
    headline: z.string(),
    subline: z.string(),
    plusLabel: z.string(),
    goneLabel: z.string(),
  }),
  cta: z.object({
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

export type WaslijnProps = z.infer<typeof waslijnSchema>;

export const defaultWaslijnProps: WaslijnProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Wat bewaart een app\nvan je rekening?",
    boxLabel: "app",
    chip: "Geen idee.",
  },
  line: {
    headline: "Je ziet precies\nwat er hangt.",
    subline: "Wat heeft Buddy van je?\nMail gegevens@.",
    fields: [
      { label: "Bedrag", value: "€87,60" },
      { label: "Vervaldatum", value: "do 17 dec" },
      { label: "Betaallink", value: "Link" },
      { label: "Kenmerk", value: "4021 7788" },
    ],
  },
  gone: {
    headline: "Veertien dagen na\nde vervaldatum: weg.",
    subline: "Eerder weg? Mail stop@.",
    plusLabel: "dagen",
    goneLabel: "Lijn leeg",
  },
  cta: {
    tagline: "Alles in\nhet zicht.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    // Geen rood in de ads (strategie november): waarschuwingen in donker.
    alert: "#111827",
  },
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
