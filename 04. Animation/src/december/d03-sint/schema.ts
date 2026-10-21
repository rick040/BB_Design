import { z } from "zod";
import { decColorsSchema, defaultDecColors, FPS } from "../common";

// Idee 3 · "Sint heeft zijn boek" (Reel)
// Elk veld is bewerkbaar in Remotion Studio. "\n" in een kop of subregel = nieuwe regel.
// Sinterklaas komt alleen voor via het boek: geen figuren, geen Pieten.

const bookRow = z.object({ name: z.string(), date: z.string() });
const inboxMail = z.object({ from: z.string(), subject: z.string(), time: z.string() });
const agendaItem = z.object({
  day: z.string(),
  month: z.string(),
  title: z.string(),
  // 7 of 2 = seintje dat aantal dagen vooraf, 0 = de vervaldatum zelf
  kind: z.number().min(0).max(7),
});

export const sintSchema = z.object({
  hook: z.object({
    headline: z.string(),
    coverTitle: z.string(),
  }),
  // Het boek is een lijst namen en data: eerst de linker pagina (5), dan de rechter (5).
  book: z.object({ rows: z.array(bookRow).length(10) }),
  inbox: z.object({
    headline: z.string(),
    subline: z.string(),
    search: z.string(),
    mails: z.array(inboxMail).length(8),
  }),
  forward: z.object({
    headline: z.string(),
    subline: z.string(),
    mailFrom: z.string(),
    mailSubject: z.string(),
    mailLine1: z.string(),
    mailLine2: z.string(),
    button: z.string(),
    agendaTitle: z.string(),
    agenda: z.array(agendaItem).length(3),
  }),
  cta: z.object({
    headline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  colors: decColorsSchema,
  timing: z.object({
    hook: z.number().min(2.6).max(8),
    inbox: z.number().min(3).max(8),
    forward: z.number().min(4).max(9),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type SintProps = z.infer<typeof sintSchema>;

export const defaultSintProps: SintProps = {
  hook: {
    headline: "Sint heeft zijn\ngrote boek.",
    coverTitle: "Het grote boek",
  },
  book: {
    rows: [
      { name: "Lotte", date: "2 dec" },
      { name: "Daan", date: "3 dec" },
      { name: "Fleur", date: "3 dec" },
      { name: "Sem", date: "4 dec" },
      { name: "Noor", date: "4 dec" },
      { name: "Milan", date: "5 dec" },
      { name: "Julia", date: "5 dec" },
      { name: "Thijs", date: "5 dec" },
      { name: "Eva", date: "6 dec" },
      { name: "Luuk", date: "6 dec" },
    ],
  },
  inbox: {
    headline: "Jij hebt een\nvolle inbox.",
    subline: "Waar stond die factuur ook alweer?",
    search: "factuur",
    mails: [
      { from: "Webshop", subject: "Factuur voor je bestelling", time: "09:41" },
      { from: "Verhuurder", subject: "Factuur huur januari", time: "08:15" },
      { from: "Zorgverzekeraar", subject: "Je factuur voor januari", time: "gisteren" },
      { from: "Energieleverancier", subject: "Je jaarfactuur is klaar", time: "gisteren" },
      { from: "Telefoonprovider", subject: "Factuur van november", time: "zo" },
      { from: "Sportschool", subject: "Factuur contributie", time: "za" },
      { from: "Pakketdienst", subject: "Factuur verzendkosten", time: "vr" },
      { from: "Webshop", subject: "Betaalverzoek en factuur", time: "do" },
    ],
  },
  forward: {
    headline: "Eén mail door.\nNetjes in je agenda.",
    subline: "Seintje 7 en 2 dagen vooraf.",
    mailFrom: "Zorgverzekeraar",
    mailSubject: "Je factuur voor januari",
    mailLine1: "Te betalen voor 28 december",
    mailLine2: "Betaal direct via de link",
    button: "Doorsturen",
    agendaTitle: "Agenda",
    agenda: [
      { day: "21", month: "dec", title: "Zorgpremie over 7 dagen", kind: 7 },
      { day: "26", month: "dec", title: "Zorgpremie over 2 dagen", kind: 2 },
      { day: "28", month: "dec", title: "Zorgpremie vervalt", kind: 0 },
    ],
  },
  cta: {
    headline: "Jij hebt\nBuddy.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: defaultDecColors,
  timing: { hook: 3.4, inbox: 3.8, forward: 5.0, cta: 3.8, transition: 0.4 },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const sintFrames = (t: SintProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return { hook: f(t.hook), inbox: f(t.inbox), forward: f(t.forward), cta: f(t.cta), transition: f(t.transition) };
};

export const sintTotal = (t: SintProps["timing"]) => {
  const s = sintFrames(t);
  return s.hook + s.inbox + s.forward + s.cta - 3 * s.transition;
};
