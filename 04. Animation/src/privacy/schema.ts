import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Concept 3 · "Jij kiest wat Buddy ziet." (privacy)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.

const privateMail = z.object({
  from: z.string(),
  subject: z.string(),
});

export const privacySchema = z.object({
  // Personal mails: sharp in the hook (an app would read them),
  // out of focus around Buddy in scene 2 (he does not look).
  privateMails: z.array(privateMail).length(4),
  hook: z.object({
    headline: z.string(),
    dialogTitle: z.string(),
    // The first permission is the one that gets flagged red.
    permissions: z.array(z.string()).length(3),
    deny: z.string(),
    allow: z.string(),
  }),
  blind: z.object({
    headline: z.string(),
    subline: z.string(),
  }),
  read: z.object({
    headline: z.string(),
    subline: z.string(),
    forwardedChip: z.string(),
    fromLabel: z.string(),
    subjectLabel: z.string(),
    greeting: z.string(),
    signOff: z.string(),
    // The four lines Buddy picks out of the forwarded mail.
    fields: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          link: z.boolean(),
        }),
      )
      .length(4),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
    tagline: z.string(),
    button: z.string(),
    subline: z.string(),
  }),
  colors: z.object({
    blue: zColor(),
    light: zColor(),
    softBlue: zColor(),
    bodyOnBlue: zColor(),
    alert: zColor(),
  }),
  timing: z.object({
    hook: z.number().min(2.6).max(8),
    blind: z.number().min(2.6).max(8),
    read: z.number().min(3.6).max(10),
    cta: z.number().min(3).max(8),
    transition: z.number().min(0.2).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type PrivacyProps = z.infer<typeof privacySchema>;

export const defaultPrivacyProps: PrivacyProps = {
  privateMails: [
    { from: "Mam", subject: "Zondag eten?" },
    { from: "Huisarts", subject: "Uitslag bloedonderzoek" },
    { from: "Werkgever", subject: "Je salarisstrook" },
    { from: "Je ex", subject: "Kunnen we praten?" },
  ],
  hook: {
    headline: "Moet een app echt\nal je mail lezen?",
    dialogTitle: "Een app wil toegang\ntot je mailbox",
    permissions: ["Al je e-mails lezen", "Je contacten bekijken", "Mails versturen en verwijderen"],
    deny: "Weigeren",
    allow: "Toestaan",
  },
  blind: {
    headline: "Buddy kijkt niet\nin je mailbox.",
    subline: "Geen mailboxkoppeling.\nJe mail blijft van jou.",
  },
  read: {
    headline: "Hij leest alleen\nwat jij doorstuurt.",
    subline: "Daarmee herinnert hij je op tijd.\nJe andere mail ziet hij nooit.",
    forwardedChip: "Doorgestuurd",
    fromLabel: "Van",
    subjectLabel: "Onderwerp",
    greeting: "Beste klant,",
    signOff: "Met vriendelijke groet",
    fields: [
      { label: "Te betalen", value: "€37,85", link: false },
      { label: "Vervaldatum", value: "28 oktober", link: false },
      { label: "Kenmerk", value: "4471 0923 5518", link: false },
      { label: "Betaallink", value: "Betaal direct", link: true },
    ],
  },
  bill: {
    sender: "Telefoonprovider",
    subject: "Je factuur van oktober",
  },
  cta: {
    tagline: "Jij kiest\nwat Buddy ziet.",
    button: "activeer buddy",
    subline: "Geen app. Geen bankkoppeling.",
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.red,
  },
  timing: {
    hook: 3.2,
    blind: 3.4,
    read: 4.6,
    cta: 3.6,
    transition: 0.4,
  },
  music: "",
  musicVolume: 0.6,
  showSafeZones: false,
};

export const FPS = 30;

export const privacyFrames = (t: PrivacyProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    hook: f(t.hook),
    blind: f(t.blind),
    read: f(t.read),
    cta: f(t.cta),
    transition: f(t.transition),
  };
};

export const privacyTotal = (t: PrivacyProps["timing"]) => {
  const s = privacyFrames(t);
  return s.hook + s.blind + s.read + s.cta - 3 * s.transition;
};
