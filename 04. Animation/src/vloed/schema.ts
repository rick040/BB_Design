import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 57 · "Vloed komt. Jij staat droog." (getijden / strand)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const vloedSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
    // Short label on the agenda tile.
    short: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    noticeSubject: z.string(),
    noticeDue: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    month: z.string(),
    // Seven days, Monday first. The bill lands on `billDay`, the reminder on `reminderDay` (0-based).
    days: z.array(z.object({ name: z.string(), date: z.string() })).length(7),
    billDay: z.number().int().min(0).max(6),
    reminderDay: z.number().int().min(0).max(6),
    reminderLabel: z.string(),
    subline: z.string(),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
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
    forward: z.number().min(3).max(8),
    agenda: z.number().min(3.6).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  // Voice-over: one ElevenLabs clip per cue, placed on an absolute frame.
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  voiceCues: z.array(z.object({ file: z.string(), from: z.number().int().min(0) })),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type VloedProps = z.infer<typeof vloedSchema>;

export const defaultVloedProps: VloedProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van december",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
    short: "Energie",
  },
  hook: {
    headline: "Die rekening\nspoelt niet weg.",
    noticeSubject: "Aanmaning",
    noticeDue: "Te laat betaald",
    costChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door\nnaar Buddy.",
    button: "Doorsturen",
    subline: "Buddy haalt er bedrag\nen vervaldatum uit.",
  },
  agenda: {
    headline: "Buddy zet hem\nin je agenda.",
    month: "december",
    days: [
      { name: "ma", date: "14" },
      { name: "di", date: "15" },
      { name: "wo", date: "16" },
      { name: "do", date: "17" },
      { name: "vr", date: "18" },
      { name: "za", date: "19" },
      { name: "zo", date: "20" },
    ],
    billDay: 3,
    reminderDay: 0,
    reminderLabel: "Herinnering",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
  },
  cta: {
    tagline: "Vloed komt.\nJij staat droog.",
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
    hook: 3.4,
    forward: 3.8,
    agenda: 4.6,
    cta: 4.6,
    transition: 0.4,
  },
  withVoice: true,
  voiceVolume: 1,
  voiceCues: [
    { file: "vo/vloed/cue-01.mp3", from: 0 },
    { file: "vo/vloed/cue-02.mp3", from: 101 },
    { file: "vo/vloed/cue-03.mp3", from: 152 },
    { file: "vo/vloed/cue-04.mp3", from: 228 },
    { file: "vo/vloed/cue-05.mp3", from: 286 },
    { file: "vo/vloed/cue-06.mp3", from: 354 },
    { file: "vo/vloed/cue-07.mp3", from: 412 },
  ],
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const vloedFrames = (t: VloedProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    forward: f(t.forward),
    agenda: f(t.agenda),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const vloedTotal = (t: VloedProps["timing"]) => {
  const s = vloedFrames(t);
  return s.hook + s.forward + s.agenda + s.cta - 3 * s.transition;
};
