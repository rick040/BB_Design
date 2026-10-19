import { z } from "zod";
import { decColorsSchema, defaultDecColors, FPS } from "../common";

// Idee 2 · "De adventskalender" (Reel + Story-reeks)
// Alles hieronder is bewerkbaar in Remotion Studio (Props-paneel).
// Tip: "\n" in een kop of subregel forceert een regelafbreking.

const bill = z.object({
  n: z.number().int().min(1).max(24), // deurtje
  label: z.string(),
  amount: z.string(),
});

export const adventSchema = z.object({
  // De drie deurtjes met een rekening, in volgorde van openen.
  bills: z.array(bill).length(3),
  hook: z.object({
    headline: z.string(),
  }),
  doors: z.object({
    headline: z.string(),
    subline: z.string(),
    flagFar: z.string(), // vlaggetje "7 dagen vooraf"
    flagNear: z.string(), // vlaggetje "2 dagen vooraf"
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    mailFrom: z.string(),
    mailSubject: z.string(),
    mailAmount: z.string(),
    forwardLabel: z.string(),
    addressChip: z.string(),
    agendaDay: z.string(),
    agendaMonth: z.string(),
    agendaTitle: z.string(),
    agendaSub: z.string(),
    chipFar: z.string(),
    chipNear: z.string(),
  }),
  cta: z.object({
    // Eerste regel wit, de rest zacht blauw.
    tagline: z.string(),
    button: z.string(),
    subline: z.string(),
    doorNumber: z.string(),
  }),
  colors: decColorsSchema,
  timing: z.object({
    hook: z.number().min(2.6).max(8),
    doors: z.number().min(3.6).max(9),
    forward: z.number().min(3.6).max(9),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type AdventProps = z.infer<typeof adventSchema>;

export const defaultAdventProps: AdventProps = {
  bills: [
    { n: 3, label: "Huur", amount: "€825" },
    { n: 9, label: "Webshop achteraf", amount: "€64,95" },
    { n: 14, label: "Zorgpremie", amount: "€139,50" },
  ],
  hook: { headline: "Niet elk deurtje\nis chocola." },
  doors: {
    headline: "Buddy hangt er\nvlaggetjes bij.",
    subline: "Twee seintjes per rekening:\n7 en 2 dagen vooraf.",
    flagFar: "7",
    flagNear: "2",
  },
  forward: {
    headline: "Mail doorsturen.\nSeintjes vanzelf.",
    subline: "Buddy leest bedrag, datum en\nbetaallink. Verder niets.",
    mailFrom: "Zorgverzekeraar",
    mailSubject: "Je premie van december",
    mailAmount: "€139,50",
    forwardLabel: "Doorsturen",
    addressChip: "Je eigen Buddy-adres",
    agendaDay: "14",
    agendaMonth: "dec",
    agendaTitle: "Zorgpremie",
    agendaSub: "Hele dag in je agenda",
    chipFar: "7 dagen vooraf",
    chipNear: "2 dagen vooraf",
  },
  cta: {
    tagline: "Jij opent de chocola.\nBuddy let op de rest.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
    doorNumber: "24",
  },
  colors: defaultDecColors,
  timing: { hook: 3.4, doors: 4.4, forward: 4.2, cta: 3.6, transition: 0.4 },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const adventFrames = (t: AdventProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    doors: f(t.doors),
    forward: f(t.forward),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const adventTotal = (t: AdventProps["timing"]) => {
  const s = adventFrames(t);
  return s.hook + s.doors + s.forward + s.cta - 3 * s.transition;
};

// ---------------------------------------------------------------------------
// Story-reeks: één deurtje per dag, 1 t/m 24 december (1080 × 1920 Stills).
// ---------------------------------------------------------------------------

export const doorKind = z.enum(["chocola", "rekening", "tip", "wens"]);

const storyDoor = z.object({
  kind: doorKind,
  title: z.string(), // afzender (rekening) of kop (tip)
  line: z.string(), // één zin onder het deurtje
  amount: z.string(), // alleen bij een rekening
  due: z.string(), // alleen bij een rekening
});

export const storySchema = z.object({
  day: z.number().int().min(1).max(24),
  tags: z.object({
    chocola: z.string(),
    rekening: z.string(),
    tip: z.string(),
    wens: z.string(),
  }),
  doorLabel: z.string(), // "Deurtje"
  footerChip: z.string(),
  // De 24 deurtjes; deurtje `day` wordt getoond.
  doors: z.array(storyDoor).length(24),
  colors: decColorsSchema,
});

export type StoryProps = z.infer<typeof storySchema>;
export type StoryDoor = z.infer<typeof storyDoor>;

const d = (
  kind: StoryDoor["kind"],
  title: string,
  line: string,
  amount = "",
  due = "",
): StoryDoor => ({ kind, title, line, amount, due });

// Deurtje 3, 9 en 14 komen uit het campagnebestand; de andere 21 zijn een voorstel.
export const defaultStoryDoors: StoryDoor[] = [
  d("chocola", "Chocola", "Deze is voor jou. Buddy let op de rest."),
  d("tip", "Zet je lijstje klaar", "Stuur elke rekening door zodra hij binnen is."),
  d("rekening", "Huur", "Doorsturen, en de datum staat in je agenda.", "€825", "vervalt 3 dec"),
  d("tip", "Doorsturen duurt even", "Eén mail doorsturen is zo gedaan."),
  d("rekening", "Energieleverancier", "Nota doorsturen en je krijgt een seintje.", "€96,40", "vervalt 5 dec"),
  d("tip", "Zeven dagen vooraf", "Het eerste seintje: ruim op tijd, zonder haast."),
  d("rekening", "Telefoonprovider", "Je factuur van december, alvast in je agenda.", "€27,50", "vervalt 8 dec"),
  d("tip", "Twee dagen vooraf", "Het tweede seintje, voor wie het even vergeet."),
  d("rekening", "Webshop achteraf", "Achteraf betalen komt in december terug.", "€64,95", "vervalt 9 dec"),
  d("tip", "Wekelijks overzicht", "Elke week zie je wat er aan komt."),
  d("rekening", "Sportschool", "Je abonnement, netjes in je agenda.", "€34,99", "vervalt 11 dec"),
  d("tip", "Hele dag in je agenda", "Een rekening wordt een item voor de hele dag."),
  d("rekening", "Verzekeraar", "Je jaarbedrag, met seintje 7 en 2 dagen vooraf.", "€212,00", "vervalt 13 dec"),
  d("rekening", "Zorgpremie", "Je premie, met een seintje 7 en 2 dagen vooraf.", "€139,50", "vervalt 14 dec"),
  d("tip", "Geen app, geen bankkoppeling", "Buddy ziet alleen wat jij doorstuurt."),
  d("rekening", "Gemeente", "Een nota van de gemeente? Doorsturen.", "€58,20", "vervalt 16 dec"),
  d("tip", "Cadeaus met uitstel?", "Stuur de betaalmail door, dan weet je wanneer."),
  d("rekening", "Internetprovider", "Je factuur, met een seintje vooraf.", "€44,00", "vervalt 18 dec"),
  d("tip", "Je mailbox blijft van jou", "Er is geen koppeling met je mailbox."),
  d("rekening", "Jaarabonnement", "Verlengt het in januari? Zet de datum klaar.", "€89,00", "vervalt 20 dec"),
  d("tip", "Januari staat al klaar", "Nieuwe premies komen eraan. Stuur ze door als ze er zijn."),
  d("rekening", "Huur januari", "Alvast in je agenda, voor je het weet.", "€825", "vervalt 3 jan"),
  d("tip", "Bijna kerst", "Stuur nu door wat al binnen is. Dan kun je loslaten."),
  d("wens", "Fijne feestdagen", "Jij viert december. Buddy onthoudt de rest."),
];

export const defaultStoryProps: StoryProps = {
  day: 1,
  tags: { chocola: "Chocola", rekening: "Rekening van de dag", tip: "Tip van de dag", wens: "Fijne feestdagen" },
  doorLabel: "Deurtje",
  footerChip: "Doorsturen · seintje 7 en 2 dagen vooraf",
  doors: defaultStoryDoors,
  colors: defaultDecColors,
};
