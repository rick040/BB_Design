import { z } from "zod";

// Idee 9 · "€3,49 rust" (static, conversie, retargeting)
// Alle teksten zijn te bewerken in Remotion Studio (Props-paneel). "\n" = harde regelafbreking.
export const rustSchema = z.object({
  headline: z.string(),
  receipt: z.object({
    label: z.string(),
    item: z.string(),
    itemPrice: z.string(),
    itemNote: z.string(),
    totalLabel: z.string(),
    total: z.string(),
    thanks: z.string(),
  }),
  button: z.string(),
  chip: z.string(),
});

export type RustProps = z.infer<typeof rustSchema>;

export const defaultRustProps: RustProps = {
  headline: "Het kleinste dat je\ndeze maand koopt.",
  receipt: {
    label: "Bon · december",
    item: "Rust in december",
    itemPrice: "€3,49",
    itemNote: "Standard, per maand",
    totalLabel: "Totaal",
    total: "€3,49",
    thanks: "Jij viert. Buddy onthoudt.",
  },
  button: "Start met je Buddy.",
  chip: "Stuur door · seintje 7 en 2 dagen vooraf",
};
