import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 37 · "Nu op jouw naam." (rotatie-idee N01, starters)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

const bill = z.object({
  sender: z.string(),
  amount: z.string(),
  // Short due date as it appears on the bill and in the agenda ("18 nov").
  due: z.string(),
  // Agenda row: day number and weekday of the due date.
  day: z.string(),
  weekday: z.string(),
});

export const naambordSchema = z.object({
  // The three bills that move to your name. Used in scene 1, 2 and 3.
  bills: z.array(bill).length(3),
  hook: z.object({
    // Line 1 is on screen from frame 0; line 2 appears after the peel.
    line1: z.string(),
    // Words of line 2 before the yellow label ("Nu op").
    line2Lead: z.string(),
    // Words of line 2 on the yellow label ("jouw naam.").
    line2Label: z.string(),
    // Name on the sticker that comes off the name plate.
    housemate: z.string(),
    // What is underneath on the plate.
    yourName: z.string(),
    // Yellow label that lands on each bill.
    ownLabel: z.string(),
    subline: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    // White label that lands on each bill when you forward it.
    forwardedLabel: z.string(),
    dueLabel: z.string(),
    subline: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    month: z.string(),
    mail7: z.string(),
    mail2: z.string(),
    subline: z.string(),
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
    hook: z.number().min(3).max(8),
    forward: z.number().min(3).max(8),
    agenda: z.number().min(3.6).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type NaambordProps = z.infer<typeof naambordSchema>;
export type NaambordBill = NaambordProps["bills"][number];

export const defaultNaambordProps: NaambordProps = {
  bills: [
    { sender: "Energieleverancier", amount: "€96,50", due: "18 nov", day: "18", weekday: "wo" },
    { sender: "Internetprovider", amount: "€44,99", due: "22 nov", day: "22", weekday: "zo" },
    { sender: "Gemeente", amount: "€61,20", due: "28 nov", day: "28", weekday: "za" },
  ],
  hook: {
    line1: "Je huisgenoot is weg.",
    line2Lead: "Nu op",
    line2Label: "jouw naam.",
    housemate: "DAAN",
    yourName: "Jouw naam",
    ownLabel: "op jouw naam",
    subline: "Drie rekeningen.\nDrie datums om te onthouden.",
  },
  forward: {
    headline: "Stuur ze door\nnaar Buddy.",
    forwardedLabel: "doorgestuurd",
    dueLabel: "Vervalt",
    subline: "Hij haalt bij elke rekening\nde vervaldatum eruit.",
  },
  agenda: {
    headline: "Buddy schrijft ze\nin je agenda.",
    month: "November",
    mail7: "Mail 7 dagen vooraf",
    mail2: "Mail 2 dagen vooraf",
    subline: "Jij betaalt. Buddy onthoudt.",
  },
  cta: {
    tagline: "Op jouw naam.\nIn jouw agenda.",
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
    hook: 3.6,
    forward: 3.6,
    agenda: 4.2,
    cta: 4.1,
    transition: 0.5,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const naambordFrames = (t: NaambordProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    forward: f(t.forward),
    agenda: f(t.agenda),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const naambordTotal = (t: NaambordProps["timing"]) => {
  const s = naambordFrames(t);
  return s.hook + s.forward + s.agenda + s.cta - 3 * s.transition;
};
