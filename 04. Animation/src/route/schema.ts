import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 39 · "Jij rijdt. Buddy navigeert." (navigatie)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

export const routeSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // Navigation banner before and after the missed turn.
    bannerTurn: z.string(),
    bannerTurnSub: z.string(),
    bannerMissed: z.string(),
    bannerMissedSub: z.string(),
    destination: z.string(),
    detourPin: z.string(),
    detourChip: z.string(),
  }),
  plan: z.object({
    headline: z.string(),
    subline: z.string(),
    forwardedChip: z.string(),
  }),
  // The forwarded bill; comes back as the destination pin in scene 2 and 3.
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    dueLabel: z.string(),
    destination: z.string(),
  }),
  drive: z.object({
    headline: z.string(),
    // The two waypoints on the route (mail 7 and 2 days before).
    stops: z.array(z.string()).length(2),
    // The notifications that drop in when Buddy passes a waypoint.
    notifications: z
      .array(z.object({ text: z.string(), time: z.string() }))
      .length(2),
    arrived: z.string(),
    agendaChip: z.string(),
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
    plan: z.number().min(3).max(8),
    drive: z.number().min(3.2).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type RouteProps = z.infer<typeof routeSchema>;

export const defaultRouteProps: RouteProps = {
  hook: {
    headline: "Rekening vergeten?\nDan rij je om.",
    bannerTurn: "Rechtsaf",
    bannerTurnSub: "Rekening betalen · 300 m",
    bannerMissed: "Afslag gemist",
    bannerMissedSub: "Route herberekenen…",
    destination: "Rekening betalen",
    detourPin: "Aanmaning",
    detourChip: "Kan uitlopen op €40",
  },
  plan: {
    headline: "Stuur hem door.\nBuddy plant de route.",
    subline: "Hij leest het bedrag\nen de vervaldatum.",
    forwardedChip: "Doorgestuurd naar Buddy",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€112,40",
    dueLabel: "Vervalt 28 nov",
    destination: "28 nov · Betalen",
  },
  drive: {
    headline: "Onderweg seint hij je.\n7 en 2 dagen vooraf.",
    stops: ["21 nov · Mail", "26 nov · Mail"],
    notifications: [
      { text: "Nog 7 dagen · €112,40", time: "21 nov" },
      { text: "Nog 2 dagen · betaal op tijd", time: "26 nov" },
    ],
    arrived: "Op tijd",
    agendaChip: "28 nov staat in je agenda",
  },
  cta: {
    tagline: "Jij rijdt.\nBuddy navigeert.",
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
    plan: 3.6,
    drive: 3.8,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const routeFrames = (t: RouteProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    plan: f(t.plan),
    drive: f(t.drive),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const routeTotal = (t: RouteProps["timing"]) => {
  const s = routeFrames(t);
  return s.hook + s.plan + s.drive + s.cta - 3 * s.transition;
};
