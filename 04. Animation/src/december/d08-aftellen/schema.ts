import { z } from "zod";

// Idee 8 · "Aftellen naar 31 december" (Story-reeks van 4 slides, MOFU, organisch)
// Alle teksten zijn te bewerken in Remotion Studio (Props-paneel). "\n" = harde regelafbreking.
//
// NOG TE CONTROLEREN VOOR 9 DECEMBER: de zorgverzekering-feiten in `fact1` en `fact2`
// (bronnen: Rijksoverheid, zorgverzekeringbesparen.nl).
export const aftellenSchema = z.object({
  poll: z.object({
    headline: z.string(),
    options: z.array(z.string()).length(3),
  }),
  fact1: z.object({
    kicker: z.string(),
    dateTop: z.string(),
    dateDay: z.string(),
    headline: z.string(),
    body: z.string(),
    source: z.string(),
  }),
  fact2: z.object({
    kicker: z.string(),
    cardTitle: z.string(),
    cardSub: z.string(),
    headline: z.string(),
    source: z.string(),
  }),
  countdown: z.object({
    kicker: z.string(),
    // Dagen tot 31 december: 22 op 9 dec, 15 op 16 dec, 8 op 23 dec.
    daysLeft: z.number().int().min(0).max(31),
    unit: z.string(),
    target: z.string(),
    line: z.string(),
    chip: z.string(),
  }),
});

export type AftellenProps = z.infer<typeof aftellenSchema>;

export const defaultAftellenProps: AftellenProps = {
  poll: {
    headline: "Ga jij overstappen van zorgverzekering?",
    options: ["Ja", "Nee", "Weet ik nog niet"],
  },
  fact1: {
    kicker: "Goed om te weten",
    dateTop: "dec",
    dateDay: "31",
    headline: "Overstappen kan t/m 31 december.",
    body: "Zeg je zelf op voor 1 januari, dan heb je tot 1 februari voor een nieuwe polis.",
    source: "Bron: Rijksoverheid, zorgverzekeringbesparen.nl",
  },
  fact2: {
    kicker: "Goed om te weten",
    cardTitle: "Zorgverzekeraar",
    cardSub: "Premie · openstaand",
    headline: "Een openstaande premie kan je overstap blokkeren.",
    source: "Bron: Rijksoverheid, zorgverzekeringbesparen.nl",
  },
  countdown: {
    kicker: "Nog",
    daysLeft: 22,
    unit: "dagen",
    target: "tot 31 december",
    line: "Stuur je nieuwe premienota door zodra hij binnen is.",
    chip: "Stuur door · seintje 7 en 2 dagen vooraf",
  },
};
