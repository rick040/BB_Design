import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 43 · "Scherp tot de vervaldatum." (polaroid)
// A bill you only looked at fades like an overexposed instant photo. Buddy
// snaps the forwarded bill, the photo develops, and it lands sharp in your
// calendar. Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const polaroidSchema = z.object({
  // The bill that appears on every photo.
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amountLabel: z.string(),
    amount: z.string(),
    due: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    // Handwritten-style note on the white strip of the first photo.
    caption: z.string(),
    noticeTitle: z.string(),
    noticeText: z.string(),
  }),
  snap: z.object({
    headline: z.string(),
    subline: z.string(),
    forwardedChip: z.string(),
    fromLabel: z.string(),
    caption: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    month: z.string(),
    weekdays: z.array(z.string()).length(7),
    // First date shown (a Monday); three weeks are drawn.
    firstDay: z.number().int().min(1).max(28),
    lastDayOfMonth: z.number().int().min(28).max(31),
    dueDay: z.number().int().min(1).max(31),
    // Reminder days, T-7 and T-2.
    reminders: z
      .array(
        z.object({
          day: z.number().int().min(1).max(31),
          label: z.string(),
        }),
      )
      .length(2),
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
    snap: z.number().min(3).max(8),
    agenda: z.number().min(3.6).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type PolaroidProps = z.infer<typeof polaroidSchema>;

export const defaultPolaroidProps: PolaroidProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amountLabel: "Te betalen",
    amount: "€87,60",
    due: "Vervalt 27 nov",
  },
  hook: {
    headline: "Gezien. En toen\nvergeten.",
    caption: "nog betalen!",
    noticeTitle: "Aanmaning",
    noticeText: "Kan uitlopen op €40",
  },
  snap: {
    headline: "Stuur hem door.\nBuddy legt hem vast.",
    subline: "Hij haalt er het bedrag\nen de vervaldatum uit.",
    forwardedChip: "Doorgestuurd",
    fromLabel: "Van",
    caption: "27 nov",
  },
  agenda: {
    headline: "Scherp in je agenda.\nOp tijd een seintje.",
    subline: "Ook als jij hem allang\nvergeten bent.",
    month: "November",
    weekdays: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    firstDay: 9,
    lastDayOfMonth: 30,
    dueDay: 27,
    reminders: [
      { day: 20, label: "Mail: nog 7 dagen" },
      { day: 25, label: "Mail: nog 2 dagen" },
    ],
  },
  cta: {
    tagline: "Scherp tot\nde vervaldatum.",
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
    hook: 3.2,
    snap: 3.6,
    agenda: 4.4,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const polaroidFrames = (t: PolaroidProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    snap: f(t.snap),
    agenda: f(t.agenda),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const polaroidTotal = (t: PolaroidProps["timing"]) => {
  const s = polaroidFrames(t);
  return s.hook + s.snap + s.agenda + s.cta - 3 * s.transition;
};
