import { z } from "zod";
import { decColorsSchema, defaultDecColors, FPS } from "../common";

// Idee 15 · "Aftellen naar 2027" (Reel)
// Alles hieronder is bewerkbaar in Remotion Studio (Props-paneel).
// Tip: "\n" in een kop of subregel forceert een regelafbreking.

const monthItem = z.object({
  day: z.number().int().min(1).max(31), // dag in januari
  label: z.string(),
});

export const aftellenSchema = z.object({
  count: z.object({
    headline: z.string(),
    // Rekeningen die langsflitsen, bij 10, 9, 8 ... 1. Bij 0 komt er geen rekening.
    bills: z.array(z.string()).length(10),
    cardSub: z.string(),
    flagFar: z.string(),
    flagNear: z.string(),
  }),
  january: z.object({
    headline: z.string(),
    subline: z.string(),
    month: z.string(),
    weekdays: z.array(z.string()).length(7),
    // Vier rekeningen in januari; de vlaggetjes komen 7 en 2 dagen eerder.
    items: z.array(monthItem).length(4),
    flagFar: z.string(),
    flagNear: z.string(),
  }),
  cta: z.object({
    // Eerste regel wit, de rest zacht blauw.
    headline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  colors: decColorsSchema,
  timing: z.object({
    count: z.number().min(3).max(9),
    january: z.number().min(3.6).max(9),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type AftellenProps = z.infer<typeof aftellenSchema>;

export const defaultAftellenProps: AftellenProps = {
  count: {
    headline: "Aftellen naar 2027",
    bills: [
      "Huur",
      "Zorgpremie",
      "Webshop achteraf",
      "Abonnement",
      "Energieleverancier",
      "Telefoonprovider",
      "Sportschool",
      "Gemeente",
      "Verzekeraar",
      "Internetprovider",
    ],
    cardSub: "Staat al in je agenda",
    flagFar: "7",
    flagNear: "2",
  },
  january: {
    headline: "Bij nul geen knal.\nGewoon een rustige agenda.",
    subline: "Elke rekening staat er al, met\nseintjes 7 en 2 dagen vooraf.",
    month: "Januari 2027",
    weekdays: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    items: [
      { day: 4, label: "Huur" },
      { day: 14, label: "Zorgpremie" },
      { day: 22, label: "Webshop" },
      { day: 30, label: "Abonnement" },
    ],
    flagFar: "7",
    flagNear: "2",
  },
  cta: {
    headline: "Dit jaar knalt\nalleen het vuurwerk.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: defaultDecColors,
  timing: { count: 5.0, january: 4.6, cta: 4.6, transition: 0.4 },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const aftellenFrames = (t: AftellenProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return { count: f(t.count), january: f(t.january), cta: f(t.cta), transition: f(t.transition) };
};

export const aftellenTotal = (t: AftellenProps["timing"]) => {
  const s = aftellenFrames(t);
  return s.count + s.january + s.cta - 2 * s.transition;
};
