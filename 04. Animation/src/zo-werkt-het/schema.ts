import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Campagne 2612 · W1 "Zo werkt het" (warm: uitleg in drie stappen)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const zoWerktSchema = z.object({
  // Paid-Reels safe zone (9:16): keeps text and the CTA between y≈280 and y≈1250.
  adSafeZone: z.boolean(),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    dueLong: z.string(),
    dueShort: z.string(),
    // Day of the month of the due date (for the agenda and the icon).
    dueDay: z.number().int().min(1).max(31),
  }),
  mail: z.object({
    headline: z.string(),
    inbox: z.string(),
    to: z.string(),
    greeting: z.string(),
    amountLabel: z.string(),
    dueLabel: z.string(),
    reply: z.string(),
    forward: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    title: z.string(),
    toLabel: z.string(),
    address: z.string(),
    sent: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    month: z.string(),
    weekdays: z.array(z.string()).length(7),
    // Day number of the Monday of the week shown.
    weekStart: z.number().int().min(1).max(31),
    eventTitle: z.string(),
    reminder: z.string(),
  }),
  notify: z.object({
    headline: z.string(),
    subline: z.string(),
    clock: z.string(),
    date: z.string(),
    appName: z.string(),
    time: z.string(),
    line1: z.string(),
    line2: z.string(),
  }),
  cta: z.object({
    button: z.string(),
    subline: z.string(),
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
    // Scene 1+2 are one continuous shot on the phone.
    phone: z.number().min(4).max(10),
    // Seconds into the phone scene when "1. Doorsturen." starts.
    forwardAt: z.number().min(1.5).max(4),
    agenda: z.number().min(2.4).max(8),
    notify: z.number().min(2.4).max(8),
    cta: z.number().min(1.6).max(6),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type ZoWerktProps = z.infer<typeof zoWerktSchema>;

export const defaultZoWerktProps: ZoWerktProps = {
  adSafeZone: true,
  bill: {
    sender: "Zorgverzekeraar",
    subject: "Factuur",
    amount: "€12,00",
    dueLong: "11 december 2026",
    dueShort: "vr 11 dec",
    dueDay: 11,
  },
  mail: {
    headline: "Zo werkt Buddy.",
    inbox: "Inbox",
    to: "aan mij",
    greeting: "Beste klant,",
    amountLabel: "Te betalen",
    dueLabel: "Vervaldatum",
    reply: "Beantwoorden",
    forward: "Doorsturen",
  },
  forward: {
    headline: "1. Doorsturen.",
    title: "Doorsturen",
    toLabel: "Aan:",
    address: "jouwcode@in.betaalbuddy.nl",
    sent: "Doorgestuurd naar Buddy",
  },
  agenda: {
    headline: "2. Staat in\nje agenda.",
    month: "december 2026",
    weekdays: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    weekStart: 7,
    eventTitle: "Betaal Zorgverzekeraar",
    reminder: "Seintje vooraf",
  },
  notify: {
    headline: "3. Op tijd\neen seintje.",
    subline: "Jij kiest wanneer.",
    clock: "09:41",
    date: "dinsdag 8 december",
    appName: "Agenda",
    time: "nu",
    line1: "Betaal Zorgverzekeraar €12,00",
    line2: "Vervalt vr 11 dec",
  },
  cta: {
    button: "Start met Buddy",
    subline: "€3,49 per maand · geen app · geen bankkoppeling",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.yellow,
  },
  timing: {
    phone: 6.4,
    forwardAt: 2.5,
    agenda: 3.9,
    notify: 3.4,
    cta: 2.5,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const zoWerktFrames = (t: ZoWerktProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    phone: f(t.phone),
    forwardAt: f(t.forwardAt),
    agenda: f(t.agenda),
    notify: f(t.notify),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const zoWerktTotal = (t: ZoWerktProps["timing"]) => {
  const s = zoWerktFrames(t);
  return s.phone + s.agenda + s.notify + s.cta - 3 * s.transition;
};

/** Phone size and place on the 1080 × 900 stage (same in every scene). */
export const PHONE = { x: 290, y: 0, w: 500, h: 840 };
