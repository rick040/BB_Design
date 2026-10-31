import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 31 · "Jij laat los. Buddy houdt vast." (ballonnen)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const ballonSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // Four balloons in your hand; `slipIndex` is the one that gets away.
    balloons: z.array(z.string()).length(4),
    slipIndex: z.number().int().min(0).max(3),
    noticeTitle: z.string(),
    noticeSender: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    forwardedChip: z.string(),
    fromLabel: z.string(),
    forwardButton: z.string(),
  }),
  tie: z.object({
    headline: z.string(),
    subline: z.string(),
    month: z.string(),
    weekdays: z.array(z.string()).length(7),
    // The calendar shows three weeks, Monday first. `firstDay` is the
    // date in the top-left cell. Reminder cells follow from `dueDay`.
    firstDay: z.number().int().min(1).max(14),
    reminder7: z.string(),
    reminder2: z.string(),
  }),
  // The bill that gets forwarded and tied to the calendar.
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    dueLabel: z.string(),
    dueDay: z.number().int().min(15).max(28),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
    tagline: z.string(),
    balloons: z.array(z.string()).length(3),
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
    forward: z.number().min(3).max(8),
    tie: z.number().min(3.8).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type BallonProps = z.infer<typeof ballonSchema>;

export const defaultBallonProps: BallonProps = {
  hook: {
    headline: "Eentje glipt er\naltijd tussendoor.",
    balloons: ["Huur", "Zorg", "Energie", "Telefoon"],
    slipIndex: 2,
    noticeTitle: "Aanmaning",
    noticeSender: "Energieleverancier · factuur oktober",
    costChip: "kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door.\nBuddy houdt vast.",
    subline: "Hij leest bedrag en vervaldatum.",
    forwardedChip: "Doorgestuurd",
    fromLabel: "Van",
    forwardButton: "Doorsturen",
  },
  tie: {
    headline: "Hij knoopt hem\nvast in je agenda.",
    subline: "Een seintje per mail,\n7 en 2 dagen vooraf.",
    month: "november",
    weekdays: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    firstDay: 9,
    reminder7: "nog 7 dagen",
    reminder2: "nog 2 dagen",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€94,20",
    dueLabel: "vervalt 26 nov",
    dueDay: 26,
  },
  cta: {
    tagline: "Jij laat los.\nBuddy houdt vast.",
    balloons: ["Huur", "Energie", "Zorg"],
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
    forward: 3.6,
    tie: 4.6,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const ballonFrames = (t: BallonProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    forward: f(t.forward),
    tie: f(t.tie),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const ballonTotal = (t: BallonProps["timing"]) => {
  const s = ballonFrames(t);
  return s.hook + s.forward + s.tie + s.cta - 3 * s.transition;
};
