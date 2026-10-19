import { z } from "zod";
import { decColorsSchema, defaultDecColors } from "../common";

// Idee 5 · "Lijstjesmaand" (carrousel van 5, organisch).
// Alle teksten zijn props in Remotion Studio. `\n` zet een regelafbreking.

const checkedList = z.object({
  headline: z.string(),
  title: z.string(),
  items: z.array(z.string()).length(4),
});

export const lijstjesSchema = z.object({
  /** Welke slide dit is (1 t/m 5). De vijf Stills delen de rest van de props. */
  slide: z.number().int().min(1).max(5),
  label: z.string(),
  swipe: z.string(),
  chip: z.string(),
  cover: z.object({
    headline: z.string(),
    cards: z.array(z.string()).length(3),
  }),
  /** Slide 2 t/m 4: een lijstje, afgevinkt. */
  lists: z.array(checkedList).length(3),
  /** Slide 5: het lijstje dat Buddy bijhoudt. */
  buddy: z.object({
    headline: z.string(),
    subline: z.string(),
    title: z.string(),
    rows: z.array(z.object({ name: z.string(), date: z.string() })).length(3),
    cta: z.string(),
  }),
  colors: decColorsSchema,
});

export type LijstjesProps = z.infer<typeof lijstjesSchema>;

export const defaultLijstjesProps: LijstjesProps = {
  slide: 1,
  label: "Lijstjesmaand",
  swipe: "veeg door",
  chip: "Stuur door · seintje 7 en 2 dagen vooraf",
  cover: {
    headline: "December is\nde maand van\nlijstjes.",
    cards: ["Verlanglijst", "Boodschappen", "Appen"],
  },
  lists: [
    {
      headline: "Verlanglijst,\nafgevinkt.",
      title: "Verlanglijst",
      items: ["Warme sokken", "Grote puzzel", "Thermosfles", "Leesboek"],
    },
    {
      headline: "Boodschappen\nvoor kerst,\nafgevinkt.",
      title: "Kerstboodschappen",
      items: ["Gourmetset", "Stol", "Mandarijnen", "Kaarsjes"],
    },
    {
      headline: "Wie je nog\nmoet appen,\nafgevinkt.",
      title: "Nog te appen",
      items: ["Oma", "De buren", "Oude collega", "Beste vriend"],
    },
  ],
  buddy: {
    headline: "Wat je nog\nmoet betalen?",
    subline: "Dat lijstje houdt Buddy bij.",
    title: "Betalen",
    rows: [
      { name: "Huur", date: "3 dec" },
      { name: "Webshop achteraf", date: "9 dec" },
      { name: "Zorgpremie", date: "14 dec" },
    ],
    cta: "Bewaar dit en stuur je\neerste rekening door.",
  },
  colors: { ...defaultDecColors },
};
