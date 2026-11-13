import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/rolmaat/timing.json";

// Concept 83 · "Afgemeten. Altijd in te zien." (rolmaat)
// One continuous shot, no scene cuts: the camera follows Buddy along a tape
// measure. Every beat comes from public/vo/rolmaat/timing.json (measured from
// the ElevenLabs alignment), so the picture follows the voice.

export const FPS = 30;

/** Segment starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/rolmaat/voice-over.mp3";

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

export const rolmaatSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    // Exactly the four fields Buddy reads (brand §2).
    fields: z.array(z.object({ label: z.string(), value: z.string() })).length(4),
  }),
  ruler: z.object({
    today: z.string(),
    todayDate: z.number().int(),
    dueLabel: z.string(),
    dueDays: z.number().int().min(3).max(14),
    endLabel: z.string(),
    keepDays: z.number().int(),
    counterUnit: z.string(),
    goneLabel: z.string(),
  }),
  headlines: z.object({
    hook: z.string(),
    measure: z.string(),
    keep: z.string(),
    look: z.string(),
  }),
  inzage: z.object({
    mail: z.string(),
    title: z.string(),
    keptLabel: z.string(),
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

export type RolmaatProps = z.infer<typeof rolmaatSchema>;

export const defaultRolmaatProps: RolmaatProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Factuur november",
    fields: [
      { label: "Bedrag", value: "€87,60" },
      { label: "Vervaldatum", value: "do 17 dec" },
      { label: "Betaallink", value: "✓" },
      { label: "Kenmerk", value: "3027 4419" },
    ],
  },
  ruler: {
    today: "vandaag",
    todayDate: 8,
    dueLabel: "vervaldatum",
    dueDays: 9,
    endLabel: "do 31 dec",
    keepDays: 14,
    counterUnit: "dagen",
    goneLabel: "Weg.",
  },
  headlines: {
    hook: "Hoe lang bewaart\nBuddy jouw rekening?",
    measure: "Hij meet het af.",
    keep: "Plus 14 dagen.\nDaarna is het weg.",
    look: "Wat hij nu heeft?\nEén mail, en je ziet het.",
  },
  inzage: {
    mail: "gegevens@",
    title: "Dit heeft Buddy van je",
    keptLabel: "Bewaard tot",
  },
  cta: {
    tagline: "Afgemeten.\nAltijd in te zien.",
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
