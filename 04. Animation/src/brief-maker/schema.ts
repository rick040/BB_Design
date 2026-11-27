import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Campagne 2612 · W2 "Brief van de maker" (warm: vertrouwen)
// One continuous shot: a letter types itself, Rick signs it, Buddy peeks in.
// Every field below is editable in Remotion Studio (Props panel).

export const briefSchema = z.object({
  // Paid-Reels safe zone (9:16): keeps text and the CTA between y≈280 and y≈1250.
  adSafeZone: z.boolean(),
  headline: z.string(),
  greeting: z.string(),
  // Each paragraph types itself from `at` (seconds). A negative `at` means
  // it is already (partly) typed on frame 0, which is also the cover.
  paragraphs: z
    .array(z.object({ text: z.string(), at: z.number().min(-5).max(14) }))
    .min(1)
    .max(6),
  signName: z.string(),
  signRole: z.string(),
  cta: z.object({ button: z.string() }),
  colors: z.object({
    blue: zColor(),
    light: zColor(),
    softBlue: zColor(),
    bodyOnBlue: zColor(),
    alert: zColor(),
    // Background behind the letter (#E8EEFF in the campaign plan).
    paper: zColor(),
  }),
  timing: z.object({
    total: z.number().min(8).max(20),
    // Typing speed in characters per second.
    typeSpeed: z.number().min(10).max(80),
    sign: z.number().min(1).max(18),
    buddy: z.number().min(1).max(18),
    cta: z.number().min(1).max(18),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type BriefProps = z.infer<typeof briefSchema>;

export const defaultBriefProps: BriefProps = {
  adSafeZone: true,
  headline: "Wie maakt Betaalbuddy?",
  greeting: "Hoi,",
  paragraphs: [
    { text: "Ik ben Rick en ik maak Betaalbuddy in Geldrop.", at: -1.4 },
    { text: "Buddy leest je mail niet. Hij pakt de betaaldatum en gooit de rest weg.", at: 3.3 },
    { text: "Geen bankkoppeling, geen toegang tot je inbox.", at: 7.6 },
    { text: "Vragen? Mail me gewoon.", at: 10.4 },
  ],
  signName: "Rick",
  signRole: "maker van Betaalbuddy",
  cta: { button: "Wie maakt dit?" },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.yellow,
    paper: "#e8eeff",
  },
  timing: {
    total: 15,
    typeSpeed: 36,
    sign: 11.6,
    buddy: 12.3,
    cta: 12.9,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;
export const briefTotal = (t: BriefProps["timing"]) => Math.round(t.total * FPS);
