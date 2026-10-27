import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 25 · "Vergeten? Dat is geschiedenis." (museum van vergeten rekeningen)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline, subline or plaque forces a line break.

const exhibit = z.object({
  // What is printed on the bill inside the frame.
  sender: z.string(),
  title: z.string(),
  // The museum plaque underneath.
  plaque: z.string(),
});

export const museumSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // Left, centre (the piece that gets the spotlight) and right.
    exhibits: z.array(exhibit).length(3),
    centreBadge: z.string(),
    sign: z.string(),
  }),
  exhibit: z.object({
    headline: z.string(),
    subline: z.string(),
    forwardTag: z.string(),
    plaqueBefore: z.string(),
    plaqueAfter: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    month: z.string(),
    // Weekday (1 = Monday … 7 = Sunday) of the 1st of the month, and its length.
    firstWeekday: z.number().int().min(1).max(7),
    daysInMonth: z.number().int().min(28).max(31),
    dueDay: z.number().int().min(1).max(31),
    // Reminder mails go out this many days before the due day.
    reminderDays: z.array(z.number().int().min(1).max(14)).length(2),
    reminderLabel: z.string(),
    plaque: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    title: z.string(),
    amount: z.string(),
    dueLabel: z.string(),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
    tagline: z.string(),
    signBefore: z.string(),
    signAfter: z.string(),
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
    exhibit: z.number().min(3.6).max(10),
    agenda: z.number().min(3.2).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type MuseumProps = z.infer<typeof museumSchema>;

export const defaultMuseumProps: MuseumProps = {
  hook: {
    headline: "Welkom in het museum\nvan vergeten rekeningen.",
    exhibits: [
      { sender: "Tandarts", title: "Nota", plaque: "Nota tandarts\nNooit geopend." },
      { sender: "Sportschool", title: "Aanmaning", plaque: "Aanmaning, 2026\nKan uitlopen op €40." },
      { sender: "Zorgverzekeraar", title: "Factuur", plaque: "Factuur\nLag onder de stapel." },
    ],
    centreBadge: "+ kosten",
    sign: "Niet aanraken",
  },
  exhibit: {
    headline: "Stuur je rekening\ndoor naar Buddy.",
    subline: "Buddy leest het bedrag\nen de vervaldatum.",
    forwardTag: "Doorsturen",
    plaqueBefore: "Nog niet betaald",
    plaqueAfter: "Uitgeleend aan je agenda",
  },
  agenda: {
    headline: "Hij mailt je 7 en 2\ndagen van tevoren.",
    subline: "En de vervaldatum\nstaat in je agenda.",
    month: "November",
    firstWeekday: 7,
    daysInMonth: 30,
    dueDay: 24,
    reminderDays: [7, 2],
    reminderLabel: "dagen",
    plaque: "Nu te zien: jouw agenda",
  },
  bill: {
    sender: "Energieleverancier",
    title: "Factuur november",
    amount: "€112,40",
    dueLabel: "Vervalt 24 nov",
  },
  cta: {
    tagline: "Vergeten? Dat is\ngeschiedenis.",
    signBefore: "Open",
    signAfter: "Gesloten",
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
    exhibit: 4.2,
    agenda: 3.8,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const museumFrames = (t: MuseumProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    exhibit: f(t.exhibit),
    agenda: f(t.agenda),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const museumTotal = (t: MuseumProps["timing"]) => {
  const s = museumFrames(t);
  return s.hook + s.exhibit + s.agenda + s.cta - 3 * s.transition;
};
