import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Campagne 2612 · K2 "Twaalf wordt tweeënvijftig" (aanmaning en incassokosten)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const twaalfSchema = z.object({
  // Paid-Reels safe zone (9:16): keeps text and the CTA between y≈280 and y≈1250.
  adSafeZone: z.boolean(),
  amounts: z.object({
    // The small bill and what it can grow into. Shown as "€<n>".
    start: z.number().int().min(1).max(500),
    end: z.number().int().min(2).max(1000),
    currency: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  letter: z.object({
    headline: z.string(),
    month: z.string(),
    // The day pages flip from → to (14 days in the default).
    fromDay: z.number().int().min(1).max(31),
    toDay: z.number().int().min(2).max(31),
  }),
  grow: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  rewind: z.object({
    headline: z.string(),
    // One chip per reminder (default one: "seintje vooraf").
    reminders: z.array(z.string()).min(1).max(2),
  }),
  cta: z.object({
    button: z.string(),
  }),
  colors: z.object({
    blue: zColor(),
    light: zColor(),
    softBlue: zColor(),
    bodyOnBlue: zColor(),
    // Urgency colour (yellow in this campaign: no red).
    alert: zColor(),
  }),
  timing: z.object({
    hook: z.number().min(1.6).max(6),
    letter: z.number().min(2).max(6),
    grow: z.number().min(2).max(6),
    rewind: z.number().min(2).max(6),
    cta: z.number().min(1.2).max(6),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type TwaalfProps = z.infer<typeof twaalfSchema>;

export const defaultTwaalfProps: TwaalfProps = {
  adSafeZone: true,
  amounts: { start: 12, end: 52, currency: "€" },
  bill: {
    sender: "Zorgverzekeraar",
    subject: "Je premie van november",
    amount: "€12,00",
    due: "vervallen",
  },
  hook: {
    headline: "Rekening vergeten.",
    subline: "Nog geen ramp.",
  },
  letter: {
    headline: "Aanmaning.\nVeertien dagen.",
    month: "december",
    fromDay: 2,
    toDay: 16,
  },
  grow: {
    headline: "€12 kan €52 worden.",
    subline: "Er kan €40 incassokosten bij.",
  },
  rewind: {
    headline: "Of: een seintje vooraf.",
    reminders: ["seintje vooraf"],
  },
  cta: {
    button: "Zo werkt het",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.yellow,
  },
  timing: {
    hook: 2.4,
    letter: 2.9,
    grow: 2.9,
    rewind: 2.9,
    cta: 1.5,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const twaalfFrames = (t: TwaalfProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    letter: f(t.letter),
    grow: f(t.grow),
    rewind: f(t.rewind),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const twaalfTotal = (t: TwaalfProps["timing"]) => {
  const s = twaalfFrames(t);
  return s.hook + s.letter + s.grow + s.rewind + s.cta - 4 * s.transition;
};

/** "€12" … "€52" in even steps, for the rolling number. */
export const amountSteps = (from: number, to: number, currency: string, steps = 10) => {
  const out: string[] = [];
  for (let i = 0; i <= steps; i++) out.push(`${currency}${Math.round(from + ((to - from) * i) / steps)}`);
  return out;
};
