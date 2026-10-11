import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 2 · "7 · 2 · Betaald."
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

const notification = z.object({
  text: z.string(),
  time: z.string(),
  icon: z.enum(["new", "warning", "alert"]),
});

export const countdownSchema = z.object({
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    // The due chip counts down from this many days to "dueTomorrow".
    startDays: z.number().int().min(2).max(30),
    dueLabel: z.string(), // "{n}" is replaced by the number of days
    dueTomorrow: z.string(),
  }),
  countdown: z.object({
    headline: z.string(),
    headlineAfterRoll: z.string(),
    firstNumber: z.string(),
    secondNumber: z.string(),
    // First arrives with the first number, second after the roll.
    notifications: z.array(notification).length(2),
    agendaChip: z.string(),
  }),
  paid: z.object({
    headline: z.string(),
    subline: z.string(),
    stamp: z.string(),
  }),
  cta: z.object({
    // Each line pops in word by word; the last word is highlighted.
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
    hook: z.number().min(2.4).max(8),
    countdown: z.number().min(5).max(10),
    paid: z.number().min(2.4).max(8),
    cta: z.number().min(2.6).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type CountdownProps = z.infer<typeof countdownSchema>;

export const defaultCountdownProps: CountdownProps = {
  bill: {
    sender: "Zorgverzekeraar",
    subject: "Nota oktober",
    amount: "€128,95",
  },
  hook: {
    headline: "Heb jij die rekening al betaald?",
    startDays: 9,
    dueLabel: "Vervalt over {n} dagen",
    dueTomorrow: "Vervalt morgen",
  },
  countdown: {
    headline: "Stuur hem door.\nBuddy telt af.",
    headlineAfterRoll: "Nog een seintje.\nOok in je agenda.",
    firstNumber: "7",
    secondNumber: "2",
    notifications: [
      { text: "Nog 7 dagen · €128,95", time: "5d", icon: "warning" },
      { text: "Nog 2 dagen · betaal op tijd", time: "nu", icon: "alert" },
    ],
    agendaChip: "In je agenda",
  },
  paid: {
    headline: "Betaald.\nZonder stress.",
    subline: "Met de betaallink uit je herinnering.",
    stamp: "BETAALD",
  },
  cta: {
    tagline: "7. 2.\nBetaald.",
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
    countdown: 5.4,
    paid: 3.2,
    cta: 3.4,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const countdownFrames = (t: CountdownProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    countdown: f(t.countdown),
    paid: f(t.paid),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const countdownTotal = (t: CountdownProps["timing"]) => {
  const s = countdownFrames(t);
  return s.hook + s.countdown + s.paid + s.cta - 3 * s.transition;
};
