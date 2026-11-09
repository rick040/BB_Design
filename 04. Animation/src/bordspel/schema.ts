import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 53 · "Geen dobbelsteen. Een datum." (bordspel)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const bordspelSchema = z.object({
  // The board: 12 day squares, snaking in three rows of four.
  board: z.object({
    month: z.string(),
    // 12 labels, e.g. "zo 13"; the first word is small, the number big.
    days: z.array(z.string()).length(12),
    // Index (0..11) of the due date, the reminder and the square where the
    // dice throw lands (the reminder you missed).
    dueIndex: z.number().int().min(0).max(11),
    reminderIndex: z.number().int().min(0).max(11),
    penaltyIndex: z.number().int().min(0).max(11),
    // Where your pawn starts in the hook; the die shows (penalty - start).
    startIndex: z.number().int().min(0).max(11),
    dueLabel: z.string(),
    penaltyLabel: z.string(),
    reminderLabel: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    dueDate: z.string(),
    shortName: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    noticeTitle: z.string(),
    feeChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    forwardButton: z.string(),
    subline: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
    tagline: z.string(),
    // Number on the calendar face of the die.
    dieDate: z.string(),
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
    hook: z.number().min(2.8).max(8),
    forward: z.number().min(2.8).max(8),
    agenda: z.number().min(3.8).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type BordspelProps = z.infer<typeof bordspelSchema>;

export const defaultBordspelProps: BordspelProps = {
  board: {
    month: "December",
    days: ["zo 13", "ma 14", "di 15", "wo 16", "do 17", "vr 18", "za 19", "zo 20", "ma 21", "di 22", "wo 23", "do 24"],
    dueIndex: 4,
    reminderIndex: 1,
    penaltyIndex: 8,
    startIndex: 2,
    dueLabel: "Vervalt",
    penaltyLabel: "Aanmaning",
    reminderLabel: "Herinnering",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van december",
    amount: "€87,60",
    dueDate: "do 17 dec",
    shortName: "Energie",
  },
  hook: {
    headline: "Rekeningen betalen\nop goed geluk?",
    noticeTitle: "Aanmaning",
    feeChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door\nnaar Buddy.",
    forwardButton: "Doorsturen",
    subline: "Buddy leest het bedrag\nen de vervaldatum.",
  },
  agenda: {
    headline: "Buddy zet hem\nin je agenda.",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
  },
  cta: {
    tagline: "Geen dobbelsteen.\nEen datum.",
    dieDate: "17",
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
    forward: 3.4,
    agenda: 4.4,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const bordspelFrames = (t: BordspelProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    forward: f(t.forward),
    agenda: f(t.agenda),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const bordspelTotal = (t: BordspelProps["timing"]) => {
  const s = bordspelFrames(t);
  return s.hook + s.forward + s.agenda + s.cta - 3 * s.transition;
};
