import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 42 · "Tante Ria op tijd. Je rekening ook." (verjaardagskalender)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

const calendarRow = z.object({
  day: z.string(),
  // Leave empty for a blank line on the calendar.
  name: z.string(),
});

export const verjaardagSchema = z.object({
  calendar: z.object({
    title: z.string(),
    month: z.string(),
    // Shown top to bottom. The row whose day equals `matchDay` gets the ring.
    rows: z.array(calendarRow).length(6),
    matchDay: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    // Line 1 is on screen from frame 0, line 2 is the twist.
    line1: z.string(),
    line2: z.string(),
    overdue: z.string(),
  }),
  insight: z.object({
    headline: z.string(),
    subline: z.string(),
    doorSign: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    forward: z.string(),
    month: z.string(),
    dayLabel: z.string(),
    birthdayItem: z.string(),
    birthdayMeta: z.string(),
    billItem: z.string(),
    billMeta: z.string(),
    // Mail reminders, oldest first (T-7, then T-2).
    reminders: z
      .array(z.object({ text: z.string(), time: z.string() }))
      .length(2),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
    tagline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  // What Buddy's party horn says.
  toot: z.string(),
  colors: z.object({
    blue: zColor(),
    light: zColor(),
    softBlue: zColor(),
    bodyOnBlue: zColor(),
    alert: zColor(),
  }),
  timing: z.object({
    hook: z.number().min(2.8).max(8),
    insight: z.number().min(2.6).max(8),
    agenda: z.number().min(4).max(10),
    cta: z.number().min(3.2).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type VerjaardagProps = z.infer<typeof verjaardagSchema>;

export const defaultVerjaardagProps: VerjaardagProps = {
  calendar: {
    title: "Verjaardagen",
    month: "December",
    rows: [
      { day: "15", name: "" },
      { day: "16", name: "Opa Kees" },
      { day: "17", name: "" },
      { day: "18", name: "Tante Ria" },
      { day: "19", name: "" },
      { day: "20", name: "Sanne" },
    ],
    matchDay: "18",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van december",
    amount: "€87,60",
    due: "Vervalt 18 dec",
  },
  hook: {
    line1: "Verjaardagen\nvergeet je nooit.",
    line2: "Je rekeningen wel.",
    overdue: "Aanmaning",
  },
  insight: {
    headline: "Logisch.\nDie hangt op de wc.",
    subline: "Wat je elke dag ziet,\nvergeet je niet.",
    doorSign: "WC",
  },
  agenda: {
    headline: "Stuur hem door.\nBuddy zet hem erbij.",
    subline: "In je agenda. Plus een mail\n7 en 2 dagen vooraf.",
    forward: "Doorsturen",
    month: "Agenda",
    dayLabel: "do 18 dec",
    birthdayItem: "Tante Ria jarig",
    birthdayMeta: "hele dag",
    billItem: "Energie · €87,60",
    billMeta: "vervaldatum",
    reminders: [
      { text: "Nog 7 dagen · Energie €87,60", time: "11 dec" },
      { text: "Nog 2 dagen · betaal op tijd", time: "16 dec" },
    ],
  },
  cta: {
    tagline: "Tante Ria op tijd.\nJe rekening ook.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  toot: "toet!",
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.red,
  },
  timing: {
    hook: 3.4,
    insight: 3.0,
    agenda: 4.6,
    cta: 3.8,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const verjaardagFrames = (t: VerjaardagProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    insight: f(t.insight),
    agenda: f(t.agenda),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const verjaardagTotal = (t: VerjaardagProps["timing"]) => {
  const s = verjaardagFrames(t);
  return s.hook + s.insight + s.agenda + s.cta - 3 * s.transition;
};
