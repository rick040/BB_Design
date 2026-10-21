import { z } from "zod";
import { decColorsSchema, defaultDecColors, FPS } from "../common";

// Idee 16 · "Een voornemen in 30 seconden" (Reel + Story-poll).
// Alle teksten zijn props in Remotion Studio. `\n` zet een regelafbreking.
// De 30 seconden slaan op één mail doorsturen, niet op de aanmelding.

const goal = z.object({
  label: z.string(),
  pct: z.number().min(0).max(100),
});

export const voornemenSchema = z.object({
  /** De drie voornemens uit de hook. */
  goals: z.array(goal).length(3),
  hook: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  send: z.object({
    headline: z.string(),
    subline: z.string(),
    goalLabel: z.string(),
    sender: z.string(),
    subject: z.string(),
    due: z.string(),
    forwardLabel: z.string(),
    agendaTitle: z.string(),
    agendaSub: z.string(),
  }),
  thirty: z.object({
    headline: z.string(),
    subline: z.string(),
    steps: z.array(z.string()).length(3),
  }),
  cta: z.object({
    tagline: z.string(),
    goalLabel: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  colors: decColorsSchema,
  timing: z.object({
    hook: z.number().min(2.6).max(8),
    send: z.number().min(3.6).max(10),
    thirty: z.number().min(2.6).max(8),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type VoornemenProps = z.infer<typeof voornemenSchema>;

export const defaultVoornemenProps: VoornemenProps = {
  goals: [
    { label: "Sporten", pct: 3 },
    { label: "Minder scrollen", pct: 1 },
    { label: "Eerder naar bed", pct: 0 },
  ],
  hook: {
    headline: "Voornemens op\n4 januari.",
    subline: "Herkenbaar, toch?",
  },
  send: {
    headline: "Eén mail\ndoorsturen.",
    subline: "Buddy zet de datum met seintjes\nin je agenda.",
    goalLabel: "Rekeningen op tijd",
    sender: "Telefoonprovider",
    subject: "Je factuur van januari",
    due: "28 jan",
    forwardLabel: "Doorsturen",
    agendaTitle: "In je agenda",
    agendaSub: "Seintje 7 en 2 dagen vooraf",
  },
  thirty: {
    headline: "Het voornemen dat\nje in 30 seconden\nhaalt.",
    subline: "Eén mail. Meer niet.",
    steps: ["Open de mail", "Tik op doorsturen", "Klaar"],
  },
  cta: {
    tagline: "Het makkelijkste\nvoornemen van 2027.",
    goalLabel: "Rekeningen op tijd",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: { ...defaultDecColors },
  timing: {
    hook: 3.4,
    send: 4.8,
    thirty: 3.6,
    cta: 3.8,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const voornemenFrames = (t: VoornemenProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    send: f(t.send),
    thirty: f(t.thirty),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const voornemenTotal = (t: VoornemenProps["timing"]) => {
  const s = voornemenFrames(t);
  return s.hook + s.send + s.thirty + s.cta - 3 * s.transition;
};

// Story-poll (1080 × 1920): de vraag, de drie voornemens en ruimte voor de poll-sticker.
export const voornemenStorySchema = z.object({
  question: z.string(),
  goals: z.array(goal).length(3),
  hint: z.string(),
  chip: z.string(),
  colors: decColorsSchema,
});

export type VoornemenStoryProps = z.infer<typeof voornemenStorySchema>;

export const defaultVoornemenStoryProps: VoornemenStoryProps = {
  question: "Welk voornemen\nhoud jij het\nlangst vol?",
  goals: [
    { label: "Sporten", pct: 3 },
    { label: "Minder scrollen", pct: 1 },
    { label: "Eerder naar bed", pct: 0 },
  ],
  hint: "Rekeningen op tijd: één mail doorsturen.",
  chip: "Stuur door · seintje 7 en 2 dagen vooraf",
  colors: { ...defaultDecColors },
};
