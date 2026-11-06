import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 48 · "Blader gerust. Buddy houdt de plek." (bladwijzer)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

const page = z.object({
  day: z.string(),
  entry: z.string(),
});

export const bladwijzerSchema = z.object({
  // The bill that gets skipped, forwarded and bookmarked.
  bill: z.object({
    sender: z.string(),
    title: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    // Agenda pages that flip past before and after the bill page.
    pagesBefore: z.array(page).length(2),
    // Day on the page where the bill lies (the page you skip).
    billDay: z.string(),
    pagesAfter: z.array(page).length(2),
    noticeTitle: z.string(),
    noticeChip: z.string(),
  }),
  mark: z.object({
    headline: z.string(),
    forwardLabel: z.string(),
    bookTitle: z.string(),
    dueChip: z.string(),
    subline: z.string(),
  }),
  flip: z.object({
    headline: z.string(),
    // Pages that flip past while you get on with your life.
    pages: z.array(page).length(4),
    reminderDay: z.string(),
    reminderLabel: z.string(),
    reminderNote: z.string(),
    subline: z.string(),
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
    hook: z.number().min(2.8).max(8),
    mark: z.number().min(3).max(8),
    flip: z.number().min(3.4).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type BladwijzerProps = z.infer<typeof bladwijzerSchema>;

export const defaultBladwijzerProps: BladwijzerProps = {
  bill: {
    sender: "Energieleverancier",
    title: "Rekening",
    amount: "€87,60",
    due: "vr 11 dec",
  },
  hook: {
    headline: "Die ene bladzijde\nsla je over.",
    pagesBefore: [
      { day: "ma 30 nov", entry: "Sporten 19:00" },
      { day: "wo 2 dec", entry: "Verjaardag Sam" },
    ],
    billDay: "do 3 dec",
    pagesAfter: [
      { day: "za 12 dec", entry: "Kerstinkopen" },
      { day: "do 17 dec", entry: "Etentje werk" },
    ],
    noticeTitle: "Aanmaning",
    noticeChip: "Kan uitlopen op €40",
  },
  mark: {
    headline: "Stuur hem door.\nBuddy is je bladwijzer.",
    forwardLabel: "Doorsturen",
    bookTitle: "december",
    dueChip: "vervalt vr 11 dec",
    subline: "Buddy leest bedrag en vervaldatum.",
  },
  flip: {
    headline: "Blader gerust door.\nBuddy slaat niks over.",
    pages: [
      { day: "do 3 dec", entry: "Boodschappen" },
      { day: "vr 4 dec", entry: "Borrel" },
      { day: "za 5 dec", entry: "Pakjesavond" },
      { day: "ma 7 dec", entry: "Werk" },
    ],
    reminderDay: "wo 9 dec",
    reminderLabel: "Herinnering",
    reminderNote: "nog 2 dagen",
    subline: "Een herinnering in je agenda,\nop het moment dat jij kiest.",
  },
  cta: {
    tagline: "Blader gerust.\nBuddy houdt de plek.",
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
    mark: 3.8,
    flip: 4.0,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const bladwijzerFrames = (t: BladwijzerProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    mark: f(t.mark),
    flip: f(t.flip),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const bladwijzerTotal = (t: BladwijzerProps["timing"]) => {
  const s = bladwijzerFrames(t);
  return s.hook + s.mark + s.flip + s.cta - 3 * s.transition;
};
