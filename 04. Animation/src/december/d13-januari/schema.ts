import { z } from "zod";
import { decColorsSchema, defaultDecColors } from "../common";

// Idee 13 · "Januari staat al klaar" (carrousel van 6, bewaren; ook als ad).
// Alle teksten zijn props in Remotion Studio. `\n` zet een regelafbreking.
// Er staan bewust geen bedragen op: die verschillen per persoon.

export const januariSchema = z.object({
  /** Welke slide dit is (1 t/m 6). De zes Stills delen de rest van de props. */
  slide: z.number().int().min(1).max(6),
  label: z.string(),
  swipe: z.string(),
  chip: z.string(),
  cover: z.object({
    headline: z.string(),
    sub: z.string(),
    month: z.string(),
    save: z.string(),
  }),
  premie: z.object({
    headline: z.string(),
    sender: z.string(),
    subject: z.string(),
    tag: z.string(),
  }),
  termijn: z.object({
    headline: z.string(),
    sender: z.string(),
    subject: z.string(),
    example: z.string(),
    steps: z.array(z.string()).length(3),
  }),
  abonnement: z.object({
    headline: z.string(),
    cycle: z.string(),
    rows: z.array(z.object({ name: z.string(), note: z.string() })).length(3),
  }),
  post: z.object({
    headline: z.string(),
    sub: z.string(),
    envelopes: z.array(z.string()).length(2),
    note: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    sub: z.string(),
    sender: z.string(),
    subject: z.string(),
    agendaTitle: z.string(),
    due: z.string(),
    alerts: z.array(z.object({ day: z.string(), label: z.string() })).length(2),
    cta: z.string(),
  }),
  colors: decColorsSchema,
});

export type JanuariProps = z.infer<typeof januariSchema>;

export const defaultJanuariProps: JanuariProps = {
  slide: 1,
  label: "Januari klaarzetten",
  swipe: "veeg door",
  chip: "Stuur door · seintje 7 en 2 dagen vooraf",
  cover: {
    headline: "Deze rekeningen\nkunnen in\njanuari komen.",
    sub: "Zet ze nu klaar.",
    month: "januari",
    save: "Bewaar dit",
  },
  premie: {
    headline: "Je nieuwe\nzorgpremie.",
    sender: "Zorgverzekeraar",
    subject: "Je premie voor het nieuwe jaar",
    tag: "nieuw jaar",
  },
  termijn: {
    headline: "Termijnen van\nwat je in\ndecember kocht.",
    sender: "Webshop",
    subject: "Termijn 2 van 3",
    example: "voorbeeld",
    steps: ["dec", "jan", "feb"],
  },
  abonnement: {
    headline: "Jaarabonnementen\ndie verlengen.",
    cycle: "elk jaar",
    rows: [
      { name: "Sportschool", note: "verlengt automatisch" },
      { name: "Tijdschrift", note: "verlengt automatisch" },
      { name: "Software", note: "verlengt automatisch" },
    ],
  },
  post: {
    headline: "Wat per persoon\nverschilt.",
    sub: "Zoals gemeente of energie.\nCheck je eigen post.",
    envelopes: ["Gemeente", "Energieleverancier"],
    note: "jouw post",
  },
  forward: {
    headline: "Stuur ze door zodra\nze binnen zijn.",
    sub: "Buddy zet de datum in je agenda.",
    sender: "Zorgverzekeraar",
    subject: "Je premie voor het nieuwe jaar",
    agendaTitle: "In je agenda",
    due: "vr 15 jan",
    alerts: [
      { day: "vr 8 jan", label: "7 dagen vooraf" },
      { day: "wo 13 jan", label: "2 dagen vooraf" },
    ],
    cta: "Bewaar dit voor januari.",
  },
  colors: { ...defaultDecColors },
};
