import { z } from "zod";
import { decColorsSchema, defaultDecColors, FPS } from "../common";

// Idee 12 · "Vriend mee de feestdagen door" (Reel, referral)
// Alles hieronder is bewerkbaar in Remotion Studio (Props-paneel).
// Tip: "\n" in een kop of subregel forceert een regelafbreking.

const agendaRow = z.object({
  day: z.string(),
  month: z.string(),
  title: z.string(),
});

export const vriendSchema = z.object({
  hook: z.object({
    headline: z.string(),
    bubble: z.string(), // zegt de vriend onder de enveloppen
    agendaTitle: z.string(), // kaartje boven de rustige Buddy
    agendaRows: z.array(z.string()).length(3),
  }),
  link: z.object({
    headline: z.string(),
    subline: z.string(),
    message: z.string(),
    linkText: z.string(),
    reply: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    addressChip: z.string(),
    rows: z.array(agendaRow).length(3),
    flagFar: z.string(),
    flagNear: z.string(),
  }),
  cta: z.object({
    // Eerste regel wit, de rest zacht blauw.
    headline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  colors: decColorsSchema,
  timing: z.object({
    hook: z.number().min(2.6).max(8),
    link: z.number().min(2.6).max(8),
    forward: z.number().min(3.6).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type VriendProps = z.infer<typeof vriendSchema>;

export const defaultVriendProps: VriendProps = {
  hook: {
    headline: "Die ene vriend\nonder de enveloppen.",
    bubble: "O ja, die rekening…",
    agendaTitle: "Mijn agenda",
    agendaRows: ["Huur", "Zorgpremie", "Webshop"],
  },
  link: {
    headline: "Stuur hem\nje link.",
    subline: "Eén link. Meer is het niet.",
    message: "Handig voor je rekeningen:",
    linkText: "betaalbuddy.nl",
    reply: "Top, doe ik!",
  },
  forward: {
    headline: "Eén rekening door.\nDe berg wordt een agenda.",
    subline: "Elke rekening krijgt een seintje\n7 en 2 dagen vooraf.",
    addressChip: "Je eigen Buddy-adres",
    rows: [
      { day: "3", month: "dec", title: "Huur" },
      { day: "9", month: "dec", title: "Webshop achteraf" },
      { day: "14", month: "dec", title: "Zorgpremie" },
    ],
    flagFar: "7",
    flagNear: "2",
  },
  cta: {
    headline: "Per vriend die lid wordt:\njij een maand gratis.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: defaultDecColors,
  timing: { hook: 3.4, link: 3.8, forward: 4.8, cta: 4.2, transition: 0.4 },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const vriendFrames = (t: VriendProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    link: f(t.link),
    forward: f(t.forward),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const vriendTotal = (t: VriendProps["timing"]) => {
  const s = vriendFrames(t);
  return s.hook + s.link + s.forward + s.cta - 3 * s.transition;
};
