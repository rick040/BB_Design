import { z } from "zod";

// Walkthrough "Stel je Buddy in" (setup page /stel-je-buddy-in/).
// Every field below is editable in Remotion Studio (Props panel).
// Text between **stars** is bold. "\n" forces a line break.
// The phone screens copy their labels from the live page on purpose
// ("Open mijn mail", "Kopieer", ...), so they are not props.

const step = z.object({
  title: z.string(),
  // The instructions that tick off one by one while the phone shows them.
  items: z.array(z.string()).length(3),
  noteLabel: z.string(),
  note: z.string(),
});

export const walkthroughSchema = z.object({
  intro: z.object({
    title: z.string(),
    subtitle: z.string(),
    // The step list as on the page (label + small line under it).
    steps: z.array(z.object({ label: z.string(), sub: z.string() })).length(5),
  }),
  step1: z.object({
    title: z.string(),
    items: z.array(z.string()).length(2),
    noteLabel: z.string(),
    note: z.string(),
  }),
  step2: step,
  step3: step,
  step4: step,
  step5: step,
  done: z.object({
    title: z.string(),
    lead: z.string(),
    // Same rows as the summary on the page's "Klaar" screen.
    summary: z.array(z.string()).length(5),
    url: z.string(),
  }),
  // Example data shown on the phone. Not real accounts.
  example: z.object({
    yourMail: z.string(),
    adres: z.string(),
    agenda: z.string(),
    billSender: z.string(),
    billSubject: z.string(),
    billAmount: z.string(),
    billDue: z.string(),
    // Due date of the test bill (the page uses today + 14 days).
    testDue: z.string(),
    testDueLong: z.string(),
  }),
  timing: z.object({
    intro: z.number().min(4.4).max(10),
    step1: z.number().min(8.8).max(16),
    step2: z.number().min(10).max(18),
    step3: z.number().min(12.4).max(20),
    step4: z.number().min(8.8).max(16),
    step5: z.number().min(10.6).max(18),
    done: z.number().min(5).max(12),
    transition: z.number().min(0.3).max(1),
  }),
  voiceover: z.string(),
  voiceoverVolume: z.number().min(0).max(1),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
});

export type WalkthroughProps = z.infer<typeof walkthroughSchema>;

export const defaultWalkthroughProps: WalkthroughProps = {
  intro: {
    title: "Stel je\nBuddy in",
    subtitle: "5 korte stappen, samen\nongeveer 5 minuten.",
    steps: [
      { label: "Vraag je adres aan", sub: "Eén mailtje sturen" },
      { label: "Plak je gegevens", sub: "Uit de mail die je terugkrijgt" },
      { label: "Stuur rekeningen door", sub: "Met de hand of automatisch" },
      { label: "Zet de agenda aan", sub: "Eén tik, mag ook later" },
      { label: "Doe één test", sub: "Dan weet je zeker dat het werkt" },
    ],
  },
  step1: {
    title: "Vraag je eigen\nadres aan",
    items: ["Tik op **Open mijn mail**.", "Er staat al een mail klaar.\nDruk op **Verstuur**."],
    noteLabel: "Belangrijk",
    note: "Stuur hem vanaf het mailadres waar je je herinneringen wilt krijgen. Dat adres wordt je account.",
  },
  step2: {
    title: "Plak wat je van\nons terugkrijgt",
    items: [
      "Je krijgt een mail terug met je **doorstuuradres** en **agendalink**.",
      "Kopieer de hele mail.",
      "Plak hem op de pagina. Wij halen de goede stukken eruit.",
    ],
    noteLabel: "Geen mail?",
    note: "Wacht een paar minuten en kijk ook in je spam.",
  },
  step3: {
    title: "Stuur je\nrekeningen door",
    items: ["Open de rekening in je mail.", "Kies **Doorsturen**.", "Plak je doorstuuradres en verstuur."],
    noteLabel: "Optioneel",
    note: "Liever automatisch? Kies je mail op de pagina. Dan maak je een regel die alleen rekeningen doorstuurt.",
  },
  step4: {
    title: "Zet je vervaldatums\nin je agenda",
    items: ["Kies je agenda.", "Tik op **Abonneer**.", "Je vervaldatums komen er nu vanzelf in."],
    noteLabel: "Mag ook later",
    note: "Geen agenda? Sla deze stap over. De mails zijn genoeg.",
  },
  step5: {
    title: "Doe één test",
    items: [
      "Tik op **Open proefmail**.\nOf stuur een echte rekening door.",
      "Druk op **Verstuur**.",
      "Je krijgt een mail terug met het bedrag en de vervaldatum.",
    ],
    noteLabel: "Proefmail?",
    note: "Tik dan op **Al betaald** en hij is weg.",
  },
  done: {
    title: "Klaar.\nJe Buddy let op.",
    lead: "Vanaf nu stuur je een rekening door\nen wij seinen je op tijd.",
    summary: ["Startmail verstuurd", "Doorstuuradres ingevuld", "Rekeningen doorsturen", "Agenda aangezet", "Test gelukt"],
    url: "betaalbuddy.nl/stel-je-buddy-in",
  },
  example: {
    yourMail: "sanne@mijnmail.nl",
    adres: "a8f3k@in.betaalbuddy.nl",
    agenda: "https://api.betaalbuddy.nl/ics/a8f3k.ics",
    billSender: "Energieleverancier",
    billSubject: "Je factuur van oktober",
    billAmount: "€ 84,20",
    billDue: "28 oktober 2026",
    testDue: "02-11-2026",
    testDueLong: "2 november 2026",
  },
  timing: {
    intro: 5,
    step1: 9.4,
    step2: 10.6,
    step3: 13,
    step4: 9.2,
    step5: 11.2,
    done: 6.4,
    transition: 0.5,
  },
  voiceover: "",
  voiceoverVolume: 1,
  music: "",
  musicVolume: 0.25,
};

export const FPS = 30;

export const walkthroughFrames = (t: WalkthroughProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    intro: f(t.intro),
    step1: f(t.step1),
    step2: f(t.step2),
    step3: f(t.step3),
    step4: f(t.step4),
    step5: f(t.step5),
    done: f(t.done),
    transition: f(t.transition),
  };
};

export const walkthroughTotal = (t: WalkthroughProps["timing"]) => {
  const s = walkthroughFrames(t);
  return s.intro + s.step1 + s.step2 + s.step3 + s.step4 + s.step5 + s.done - 6 * s.transition;
};
