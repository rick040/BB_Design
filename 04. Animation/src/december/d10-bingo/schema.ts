import { z } from "zod";

// Idee 10 · "Kersttafel-bingo" (static, TOFU)
// Alle teksten zijn te bewerken in Remotion Studio (Props-paneel).
export const bingoSchema = z.object({
  title: z.string(),
  // Acht vragen, van links boven naar rechts onder; het middenvak is het vrije vak.
  questions: z.array(z.string()).length(8),
  freeSquare: z.string(),
  cta: z.string(),
  chip: z.string(),
});

export type BingoProps = z.infer<typeof bingoSchema>;

export const defaultBingoProps: BingoProps = {
  title: "Kersttafel-bingo",
  questions: [
    "Al iemand leuks?",
    "Hoe is het op je werk?",
    "Wanneer kom je weer eens langs?",
    "Wat doe je met oud en nieuw?",
    "Heb je die rekening al betaald?",
    "Is dat een nieuwe trui?",
    "Zullen we straks een spelletje doen?",
    "Nog een toetje?",
  ],
  freeSquare: "Ja, staat in mijn agenda.",
  cta: "Tag degene naast wie je aan tafel zit.",
  chip: "Stuur door · seintje 7 en 2 dagen vooraf",
};
