import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/rugzak/timing.json";

// Concept 123 · "Alles op tafel." (rugzak)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/rugzak/timing.json. Today that file is a syllable estimate
// (ElevenLabs had no credits). Once the voice exists, regenerate it with
//   python3 tools/vo_to_timing.py public/vo/rugzak/vo-tekst.txt public/vo/rugzak/timing.json --alignment public/vo/rugzak/vo.json
// and every scene shifts onto the spoken words. Texts and colours are editable in Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/rugzak/voice-over.mp3";

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

const item = z.object({ label: z.string(), value: z.string() });

export const rugzakSchema = z.object({
  hook: z.object({
    headline: z.string(),
    bagLabel: z.string(),
  }),
  open: z.object({
    headline: z.string(),
    mailChip: z.string(),
    items: z.array(item).length(4),
    subline: z.string(),
  }),
  empty: z.object({
    headline: z.string(),
    dueDate: z.string(),
    plusLabel: z.string(),
    goneDate: z.string(),
    emptyChip: z.string(),
    subline: z.string(),
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

export type RugzakProps = z.infer<typeof rugzakSchema>;

export const defaultRugzakProps: RugzakProps = {
  hook: {
    headline: "Wat heeft Buddy\nvan je?",
    bagLabel: "?",
  },
  open: {
    headline: "Mail gegevens@.\nDit heeft Buddy.",
    mailChip: "gegevens@",
    items: [
      { label: "Bedrag", value: "€128,95" },
      { label: "Vervaldatum", value: "vr 18 dec" },
      { label: "Betaallink", value: "betalen.nl/…" },
      { label: "Kenmerk", value: "4021 7788" },
    ],
    subline: "Dit haalt Buddy uit je rekening.",
  },
  empty: {
    headline: "En hoe lang?",
    dueDate: "18 dec",
    plusLabel: "+ 14 dagen",
    goneDate: "1 jan",
    emptyChip: "Leeg",
    subline: "Tot 14 dagen na de vervaldatum.\nDaarna is de rugzak leeg.",
  },
  cta: {
    tagline: "Alles\nop tafel.",
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
  transitionFrames: 16,
  // No voice-over.mp3 yet (ElevenLabs out of credits); set to true once it exists.
  withVoice: false,
  voiceVolume: 1,
  showSafeZones: false,
};
