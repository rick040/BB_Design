import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 40 · "Buddy denkt eraan. Niks verdort." (kamerplanten)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const plantSchema = z.object({
  hook: z.object({
    headline: z.string(),
    subline: z.string(),
    // Labels on the three pots; the middle one wilts.
    pots: z.array(z.string()).length(3),
    // The label of the wilting pot flips to this one.
    alertLabel: z.string(),
    costChip: z.string(),
  }),
  stake: z.object({
    headline: z.string(),
    subline: z.string(),
    forwardedChip: z.string(),
  }),
  // The forwarded bill; it belongs to the middle pot.
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    duePrefix: z.string(),
    dueDate: z.string(),
  }),
  water: z.object({
    headline: z.string(),
    note7: z.string(),
    time7: z.string(),
    note2: z.string(),
    time2: z.string(),
    agendaChip: z.string(),
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
    stake: z.number().min(2.8).max(8),
    water: z.number().min(3.6).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type PlantProps = z.infer<typeof plantSchema>;

export const defaultPlantProps: PlantProps = {
  hook: {
    headline: "Rekeningen zijn\nnet kamerplanten.",
    subline: "Vergeet je er één,\ndan zie je het pas als het te laat is.",
    pots: ["Huur", "Energie", "Zorg"],
    alertLabel: "Aanmaning",
    costChip: "Kan uitlopen op €40",
  },
  stake: {
    headline: "Stuur hem door.\nBuddy prikt de datum.",
    subline: "Hij leest het bedrag\nen de vervaldatum.",
    forwardedChip: "Doorgestuurd naar Buddy",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€87,60",
    duePrefix: "Vervalt",
    dueDate: "18 dec",
  },
  water: {
    headline: "Hij geeft je op tijd\neen seintje.",
    note7: "Nog 7 dagen · €87,60",
    time7: "11 dec",
    note2: "Nog 2 dagen · betaal op tijd",
    time2: "16 dec",
    agendaChip: "18 dec staat in je agenda",
  },
  cta: {
    tagline: "Buddy denkt eraan.\nNiks verdort.",
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
    stake: 3.6,
    water: 4.4,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const plantFrames = (t: PlantProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    stake: f(t.stake),
    water: f(t.water),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const plantTotal = (t: PlantProps["timing"]) => {
  const s = plantFrames(t);
  return s.hook + s.stake + s.water + s.cta - 3 * s.transition;
};
