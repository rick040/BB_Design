import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 51 · "Alles draait. Niks valt." (bordjes draaien)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const bordjesSchema = z.object({
  // Labels on the four spinning plates. The plate at `fallingIndex` is the
  // one that wobbles, falls in the hook and gets a nudge from Buddy later.
  plates: z.array(z.string()).length(4),
  fallingIndex: z.number().int().min(0).max(3),
  hook: z.object({
    headline: z.string(),
    noticeTitle: z.string(),
    noticeLine: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    forwardButton: z.string(),
  }),
  remind: z.object({
    headline: z.string(),
    subline: z.string(),
    eventDay: z.string(),
    eventDate: z.string(),
    eventTitle: z.string(),
    eventLine: z.string(),
  }),
  // The bill that falls in scene 1 and is forwarded in scene 2.
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
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
    remind: z.number().min(3.4).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type BordjesProps = z.infer<typeof bordjesSchema>;

export const defaultBordjesProps: BordjesProps = {
  plates: ["Huur", "Zorg", "Energie", "Telefoon"],
  fallingIndex: 2,
  hook: {
    headline: "Alle bordjes hooghouden?\nEr valt er altijd één.",
    noticeTitle: "Aanmaning",
    noticeLine: "Energieleverancier · €87,60",
    costChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door\nnaar Buddy.",
    subline: "Buddy leest het bedrag\nen de vervaldatum.",
    forwardButton: "Doorsturen",
  },
  remind: {
    headline: "Wiebelt hij? Dan staat\nhet in je agenda.",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
    eventDay: "MA",
    eventDate: "14",
    eventTitle: "Herinnering · Energie €87,60",
    eventLine: "Vervalt do 17 dec",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van december",
    amount: "€87,60",
    due: "vervalt do 17 dec",
  },
  cta: {
    tagline: "Alles draait.\nNiks valt.",
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
    remind: 4.0,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const bordjesFrames = (t: BordjesProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    forward: f(t.forward),
    remind: f(t.remind),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const bordjesTotal = (t: BordjesProps["timing"]) => {
  const s = bordjesFrames(t);
  return s.hook + s.forward + s.remind + s.cta - 3 * s.transition;
};
