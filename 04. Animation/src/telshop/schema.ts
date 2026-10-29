import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 28 · "Niet bellen. Gewoon doorsturen." (telshop-parodie)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const telshopSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // Small "re-enacted" label in the corner, like a real infomercial.
    reenacted: z.string(),
    // Labels on the grey envelope stack that topples over.
    envelopes: z.array(z.string()).length(5),
    reminder: z.string(),
    // Starburst sticker; keep "kan" (€40 only after a 14-day letter).
    burst: z.string(),
  }),
  demo: z.object({
    headline: z.string(),
    subline: z.string(),
    forward: z.string(),
    forwarded: z.string(),
    toLabel: z.string(),
    address: z.string(),
    burst: z.string(),
  }),
  more: z.object({
    headline: z.string(),
    month: z.string(),
    // Day numbers in the calendar: two mail days and the due day.
    mailDays: z.array(z.number().int().min(1).max(30)).length(2),
    dueDay: z.number().int().min(1).max(30),
    dueLabel: z.string(),
    notify7: z.string(),
    notify2: z.string(),
    burst: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  cta: z.object({
    // The infomercial bar that Buddy stamps out.
    callBar: z.string(),
    // First line white, the rest soft blue.
    tagline: z.string(),
    button: z.string(),
    // Two starbursts next to each other under the button.
    bursts: z.array(z.string()).length(2),
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
    demo: z.number().min(3.6).max(10),
    more: z.number().min(3.4).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type TelshopProps = z.infer<typeof telshopSchema>;

export const defaultTelshopProps: TelshopProps = {
  hook: {
    headline: "Ken je dit?",
    reenacted: "Nagespeeld",
    envelopes: ["Huur", "Energie", "Zorg", "Telefoon", "Gemeente"],
    reminder: "Aanmaning",
    burst: "Kan uitlopen\nop €40!",
  },
  demo: {
    headline: "Kijk. Je stuurt\nhem gewoon door.",
    subline: "Buddy haalt er bedrag\nen vervaldatum uit.",
    forward: "Doorsturen",
    forwarded: "Doorgestuurd",
    toLabel: "Aan",
    address: "jij@in.betaalbuddy.nl",
    burst: "Zo simpel!",
  },
  more: {
    headline: "Maar wacht.\nEr is meer!",
    month: "November",
    mailDays: [17, 22],
    dueDay: 24,
    dueLabel: "In je agenda",
    notify7: "Nog 7 dagen · €112,40",
    notify2: "Nog 2 dagen · vervalt 24 nov",
    burst: "7 en 2 dagen\nvooraf!",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€112,40",
    due: "Vervalt 24 nov",
  },
  cta: {
    callBar: "Bel nu!",
    tagline: "Niet bellen.\nGewoon doorsturen.",
    button: "activeer buddy",
    bursts: ["Geen\napp!", "Geen bank-\nkoppeling!"],
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
    demo: 4.4,
    more: 4.2,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const telshopFrames = (t: TelshopProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    demo: f(t.demo),
    more: f(t.more),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const telshopTotal = (t: TelshopProps["timing"]) => {
  const s = telshopFrames(t);
  return s.hook + s.demo + s.more + s.cta - 3 * s.transition;
};
