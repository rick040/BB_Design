import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 30 · "Vaste lasten. Geen handleiding." (montagehandleiding)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const handleidingSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // The four "parts" of living on your own, numbered like an exploded view.
    // The third one falls off and turns into the reminder card.
    parts: z.array(z.string()).length(4),
    sheetTitle: z.string(),
    missing: z.string(),
    reminder: z.string(),
    reminderSender: z.string(),
    cost: z.string(),
  }),
  parts: z.object({
    headline: z.string(),
    // Letter in the callout next to Buddy (part "A" on the sheet).
    partLabel: z.string().max(2),
    // Parts list: "1x Buddy" etc. A count of 0 is drawn struck through.
    list: z
      .array(
        z.object({
          count: z.number().int().min(0).max(9),
          name: z.string(),
        }),
      )
      .length(4),
  }),
  steps: z.object({
    headline: z.string(),
    step1: z.string(),
    step2: z.string(),
    step3: z.string(),
    forwardLabel: z.string(),
    reminder7: z.string(),
    reminder2: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    amount: z.string(),
    due: z.string(),
    // Day number on the little calendar in step 3.
    dueDay: z.string(),
    dueMonth: z.string(),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
    tagline: z.string(),
    button: z.string(),
    subline: z.string(),
    sheetLabel: z.string(),
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
    parts: z.number().min(2.6).max(8),
    steps: z.number().min(4).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type HandleidingProps = z.infer<typeof handleidingSchema>;

export const defaultHandleidingProps: HandleidingProps = {
  hook: {
    headline: "Vaste lasten.\nGeen handleiding.",
    parts: ["Huur", "Energie", "Zorg", "Telefoon"],
    sheetTitle: "Op jezelf wonen",
    missing: "Onderdeel kwijt",
    reminder: "Aanmaning",
    reminderSender: "Zorgverzekeraar",
    cost: "kan uitlopen op €40",
  },
  parts: {
    headline: "Het onderdeel\ndat je mist:",
    partLabel: "A",
    list: [
      { count: 1, name: "Buddy" },
      { count: 1, name: "doorstuuradres" },
      { count: 0, name: "app" },
      { count: 0, name: "bankkoppeling" },
    ],
  },
  steps: {
    headline: "Zo zet je het\nin elkaar.",
    step1: "Stuur je rekening\ndoor naar Buddy",
    step2: "Buddy leest bedrag\nen vervaldatum",
    step3: "Seintje 7 en 2 dagen\nvooraf. In je agenda.",
    forwardLabel: "Doorsturen",
    reminder7: "nog 7 dagen",
    reminder2: "nog 2 dagen",
  },
  bill: {
    sender: "Zorgverzekeraar",
    amount: "€112,40",
    due: "Vervalt 1 dec",
    dueDay: "1",
    dueMonth: "dec",
  },
  cta: {
    tagline: "Klaar.\nZonder gereedschap.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
    sheetLabel: "Handleiding",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.red,
  },
  timing: {
    hook: 3.2,
    parts: 3.4,
    steps: 5.0,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const handleidingFrames = (t: HandleidingProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    parts: f(t.parts),
    steps: f(t.steps),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const handleidingTotal = (t: HandleidingProps["timing"]) => {
  const s = handleidingFrames(t);
  return s.hook + s.parts + s.steps + s.cta - 3 * s.transition;
};
