import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 35 · "Niet ongeveer. Precies." (dartbord)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const dartsSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // Your own vague guesses, written on the tags of the darts that miss.
    guessNear: z.string(),
    guessMiss: z.string(),
    alertTitle: z.string(),
    alertText: z.string(),
    subline: z.string(),
  }),
  aim: z.object({
    headline: z.string(),
    forwardedChip: z.string(),
    subline: z.string(),
  }),
  // The one bill used throughout the ad.
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    dueLabel: z.string(),
    // Short date on the bullseye and on Buddy's dart.
    dueShort: z.string(),
  }),
  hits: z.object({
    headline: z.string(),
    // Outer ring, middle ring, bullseye.
    chips: z
      .array(
        z.object({
          date: z.string(),
          text: z.string(),
        }),
      )
      .length(3),
  }),
  cta: z.object({
    // First line white, the rest soft blue.
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
    aim: z.number().min(2.8).max(8),
    hits: z.number().min(3.6).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type DartsProps = z.infer<typeof dartsSchema>;

export const defaultDartsProps: DartsProps = {
  hook: {
    headline: "Ongeveer op tijd\nis te laat.",
    guessNear: "rond de 20e?",
    guessMiss: "eind van de maand?",
    alertTitle: "Aanmaning",
    alertText: "Telefoonprovider · vervallen",
    subline: "Hij moest op 21 november.",
  },
  aim: {
    headline: "Stuur hem door.\nBuddy mikt.",
    forwardedChip: "Doorgestuurd naar Buddy",
    subline: "Hij leest het bedrag\nen de vervaldatum.",
  },
  bill: {
    sender: "Telefoonprovider",
    subject: "Factuur november",
    amount: "€42,50",
    dueLabel: "Vervalt 21 nov",
    dueShort: "21 nov",
  },
  hits: {
    headline: "Buddy gooit raak.\nDrie keer.",
    chips: [
      { date: "14 nov", text: "Mail: nog 7 dagen" },
      { date: "19 nov", text: "Mail: nog 2 dagen" },
      { date: "21 nov", text: "In je agenda" },
    ],
  },
  cta: {
    tagline: "Niet ongeveer.\nPrecies.",
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
    aim: 3.6,
    hits: 4.4,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const dartsFrames = (t: DartsProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    aim: f(t.aim),
    hits: f(t.hits),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const dartsTotal = (t: DartsProps["timing"]) => {
  const s = dartsFrames(t);
  return s.hook + s.aim + s.hits + s.cta - 3 * s.transition;
};
