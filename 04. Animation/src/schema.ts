import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "./theme";

// Everything in here shows up as an editable field in Remotion Studio
// (right-hand "Props" panel). Edit, preview, then hit Render.
// Tip: "\n" in a headline or subline forces a line break.

const notification = z.object({
  text: z.string(),
  time: z.string(),
  icon: z.enum(["new", "warning", "alert"]),
});

export const adSchema = z.object({
  hook: z.object({
    headline: z.string(),
    inboxTitle: z.string(),
    warningTitle: z.string(),
    warningSubtitle: z.string(),
    warningBadge: z.string(),
  }),
  buddy: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    sender: z.string(),
    subject: z.string(),
    button: z.string(),
    chips: z.array(z.string()).max(3),
  }),
  remind: z.object({
    headline: z.string(),
    subline: z.string(),
    calendarDay: z.string(),
    // Listed in the order they arrive; the last one ends up on top.
    notifications: z.array(notification).max(3),
  }),
  cta: z.object({
    headline: z.string(),
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
  // Scene lengths in seconds. Total length updates automatically.
  timing: z.object({
    hook: z.number().min(2).max(8),
    buddy: z.number().min(1.8).max(8),
    forward: z.number().min(3).max(8),
    remind: z.number().min(3).max(8),
    cta: z.number().min(2.5).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  // Optional: put an mp3 in public/ and enter its file name, e.g. "music.mp3".
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  // Instagram UI overlay guides. Keep off for the final export.
  showSafeZones: z.boolean(),
});

export type AdProps = z.infer<typeof adSchema>;

export const defaultAdProps: AdProps = {
  hook: {
    headline: "Gemiste betaling door je volle inbox?",
    inboxTitle: "Inbox",
    warningTitle: "Laatste aanmaning",
    warningSubtitle: "betaal direct het openstaande bedrag",
    warningBadge: "+€40",
  },
  buddy: {
    headline: "Dit is Buddy.",
    subline: "Hij onthoudt je rekeningen, zodat jij dat niet hoeft.",
  },
  forward: {
    headline: "Stuur je rekening door naar Buddy",
    subline: "Buddy haalt er bedrag, vervaldatum en betaallink uit.",
    sender: "Energieleverancier",
    subject: "Je factuur van oktober",
    button: "Doorsturen",
    chips: ["€86,40", "Vervalt 22 okt", "Betaallink"],
  },
  remind: {
    headline: "Buddy herinnert je op tijd",
    subline: "In je mail én je agenda.\n7 en 2 dagen van tevoren.",
    calendarDay: "22",
    notifications: [
      { text: "Rekening ontvangen · €86,40", time: "9d", icon: "new" },
      { text: "Nog 7 dagen · vervalt 22 okt", time: "5d", icon: "warning" },
      { text: "Nog 2 dagen · betaal op tijd", time: "nu", icon: "alert" },
    ],
  },
  cta: {
    headline: "Nooit meer een betaling missen.",
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
    buddy: 2.6,
    forward: 3.6,
    remind: 3.6,
    cta: 3.4,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const sceneFrames = (timing: AdProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(timing.hook),
    buddy: f(timing.buddy),
    forward: f(timing.forward),
    remind: f(timing.remind),
    cta: f(timing.cta),
    transition: f(timing.transition),
  };
};

export const totalFrames = (timing: AdProps["timing"]) => {
  const s = sceneFrames(timing);
  return s.hook + s.buddy + s.forward + s.remind + s.cta - 4 * s.transition;
};
