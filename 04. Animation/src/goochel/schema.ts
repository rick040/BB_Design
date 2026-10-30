import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 29 · "Geen truc. Gewoon op tijd." (goochelshow)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const goochelSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // The bill that vanishes into the hat...
    billSender: z.string(),
    billSubject: z.string(),
    billAmount: z.string(),
    poof: z.string(),
    // ...and comes back out of it as a reminder letter.
    reminderLabel: z.string(),
    reminderSender: z.string(),
    costChip: z.string(),
    subline: z.string(),
  }),
  hat: z.object({
    headline: z.string(),
    forwardedChip: z.string(),
    // Chips Buddy pulls out of the hat like a string of scarves.
    chips: z.array(z.string()).length(3),
    subline: z.string(),
  }),
  predict: z.object({
    headline: z.string(),
    envelopeLabel: z.string(),
    rows: z
      .array(
        z.object({
          date: z.string(),
          text: z.string(),
        }),
      )
      .length(3),
    subline: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
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
    hat: z.number().min(2.6).max(8),
    predict: z.number().min(3).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type GoochelProps = z.infer<typeof goochelSchema>;

export const defaultGoochelProps: GoochelProps = {
  hook: {
    headline: "De verdwijntruc\nvan je rekening.",
    billSender: "Energieleverancier",
    billSubject: "Je eindafrekening",
    billAmount: "€86,40",
    poof: "Poef. Weg.",
    reminderLabel: "Aanmaning",
    reminderSender: "Energieleverancier",
    costChip: "Kan uitlopen op €40",
    subline: "Uit het oog.\nMaar niet uit de wereld.",
  },
  hat: {
    headline: "De volgende?\nStuur hem door.",
    forwardedChip: "Doorgestuurd",
    chips: ["€138,50", "Vervalt 24 nov", "Kenmerk"],
    subline: "Buddy haalt er bedrag\nen vervaldatum uit.",
  },
  predict: {
    headline: "Buddy voorspelt\nje seintjes.",
    envelopeLabel: "Voorspelling",
    rows: [
      { date: "17 nov", text: "Mail: nog 7 dagen" },
      { date: "22 nov", text: "Mail: nog 2 dagen" },
      { date: "24 nov", text: "In je agenda" },
    ],
    subline: "7 en 2 dagen vooraf in je mail.\nDe vervaldatum in je agenda.",
  },
  bill: {
    sender: "Zorgverzekeraar",
    subject: "Premie november",
  },
  cta: {
    tagline: "Geen truc.\nGewoon op tijd.",
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
    hat: 3.6,
    predict: 4.2,
    cta: 3.8,
    transition: 0.5,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const goochelFrames = (t: GoochelProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    hat: f(t.hat),
    predict: f(t.predict),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const goochelTotal = (t: GoochelProps["timing"]) => {
  const s = goochelFrames(t);
  return s.hook + s.hat + s.predict + s.cta - 3 * s.transition;
};
