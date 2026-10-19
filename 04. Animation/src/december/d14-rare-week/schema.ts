import { z } from "zod";

// Idee 14 · "Die rare week" (static, TOFU, alleen organisch)
// Alle teksten zijn te bewerken in Remotion Studio (Props-paneel).
// Dagnamen en datums kloppen met 2026: 25 dec is een vrijdag, 29 dec een dinsdag.
export const rareWeekSchema = z.object({
  headline: z.string(),
  headlineEnd: z.string(),
  month: z.string(),
  // Zeven dagen; de dagnamen zijn bewust door elkaar, behalve die van de scherpe dag.
  days: z.array(z.object({ weekday: z.string(), date: z.string() })).length(7),
  sharpIndex: z.number().int().min(0).max(6),
  sharpLabel: z.string(),
  subline: z.string(),
  chip: z.string(),
});

export type RareWeekProps = z.infer<typeof rareWeekSchema>;

export const defaultRareWeekProps: RareWeekProps = {
  headline: "Tussen kerst en oud en nieuw weet niemand welke dag het is.",
  headlineEnd: "Je rekeningen wel.",
  month: "December",
  days: [
    { weekday: "Zondag?", date: "25" },
    { weekday: "Woensdag?", date: "26" },
    { weekday: "Gourmet-dag?", date: "27" },
    { weekday: "Zaterdag?", date: "28" },
    { weekday: "Dinsdag", date: "29" },
    { weekday: "Maandag?", date: "30" },
    { weekday: "Vrijdag?", date: "31" },
  ],
  sharpIndex: 4,
  sharpLabel: "Betaaldatum",
  subline: "Buddy geeft je 7 en 2 dagen vooraf een seintje. Je hoeft niet te weten welke dag het is.",
  chip: "Stuur door · seintje 7 en 2 dagen vooraf",
};
