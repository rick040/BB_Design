import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 27 · "Buddy loopt mee. Jij finisht." (estafette)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const estafetteSchema = z.object({
  // The one bill that is handed over as a baton (scenes 2 and 3).
  bill: z.object({
    sender: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    // Batons in the runner's arms, bottom to top. The top one falls.
    batons: z.array(z.string()).length(4),
    alertChip: z.string(),
    subline: z.string(),
  }),
  wissel: z.object({
    headline: z.string(),
    forwardTag: z.string(),
    forwardedTag: z.string(),
    zoneLabel: z.string(),
    subline: z.string(),
  }),
  score: z.object({
    headline: z.string(),
    // Scoreboard rows: date + what happens. Last row is the due date.
    rows: z
      .array(
        z.object({
          date: z.string(),
          text: z.string(),
        }),
      )
      .length(3),
    handbackTag: z.string(),
    subline: z.string(),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
    tagline: z.string(),
    medal: z.string(),
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
    wissel: z.number().min(3.4).max(8),
    score: z.number().min(3.6).max(8),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type EstafetteProps = z.infer<typeof estafetteSchema>;

export const defaultEstafetteProps: EstafetteProps = {
  bill: {
    sender: "Zorgverzekeraar",
    amount: "€142,75",
    due: "24 nov",
  },
  hook: {
    headline: "Jij rent met\nalle rekeningen.",
    batons: ["Huur", "Energie", "Telefoon", "Zorg"],
    alertChip: "Aanmaning",
    subline: "Laat je er één vallen, dan kan dat\nuitlopen op €40 incassokosten.",
  },
  wissel: {
    headline: "Geef het stokje\ndoor aan Buddy.",
    forwardTag: "Doorsturen",
    forwardedTag: "Doorgestuurd",
    zoneLabel: "WISSELVAK",
    subline: "Buddy leest het bedrag\nen de vervaldatum.",
  },
  score: {
    headline: "Buddy houdt de\ntijd voor je bij.",
    rows: [
      { date: "17 NOV", text: "Mail: nog 7 dagen" },
      { date: "22 NOV", text: "Mail: nog 2 dagen" },
      { date: "24 NOV", text: "Vervaldatum, in je agenda" },
    ],
    handbackTag: "Jij betaalt",
    subline: "Hij mailt je 7 en 2 dagen vooraf.\nEn het staat in je agenda.",
  },
  cta: {
    tagline: "Buddy loopt mee.\nJij finisht.",
    medal: "op tijd",
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
    wissel: 4.2,
    score: 4.4,
    cta: 3.8,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const estafetteFrames = (t: EstafetteProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    wissel: f(t.wissel),
    score: f(t.score),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const estafetteTotal = (t: EstafetteProps["timing"]) => {
  const s = estafetteFrames(t);
  return s.hook + s.wissel + s.score + s.cta - 3 * s.transition;
};
