import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Campagne 2612 · K3 "Eén huurcontract, zeven rekeningen" (op jezelf wonen)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

const bill = z.object({
  sender: z.string(),
  // Short label inside the calendar tile.
  short: z.string(),
  // ISO date, must fall inside the calendar month below.
  date: z.string(),
  dateLabel: z.string(),
});

export const eigenHuisSchema = z.object({
  // Paid-Reels safe zone (9:16): keeps text and the CTA between y≈280 and y≈1250.
  adSafeZone: z.boolean(),
  sign: z.object({
    headline: z.string(),
    title: z.string(),
    signLabel: z.string(),
  }),
  // The seven generic senders, each with its own date.
  bills: z.array(bill).min(3).max(7),
  fan: z.object({
    headline: z.string(),
  }),
  gather: z.object({
    headline: z.string(),
    subline: z.string(),
    monthLabel: z.string(),
    weekdays: z.array(z.string()).length(7),
    // First Monday shown, and how many weeks.
    startDate: z.string(),
    weeks: z.number().int().min(4).max(6),
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
    sign: z.number().min(2).max(6),
    fan: z.number().min(2.4).max(7),
    gather: z.number().min(3).max(8),
    cta: z.number().min(1.4).max(6),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type EigenHuisProps = z.infer<typeof eigenHuisSchema>;

export const defaultEigenHuisProps: EigenHuisProps = {
  adSafeZone: true,
  sign: {
    headline: "Eerste eigen huis.",
    title: "Huurcontract",
    signLabel: "Handtekening huurder",
  },
  bills: [
    { sender: "Verhuurder", short: "Huur", date: "2027-02-01", dateLabel: "1 feb" },
    { sender: "Energieleverancier", short: "Energie", date: "2027-02-05", dateLabel: "5 feb" },
    { sender: "Waterbedrijf", short: "Water", date: "2027-02-09", dateLabel: "9 feb" },
    { sender: "Internetprovider", short: "Internet", date: "2027-02-12", dateLabel: "12 feb" },
    { sender: "Gemeente", short: "Gemeente", date: "2027-02-17", dateLabel: "17 feb" },
    { sender: "Zorgverzekeraar", short: "Zorg", date: "2027-02-23", dateLabel: "23 feb" },
    { sender: "Verzekeraar", short: "Inboedel", date: "2027-02-26", dateLabel: "26 feb" },
  ],
  fan: {
    headline: "Zeven rekeningen.\nZeven datums.",
  },
  gather: {
    headline: "Doorsturen.",
    subline: "Buddy onthoudt de datums.",
    monthLabel: "februari",
    weekdays: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    startDate: "2027-02-01",
    weeks: 4,
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
    sign: 2.9,
    fan: 3.9,
    gather: 4.4,
    cta: 2.0,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const eigenHuisFrames = (t: EigenHuisProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    sign: f(t.sign),
    fan: f(t.fan),
    gather: f(t.gather),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const eigenHuisTotal = (t: EigenHuisProps["timing"]) => {
  const s = eigenHuisFrames(t);
  return s.sign + s.fan + s.gather + s.cta - 3 * s.transition;
};
