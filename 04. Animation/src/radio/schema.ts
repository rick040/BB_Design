import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import voTiming from "../../public/vo/radio/timing.json";

// Concept 59 · "Ruis eruit. Datum erin." (radio)
// The animation follows the voice-over: scene starts come from
// public/vo/radio/timing.json (measured from the ElevenLabs take with
// timestamps). Every field below is editable in Remotion Studio.
// Tip: "\n" in a headline or subline forces a line break.

export const FPS = 30;

/** Frames of the spoken words the beats hang on (absolute, from timing.json). */
export const VO_WORDS = voTiming.words;

export const radioSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // Noise: things that fill your head and inbox (generic, no brands).
    noise: z.array(z.string()).length(5),
    stations: z.array(z.string()).length(4),
    billStation: z.string(),
    noticeLabel: z.string(),
    noticeChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    button: z.string(),
  }),
  tune: z.object({
    headline: z.string(),
    dueChip: z.string(),
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(5),
    // Index in `days` of the due date and of the reminder.
    dueIndex: z.number().int().min(0).max(4),
    reminderIndex: z.number().int().min(0).max(4),
    reminderLabel: z.string(),
    subline: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
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
  // Scene starts in frames (where the voice says the first word of the
  // scene). Defaults come from timing.json; change them only together with
  // a new take.
  cues: z.object({
    forward: z.number().int().min(30).max(400),
    tune: z.number().int().min(40).max(500),
    cta: z.number().int().min(60).max(600),
    end: z.number().int().min(90).max(700),
    transition: z.number().int().min(4).max(30),
  }),
  withVoice: z.boolean(),
  voice: z.string(),
  voiceVolume: z.number().min(0).max(1),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type RadioProps = z.infer<typeof radioSchema>;

const S = voTiming.scenes;
// Total = end of the speech + ~1.1 s for the CTA to land.
const END = voTiming.speechEndFrame + 33;

export const defaultRadioProps: RadioProps = {
  hook: {
    headline: "Mis jij die rekening\nin alle ruis?",
    noise: ["Nieuwsbrief", "Groepsapp (14)", "Je pakket komt", "Sale", "Update"],
    stations: ["Nieuws", "Sale", "Pakket", "Apps"],
    billStation: "Energie",
    noticeLabel: "Aanmaning",
    noticeChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door\nnaar Buddy.",
    button: "Doorsturen",
  },
  tune: {
    headline: "Buddy stemt af\nop je vervaldatum.",
    dueChip: "Vervalt do 17 dec",
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
    subline: "Jij kiest wanneer\nje een herinnering krijgt.",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
  },
  cta: {
    tagline: "Ruis eruit.\nDatum erin.",
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
  cues: {
    forward: S.S2.frame,
    tune: S.S3.frame,
    cta: S.S4.frame,
    end: END,
    transition: 12,
  },
  withVoice: true,
  voice: "vo/radio/voice-over.mp3",
  voiceVolume: 1,
  music: "",
  musicVolume: 0.3,
  showSafeZones: false,
};

/**
 * Sequence lengths for the TransitionSeries. Each transition is centred on
 * its voice cue, so the new scene is half in when its first word is spoken.
 */
export const radioFrames = (c: RadioProps["cues"]) => {
  const h = Math.round(c.transition / 2);
  return {
    hook: c.forward - h + c.transition,
    forward: c.tune - c.forward + c.transition,
    tune: c.cta - c.tune + c.transition,
    cta: c.end - (c.cta - h),
    transition: c.transition,
    // Absolute frame where each scene's sequence starts.
    start: { hook: 0, forward: c.forward - h, tune: c.tune - h, cta: c.cta - h },
  };
};

export const radioTotal = (c: RadioProps["cues"]) => c.end;
