import { z } from "zod";

// Idee 11 · "De kerstkaart van Buddy" (static + Story, referral)
// Alle teksten zijn te bewerken in Remotion Studio (Props-paneel). "\n" = harde regelafbreking.
export const kerstkaartSchema = z.object({
  front: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  back: z.object({
    kicker: z.string(),
    quote: z.string(),
    note: z.string(),
    chip: z.string(),
  }),
  story: z.object({
    headline: z.string(),
    subline: z.string(),
    forLabel: z.string(),
    chip: z.string(),
  }),
});

export type KerstkaartProps = z.infer<typeof kerstkaartSchema>;

export const defaultKerstkaartProps: KerstkaartProps = {
  front: {
    headline: "Fijne\nfeestdagen.",
    subline: "Ik let wel op de rekeningen.",
  },
  back: {
    kicker: "Voor:",
    quote: "die vriend die altijd “o ja, die rekening” zegt.",
    note: "Stuur dit door.",
    chip: "Stuur door · seintje 7 en 2 dagen vooraf",
  },
  story: {
    headline: "Fijne\nfeestdagen.",
    subline: "Ik let wel op de rekeningen.",
    forLabel: "Voor:",
    chip: "Stuur door · seintje 7 en 2 dagen vooraf",
  },
};
