import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 50 · "Knoop eruit. Datum erin." (knoop in je zakdoek)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const zakdoekSchema = z.object({
  // The bill that comes back as a reminder notice in the hook and gets
  // forwarded in scene 2. Shared by all scenes.
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(), // shown on the tag and in the agenda
  }),
  hook: z.object({
    headline: z.string(),
    noticeSubject: z.string(),
    noticeLabel: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    button: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    month: z.string(),
    // 14 day numbers, two weeks starting on Monday.
    firstDay: z.number().min(1).max(28),
    dueDay: z.number().min(1).max(31),
    remindDay: z.number().min(1).max(31),
    remindLabel: z.string(),
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
    hook: z.number().min(2.8).max(8),
    forward: z.number().min(3).max(8),
    agenda: z.number().min(3.4).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type ZakdoekProps = z.infer<typeof zakdoekSchema>;

export const defaultZakdoekProps: ZakdoekProps = {
  bill: {
    sender: "Zorgverzekeraar",
    subject: "Je nota van november",
    amount: "€96,40",
    due: "do 17 dec",
  },
  hook: {
    headline: "Knoop in je zakdoek.\nMaar waarvoor?",
    noticeSubject: "Aanmaning",
    noticeLabel: "Te laat betaald",
    costChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door.\nBuddy weet waarvoor.",
    subline: "Hij leest het bedrag\nen de vervaldatum.",
    button: "Doorsturen",
  },
  agenda: {
    headline: "Nu weet je wél\nwaarvoor.",
    subline: "Jij kiest wanneer\nje een herinnering krijgt.",
    month: "December",
    firstDay: 14,
    dueDay: 17,
    remindDay: 15,
    remindLabel: "Nog 2 dagen",
  },
  cta: {
    tagline: "Knoop eruit.\nDatum erin.",
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
    forward: 3.6,
    agenda: 4.0,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const zakdoekFrames = (t: ZakdoekProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    forward: f(t.forward),
    agenda: f(t.agenda),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const zakdoekTotal = (t: ZakdoekProps["timing"]) => {
  const s = zakdoekFrames(t);
  return s.hook + s.forward + s.agenda + s.cta - 3 * s.transition;
};
