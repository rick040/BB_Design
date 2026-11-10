import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 56 · "Niks onder het kleed." (wegstoppen / onder het kleed vegen)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

const voiceCue = z.object({
  // File inside public/, e.g. "vo/kleed/cue-01.mp3".
  src: z.string(),
  // Global frame (30 fps) at which the clip starts.
  from: z.number().int().min(0),
});

export const kleedSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    noticeSender: z.string(),
    noticeSubject: z.string(),
    noticeDue: z.string(),
    costChip: z.string(),
  }),
  lift: z.object({
    headline: z.string(),
    forward: z.string(),
    amountChip: z.string(),
    dueChip: z.string(),
    subline: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    month: z.string(),
    // Seven day tiles: weekday + date.
    days: z.array(z.object({ weekday: z.string(), date: z.string() })).length(7),
    // Index of the tile where the bill lands (due date) and of the reminder.
    dueIndex: z.number().int().min(0).max(6),
    reminderIndex: z.number().int().min(0).max(6),
    reminderLabel: z.string(),
    subline: z.string(),
  }),
  cta: z.object({
    // Last line soft blue, the others white.
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
  timing: z.object({
    hook: z.number().min(2.6).max(8),
    lift: z.number().min(3.4).max(8),
    agenda: z.number().min(3).max(8),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  // Voice-over: one clip per cue, placed on exact frames. Off = silent cut.
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(2),
  voiceCues: z.array(voiceCue),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type KleedProps = z.infer<typeof kleedSchema>;

export const defaultKleedProps: KleedProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Rekening onder\nhet kleed geveegd?",
    noticeSender: "Aanmaning",
    noticeSubject: "Energieleverancier",
    noticeDue: "Te laat",
    costChip: "Kan uitlopen op €40",
  },
  lift: {
    headline: "Stuur hem door\nnaar Buddy.",
    forward: "Doorsturen",
    amountChip: "€87,60",
    dueChip: "do 17 dec",
    subline: "Hij haalt er bedrag\nen vervaldatum uit.",
  },
  agenda: {
    headline: "Buddy zet hem\nin je agenda.",
    month: "December",
    days: [
      { weekday: "ma", date: "14" },
      { weekday: "di", date: "15" },
      { weekday: "wo", date: "16" },
      { weekday: "do", date: "17" },
      { weekday: "vr", date: "18" },
      { weekday: "za", date: "19" },
      { weekday: "zo", date: "20" },
    ],
    dueIndex: 3,
    reminderIndex: 0,
    reminderLabel: "Herinnering",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
  },
  cta: {
    tagline: "Niks onder\nhet kleed.\nAlles op tijd.",
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
  timing: {
    hook: 3.2,
    lift: 4.0,
    agenda: 3.6,
    cta: 3.8,
    transition: 0.4,
  },
  withVoice: true,
  voiceVolume: 1,
  voiceCues: [
    { src: "vo/kleed/cue-01.mp3", from: 0 },
    { src: "vo/kleed/cue-02.mp3", from: 62 },
    { src: "vo/kleed/cue-03.mp3", from: 108 },
    { src: "vo/kleed/cue-04.mp3", from: 168 },
    { src: "vo/kleed/cue-05.mp3", from: 222 },
    { src: "vo/kleed/cue-06.mp3", from: 296 },
    { src: "vo/kleed/cue-07.mp3", from: 360 },
  ],
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const kleedFrames = (t: KleedProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    lift: f(t.lift),
    agenda: f(t.agenda),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const kleedTotal = (t: KleedProps["timing"]) => {
  const s = kleedFrames(t);
  return s.hook + s.lift + s.agenda + s.cta - 3 * s.transition;
};
