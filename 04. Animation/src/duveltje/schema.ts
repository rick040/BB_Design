import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/duveltje/timing.json";

// Concept 122 · "Hij springt pas als jij draait." (duveltje uit een doosje)
// The animation follows the voice-over: scene starts and beats come from
// public/vo/duveltje/timing.json. Regenerate that file with
//   python3 tools/vo_to_timing.py public/vo/duveltje/vo-tekst.txt public/vo/duveltje/timing.json --alignment public/vo/duveltje/vo.json
// and every scene shifts onto the spoken words. Texts and colours are editable in Studio.

export const FPS = 30;

/** Scene starts (frames) = first spoken word of each [S] marker. */
export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/duveltje/voice-over.mp3";

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

export const duveltjeSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    boxLabel: z.string(),
  }),
  split: z.object({
    leftTitle: z.string(),
    rightTitle: z.string(),
    rightBoxLabel: z.string(),
    stamp: z.string(),
    lateLabel: z.string(),
    leftChip: z.string(),
    rightChip: z.string(),
    agendaDay: z.string(),
    agendaTime: z.string(),
    agendaText: z.string(),
  }),
  cta: z.object({
    // First line white, the rest soft blue; words land on the spoken words.
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

export type DuveltjeProps = z.infer<typeof duveltjeSchema>;

export const defaultDuveltjeProps: DuveltjeProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Wanneer springt\njouw rekening eruit?",
    boxLabel: "rekening",
  },
  split: {
    leftTitle: "Zonder Buddy",
    rightTitle: "Met Buddy",
    rightBoxLabel: "doorgestuurd",
    stamp: "AANMANING",
    lateLabel: "Te laat",
    leftChip: "Niet jouw moment",
    rightChip: "Jij kiest: wo 16 dec",
    agendaDay: "wo 16 dec",
    agendaTime: "09:00",
    agendaText: "Energieleverancier\n€87,60 betalen",
  },
  cta: {
    tagline: "Hij springt pas\nals jij draait.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: "#111827",
  },
  transitionFrames: 12,
  withVoice: false,
  voiceVolume: 1,
  showSafeZones: false,
};
