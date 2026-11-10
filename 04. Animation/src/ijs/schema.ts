import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import { CUES, VOICE_END } from "./vo";

// Concept 61 · "Van dun ijs naar vaste grond." (op dun ijs)
// Every field below is editable in Remotion Studio (Props panel).
// Scene lengths are NOT seconds here: they follow the voice-over cues in
// public/vo/ijs/timing.json. Each transition is centred on its cue.

export const ijsSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    overdue: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    forwardButton: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    month: z.string(),
    // Seven days, Monday first. dueIndex = day the bill lands on,
    // reminderIndex = day the reminder bell rings.
    days: z.array(z.object({ dow: z.string(), day: z.string() })).length(7),
    dueIndex: z.number().int().min(0).max(6),
    reminderIndex: z.number().int().min(0).max(6),
    reminderLabel: z.string(),
  }),
  cta: z.object({
    // First line white, second line soft blue.
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
    // Frames of CTA after the last spoken word (~1 s).
    ctaTail: z.number().int().min(15).max(90),
    transition: z.number().int().min(6).max(20),
  }),
  withVoice: z.boolean(),
  voiceSrc: z.string(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type IjsProps = z.infer<typeof ijsSchema>;

export const defaultIjsProps: IjsProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je rekening van december",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  hook: {
    headline: "Sta jij met die\nrekening op dun ijs?",
    overdue: "Aanmaning",
    costChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door\nnaar Buddy.",
    forwardButton: "Doorsturen",
  },
  agenda: {
    headline: "Buddy zet hem\nin je agenda.",
    subline: "Met een herinnering\nwanneer jij wilt.",
    month: "December",
    days: [
      { dow: "ma", day: "14" },
      { dow: "di", day: "15" },
      { dow: "wo", day: "16" },
      { dow: "do", day: "17" },
      { dow: "vr", day: "18" },
      { dow: "za", day: "19" },
      { dow: "zo", day: "20" },
    ],
    dueIndex: 3,
    reminderIndex: 0,
    reminderLabel: "Herinnering",
  },
  cta: {
    tagline: "Van dun ijs\nnaar vaste grond.",
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
    ctaTail: 31,
    transition: 12,
  },
  withVoice: true,
  voiceSrc: "vo/ijs/voice-over.mp3",
  voiceVolume: 1,
  showSafeZones: false,
};

export const FPS = 30;

/** Scene starts (global) and lengths, derived from the voice cues. */
export const ijsFrames = (t: IjsProps["timing"]) => {
  const half = Math.round(t.transition / 2);
  const total = VOICE_END + t.ctaTail;
  const starts = CUES.map((c, i) => (i === 0 ? 0 : c - half));
  const lens = starts.map((s, i) =>
    i < starts.length - 1 ? starts[i + 1] - s + t.transition : total - s,
  );
  return { starts, lens, transition: t.transition, total };
};

export const ijsTotal = (t: IjsProps["timing"]) => ijsFrames(t).total;
