import { z } from "zod";
import { decColorsSchema, defaultDecColors } from "../common";

// Idee 4 · "Het Buddy-rijm" (carrousel van 4, alleen organisch).
// Alle teksten zijn props in Remotion Studio. *sterretjes* maken een woord gemarkeerd.

export const rijmSchema = z.object({
  /** Welke slide dit is (1 t/m 4). De vier Stills delen de rest van de props. */
  slide: z.number().int().min(1).max(4),
  label: z.string(),
  /** Per couplet twee verzen; `\n` zet een regelafbreking in beeld. */
  couplets: z.array(z.object({ a: z.string(), b: z.string() })).length(4),
  swipe: z.string(),
  chip: z.string(),
  thought: z.string(),
  mail: z.object({
    senders: z.array(z.string()).length(3),
    webshopSender: z.string(),
    webshopSubject: z.string(),
    dayTag: z.string(),
  }),
  forward: z.object({
    address: z.string(),
    action: z.string(),
  }),
  agenda: z.object({
    chip: z.string(),
    first: z.object({ text: z.string(), time: z.string() }),
    second: z.object({ text: z.string(), time: z.string() }),
  }),
  colors: decColorsSchema,
});

export type RijmProps = z.infer<typeof rijmSchema>;

export const defaultRijmProps: RijmProps = {
  slide: 1,
  label: "Het Buddy-rijm",
  couplets: [
    {
      a: "De surprise is af,\nhet gedicht ook bijna klaar,",
      b: "je rijmt al een uur\nop “cadeau” en op “jaar”.",
    },
    {
      a: "Maar die mail van de webshop,\nvan vrijdag of zo,",
      b: "die zakt naar beneden.\nEn *weg is hij*. Oh.",
    },
    {
      a: "Dus hier een advies,\nvoor nu en voor later:",
      b: "*stuur hem door* naar je Buddy,\ndie let op de data.",
    },
    {
      a: "Zeven dagen vooraf,\nen twee dagen ervoor,",
      b: "krijg jij een *seintje*.\nDan kom je er wel door.",
    },
  ],
  swipe: "veeg door",
  chip: "Stuur door · seintje 7 en 2 dagen vooraf",
  thought: "cadeau, cadeau…",
  mail: {
    senders: ["Mam", "Werk", "Buurvrouw"],
    webshopSender: "Webshop",
    webshopSubject: "Je betaalmail",
    dayTag: "vr",
  },
  forward: {
    address: "jouw-adres@in.betaalbuddy.nl",
    action: "Doorsturen",
  },
  agenda: {
    chip: "Vervalt vr 18 dec",
    first: { text: "Webshop vervalt over 7 dagen", time: "11 dec" },
    second: { text: "Webshop vervalt over 2 dagen", time: "16 dec" },
  },
  colors: { ...defaultDecColors },
};
