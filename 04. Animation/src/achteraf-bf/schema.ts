import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Campagne 2612 · K1 "Eén dag gekocht, negen dagen betalen" (achteraf betalen na Black Friday)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const achterafSchema = z.object({
  // Paid-Reels safe zone (9:16): keeps text and the CTA between y≈280 and y≈1250,
  // clear of Meta's CTA button and ad text. Turn off for an organic Reel.
  adSafeZone: z.boolean(),
  calendar: z.object({
    headline: z.string(),
    spreadHeadline: z.string(),
    monthLabel: z.string(),
    weekdays: z.array(z.string()).length(7),
    // First Monday shown, and how many weeks.
    startDate: z.string(),
    weeks: z.number().int().min(4).max(6),
    // The one day everything was bought (the parcels land here).
    buyDate: z.string(),
    buyLabel: z.string(),
    // One parcel per payment date (example dates, not a statistic).
    payDates: z.array(z.string()).min(3).max(12),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    sender: z.string(),
    subject: z.string(),
    time: z.string(),
    button: z.string(),
  }),
  cta: z.object({
    button: z.string(),
  }),
  colors: z.object({
    blue: zColor(),
    light: zColor(),
    softBlue: zColor(),
    bodyOnBlue: zColor(),
    // Urgency colour (yellow in this campaign: no red).
    alert: zColor(),
  }),
  timing: z.object({
    // Scene 1+2 are one continuous shot on the calendar.
    calendar: z.number().min(4).max(10),
    // Seconds into the calendar scene when the pile topples.
    spreadAt: z.number().min(1.5).max(4),
    forward: z.number().min(2.6).max(8),
    cta: z.number().min(1.2).max(6),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type AchterafProps = z.infer<typeof achterafSchema>;

export const defaultAchterafProps: AchterafProps = {
  adSafeZone: true,
  calendar: {
    headline: "Gekocht op één dag.",
    spreadHeadline: "Betalen op negen dagen.",
    monthLabel: "november · december",
    weekdays: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    startDate: "2026-11-23",
    weeks: 6,
    buyDate: "2026-11-27",
    buyLabel: "Black Friday",
    payDates: [
      "2026-12-02",
      "2026-12-04",
      "2026-12-08",
      "2026-12-11",
      "2026-12-15",
      "2026-12-17",
      "2026-12-21",
      "2026-12-24",
      "2026-12-28",
    ],
  },
  forward: {
    headline: "Stuur de betaalmail door.",
    subline: "Buddy zet hem in je agenda.",
    sender: "Webshop",
    subject: "Betaalverzoek",
    time: "09:12",
    button: "Doorsturen",
  },
  cta: {
    button: "Zo werkt het",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.yellow,
  },
  timing: {
    calendar: 6.4,
    spreadAt: 2.5,
    forward: 3.9,
    cta: 1.5,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const achterafFrames = (t: AchterafProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    calendar: f(t.calendar),
    spreadAt: f(t.spreadAt),
    forward: f(t.forward),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const achterafTotal = (t: AchterafProps["timing"]) => {
  const s = achterafFrames(t);
  return s.calendar + s.forward + s.cta - 2 * s.transition;
};
