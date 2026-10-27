import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 26 · "Eng was hij alleen in het donker." (de mail die je niet durft te openen)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const spookSchema = z.object({
  // The unopened mail: it returns in every scene.
  mail: z.object({
    sender: z.string(),
    subject: z.string(),
    preview: z.string(),
    age: z.string(),
    forward: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    // Whispers that float around the monster shadow.
    whispers: z.array(z.string()).length(3),
  }),
  peek: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  light: z.object({
    headline: z.string(),
    subline: z.string(),
    amount: z.string(),
    due: z.string(),
    // Three calendar tiles: two reminder mails and the due date.
    tiles: z
      .array(
        z.object({
          day: z.string(),
          month: z.string(),
          label: z.string(),
        }),
      )
      .length(3),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
    tagline: z.string(),
    boo: z.string(),
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
    peek: z.number().min(3.6).max(8),
    light: z.number().min(3.6).max(10),
    cta: z.number().min(3.2).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type SpookProps = z.infer<typeof spookSchema>;

export const defaultSpookProps: SpookProps = {
  mail: {
    sender: "Energieleverancier",
    subject: "Je eindafrekening",
    preview: "Bekijk hier het bedrag en de datum waarop…",
    age: "3 wk",
    forward: "Doorsturen",
  },
  hook: {
    headline: "Die ene mail die je\nniet durft te openen.",
    whispers: ["Hoeveel?", "Aanmaning?", "Te laat?"],
  },
  peek: {
    headline: "Stuur hem door.\nBuddy kijkt wel.",
    subline: "Hij haalt er het bedrag\nen de vervaldatum uit.",
  },
  light: {
    headline: "Licht aan.\nValt reuze mee.",
    subline: "Hij mailt je 7 en 2 dagen vooraf.\nEn het staat in je agenda.",
    amount: "€86,40",
    due: "Vervalt 24 nov",
    tiles: [
      { day: "17", month: "nov", label: "mail" },
      { day: "22", month: "nov", label: "mail" },
      { day: "24", month: "nov", label: "agenda" },
    ],
  },
  cta: {
    tagline: "Eng was hij alleen\nin het donker.",
    boo: "boe!",
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
    peek: 3.8,
    light: 4.2,
    cta: 3.8,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const spookFrames = (t: SpookProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    peek: f(t.peek),
    light: f(t.light),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const spookTotal = (t: SpookProps["timing"]) => {
  const s = spookFrames(t);
  return s.hook + s.peek + s.light + s.cta - 3 * s.transition;
};
