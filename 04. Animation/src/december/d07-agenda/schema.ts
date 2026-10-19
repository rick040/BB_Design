import { z } from "zod";
import { decColorsSchema, defaultDecColors, FPS } from "../common";

// Idee 7 · "De volle decemberagenda" (Reel)
// Elk veld is bewerkbaar in Remotion Studio. "\n" in een kop of subregel = nieuwe regel.
// In labels mag ­ (zacht afbreekstreepje) staan voor lange woorden.

const weekDay = z.object({ name: z.string(), num: z.string() });
// tone: 0 blauw, 1 diepblauw, 2 zachtblauw, 3 licht met blauwe tekst
const weekEvent = z.object({
  day: z.number().min(0).max(6),
  slot: z.number().min(0).max(5),
  len: z.number().min(1).max(4),
  label: z.string(),
  tone: z.number().min(0).max(3),
});

export const agendaSchema = z.object({
  hook: z.object({
    headline: z.string(),
  }),
  week: z.object({
    days: z.array(weekDay).length(7),
    allDayLabel: z.string(),
    events: z.array(weekEvent),
    // Het blokje dat van het scherm wordt geduwd en de gebeurtenis die het wegduwt.
    premium: z.object({ label: z.string(), day: z.number().min(0).max(6), slot: z.number().min(0).max(4) }),
    pusher: z.object({ label: z.string(), tone: z.number().min(0).max(3) }),
  }),
  catch: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  cta: z.object({
    headline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  colors: decColorsSchema,
  timing: z.object({
    hook: z.number().min(2.6).max(8),
    catch: z.number().min(3).max(8),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type AgendaProps = z.infer<typeof agendaSchema>;

export const defaultAgendaProps: AgendaProps = {
  hook: { headline: "Je agenda\nin december." },
  week: {
    days: [
      { name: "ma", num: "14" },
      { name: "di", num: "15" },
      { name: "wo", num: "16" },
      { name: "do", num: "17" },
      { name: "vr", num: "18" },
      { name: "za", num: "19" },
      { name: "zo", num: "20" },
    ],
    allDayLabel: "hele dag",
    events: [
      { day: 0, slot: 0, len: 2, label: "Werk", tone: 1 },
      { day: 0, slot: 3, len: 1, label: "Sporten", tone: 2 },
      { day: 0, slot: 4, len: 2, label: "Borrel", tone: 0 },
      { day: 1, slot: 0, len: 2, label: "Werk", tone: 1 },
      { day: 1, slot: 3, len: 2, label: "Lootjes", tone: 3 },
      { day: 1, slot: 5, len: 1, label: "Kerst­lunch", tone: 2 },
      { day: 2, slot: 0, len: 2, label: "Werk", tone: 1 },
      { day: 2, slot: 2, len: 1, label: "Cadeaus", tone: 3 },
      { day: 3, slot: 0, len: 2, label: "Werk", tone: 1 },
      { day: 3, slot: 2, len: 2, label: "Kerst­diner", tone: 0 },
      { day: 3, slot: 5, len: 1, label: "Boodschappen", tone: 3 },
      { day: 4, slot: 0, len: 2, label: "Werk", tone: 1 },
      { day: 4, slot: 3, len: 2, label: "Kerst­borrel", tone: 0 },
      { day: 4, slot: 5, len: 1, label: "Sporten", tone: 2 },
      { day: 5, slot: 1, len: 3, label: "Kerst­markt", tone: 0 },
      { day: 5, slot: 4, len: 2, label: "Inpakken", tone: 2 },
      { day: 6, slot: 1, len: 2, label: "Brunch", tone: 3 },
      { day: 6, slot: 4, len: 2, label: "Kerst­film", tone: 1 },
      { day: 0, slot: 2, len: 1, label: "Lunch", tone: 3 },
      { day: 1, slot: 2, len: 1, label: "Bellen", tone: 2 },
      { day: 2, slot: 5, len: 1, label: "Yoga", tone: 2 },
      { day: 3, slot: 4, len: 1, label: "Kapper", tone: 3 },
      { day: 4, slot: 2, len: 1, label: "Lunch", tone: 2 },
      { day: 5, slot: 0, len: 1, label: "Uitslapen", tone: 3 },
      { day: 6, slot: 0, len: 1, label: "Bellen", tone: 2 },
      { day: 6, slot: 3, len: 1, label: "Wandelen", tone: 3 },
    ],
    premium: { label: "Zorg­premie", day: 2, slot: 3 },
    pusher: { label: "Diner schoon­familie", tone: 0 },
  },
  catch: {
    headline: "Buddy vangt\nhet op.",
    subline: "Hele dag in je agenda,\nseintje 7 en 2 dagen vooraf.",
  },
  cta: {
    headline: "Vol? Buddy maakt\nnog plek.",
    button: "activeer buddy",
    subline: "Stuur je rekening door.\nGeen app. Geen bankkoppeling.",
  },
  colors: defaultDecColors,
  timing: { hook: 4.2, catch: 4.6, cta: 4.2, transition: 0.4 },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const agendaFrames = (t: AgendaProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return { hook: f(t.hook), catch: f(t.catch), cta: f(t.cta), transition: f(t.transition) };
};

export const agendaTotal = (t: AgendaProps["timing"]) => {
  const s = agendaFrames(t);
  return s.hook + s.catch + s.cta - 2 * s.transition;
};
