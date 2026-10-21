import { z } from "zod";

// Idee 6 · "Brief van de maker" (vertrouwen, retargeting + één keer organisch)
// Alle teksten zijn te bewerken in Remotion Studio (Props-paneel). "\n" = harde regelafbreking.
export const briefSchema = z.object({
  kicker: z.string(),
  paragraphs: z.array(z.string()).min(1).max(5),
  signature: z.string(),
  role: z.string(),
  // Open beslissing: bedrijfsnaam en KvK-nummer. Leeg = geen regel.
  footerLine: z.string(),
  chip: z.string(),
});

export type BriefProps = z.infer<typeof briefSchema>;

export const defaultBriefProps: BriefProps = {
  kicker: "Brief van de maker",
  paragraphs: [
    "Ik ben Rick en ik maak Betaalbuddy in Eindhoven.",
    "Buddy leest je mail niet: hij pakt de betaaldatum en gooit de rest weg.",
    "Geen bankkoppeling, geen inbox-toegang.",
  ],
  signature: "Rick",
  role: "Maker van Betaalbuddy",
  footerLine: "",
  chip: "Stuur door · seintje 7 en 2 dagen vooraf",
};
