import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 55 · "Geheugen lekt? Buddy niet." (zeef)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const zeefSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // Paper slips that sit in the sieve; the LAST one slips through.
    slips: z.array(z.string()).length(4),
    slipAmount: z.string(),
    noticeSubject: z.string(),
    noticeDue: z.string(),
    fee: z.string(),
  }),
  sift: z.object({
    headline: z.string(),
    subline: z.string(),
    forwardButton: z.string(),
    // What stays in the sieve after shaking.
    keepDue: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    month: z.string(),
    // Seven day labels, Monday first, plus the date number for each.
    days: z.array(z.string()).length(7),
    dates: z.array(z.string()).length(7),
    dueIndex: z.number().int().min(0).max(6),
    remindIndex: z.number().int().min(0).max(6),
    dueLabel: z.string(),
    remindLabel: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
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
    sift: z.number().min(3).max(8),
    agenda: z.number().min(3).max(8),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type ZeefProps = z.infer<typeof zeefSchema>;

export const defaultZeefProps: ZeefProps = {
  hook: {
    headline: "Geheugen als\neen zeef?",
    slips: ["Telefoon", "Huur", "Zorg", "Energie"],
    slipAmount: "€87,60",
    noticeSubject: "Aanmaning",
    noticeDue: "Te laat",
    fee: "Kan uitlopen op €40",
  },
  sift: {
    headline: "Stuur hem door\nnaar Buddy.",
    subline: "Bedrag en vervaldatum blijven liggen.\nDe rest doet niet mee.",
    forwardButton: "Doorsturen",
    keepDue: "Vervalt vr 18 dec",
  },
  agenda: {
    headline: "Buddy zet hem\nin je agenda.",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
    month: "December",
    days: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    dates: ["14", "15", "16", "17", "18", "19", "20"],
    dueIndex: 4,
    remindIndex: 1,
    dueLabel: "Energie",
    remindLabel: "Herinnering",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van december",
    amount: "€87,60",
  },
  cta: {
    tagline: "Geheugen lekt?\nBuddy niet.",
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
    sift: 3.8,
    agenda: 3.8,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const zeefFrames = (t: ZeefProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    sift: f(t.sift),
    agenda: f(t.agenda),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const zeefTotal = (t: ZeefProps["timing"]) => {
  const s = zeefFrames(t);
  return s.hook + s.sift + s.agenda + s.cta - 3 * s.transition;
};
