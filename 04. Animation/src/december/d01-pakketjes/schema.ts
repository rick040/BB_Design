import { z } from "zod";
import { decColorsSchema, defaultDecColors, FPS } from "../common";

// Idee 1 · "Eén dag gekocht, negen dagen betalen" (Reel)
// Elk veld is bewerkbaar in Remotion Studio. "\n" in een kop of subregel = nieuwe regel.

export const pakketjesSchema = z.object({
  hook: z.object({
    headline: z.string(),
    month: z.string(),
    weekday: z.string(),
    day: z.string(),
  }),
  spread: z.object({
    headline: z.string(),
    subline: z.string(),
    monthLabel: z.string(),
    weekdays: z.array(z.string()).length(7),
    // Kolom van de 1e dag van de maand (0 = maandag). 1 december 2026 is een dinsdag.
    startCol: z.number().min(0).max(6),
    days: z.number().min(28).max(31),
    // Negen is een voorbeeld in beeld, geen statistiek. Laatste dag minus 2 moet in de maand vallen.
    payDays: z.array(z.number().min(8).max(31)).length(9),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    sender: z.string(),
    subject: z.string(),
    button: z.string(),
    legend7: z.string(),
    legend2: z.string(),
  }),
  cta: z.object({
    headline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  colors: decColorsSchema,
  timing: z.object({
    hook: z.number().min(2.6).max(8),
    spread: z.number().min(3.4).max(9),
    forward: z.number().min(3.8).max(9),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type PakketjesProps = z.infer<typeof pakketjesSchema>;

export const defaultPakketjesProps: PakketjesProps = {
  hook: {
    headline: "Gekocht op\neén dag.",
    month: "november",
    weekday: "vrijdag",
    day: "27",
  },
  spread: {
    headline: "Betalen op\nnegen dagen.",
    subline: "Elk pakketje krijgt zijn eigen betaaldag.",
    monthLabel: "december",
    weekdays: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    startCol: 1,
    days: 31,
    payDays: [9, 11, 14, 17, 21, 23, 25, 28, 30],
  },
  forward: {
    headline: "Stuur ze door.\nBuddy plant ze in.",
    subline: "Seintje 7 en 2 dagen vooraf,\nin je agenda.",
    sender: "Webshop",
    subject: "Betaalverzoek voor je bestelling",
    button: "Doorsturen",
    legend7: "7 dagen vooraf",
    legend2: "2 dagen vooraf",
  },
  cta: {
    headline: "Stuur ze door en\ngeniet van je spullen.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: defaultDecColors,
  timing: { hook: 3.4, spread: 4.4, forward: 4.8, cta: 3.6, transition: 0.4 },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const pakketjesFrames = (t: PakketjesProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return { hook: f(t.hook), spread: f(t.spread), forward: f(t.forward), cta: f(t.cta), transition: f(t.transition) };
};

export const pakketjesTotal = (t: PakketjesProps["timing"]) => {
  const s = pakketjesFrames(t);
  return s.hook + s.spread + s.forward + s.cta - 3 * s.transition;
};
