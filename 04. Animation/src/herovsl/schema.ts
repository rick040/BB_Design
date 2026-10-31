import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Hero VSL for the homepage (betaalbuddy.nl). Autoplays muted and loops, so
// everything is told in on-screen text. The first scene (~5 s) is the whole
// pitch: forward → Buddy reminds you → you pay on time. Scenes 2–4 explain
// the three steps in more detail, scene 5 is the promise + CTA, and the last
// frames slide back into frame 0 so the loop has no visible seam.
//
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a title or body forces a line break.

export const heroVslSchema = z.object({
  // The example bill that travels through the whole video.
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    dueLabel: z.string(),
  }),
  pitch: z.object({
    overline: z.string(),
    // The three-step pitch. Line 1 is on screen from frame 0.
    lines: z.array(z.string()).length(3),
    forwardButton: z.string(),
    remind7: z.object({ text: z.string(), time: z.string() }),
    remind2: z.object({ text: z.string(), time: z.string() }),
    paidTitle: z.string(),
    paidText: z.string(),
    // Two chips that get crossed out: what you no longer get.
    crossedOut: z.array(z.string()).length(2),
  }),
  // Labels of the step indicator shown during scenes 2–4.
  steps: z.array(z.string()).length(3),
  send: z.object({
    title: z.string(),
    body: z.string(),
    composeTitle: z.string(),
    toLabel: z.string(),
    address: z.string(),
    subjectLabel: z.string(),
    subjectLine: z.string(),
    sendButton: z.string(),
    autoLabel: z.string(),
    autoNote: z.string(),
  }),
  read: z.object({
    title: z.string(),
    body: z.string(),
    greeting: z.string(),
    // The four lines Buddy picks out of the forwarded mail.
    fields: z
      .array(z.object({ label: z.string(), value: z.string(), chip: z.string() }))
      .length(4),
  }),
  remind: z.object({
    title: z.string(),
    body: z.string(),
    month: z.string(),
    weekdays: z.array(z.string()).length(7),
    // Day number in the first cell (a Monday); two weeks are shown.
    firstDay: z.number().int().min(1).max(31),
    daysInMonth: z.number().int().min(28).max(31),
    dueDay: z.number().int().min(1).max(31),
    eventLabel: z.string(),
    remind7: z.object({ text: z.string(), time: z.string() }),
    remind2: z.object({ text: z.string(), time: z.string() }),
  }),
  end: z.object({
    // First line white, the rest soft blue.
    headline: z.string(),
    subline: z.string(),
    button: z.string(),
    showButton: z.boolean(),
  }),
  colors: z.object({
    blue: zColor(),
    light: zColor(),
    softBlue: zColor(),
    bodyOnBlue: zColor(),
    alert: zColor(),
  }),
  timing: z.object({
    pitch: z.number().min(5).max(10),
    send: z.number().min(2.6).max(8),
    read: z.number().min(2.6).max(8),
    remind: z.number().min(2.8).max(8),
    end: z.number().min(2.6).max(8),
    transition: z.number().min(0.2).max(1),
    // The last frames slide back into frame 0 (seamless loop).
    loopIn: z.number().min(0).max(1),
  }),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
});

export type HeroVslProps = z.infer<typeof heroVslSchema>;

export const defaultHeroVslProps: HeroVslProps = {
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van november",
    amount: "€86,40",
    dueLabel: "Vervalt 27 nov",
  },
  pitch: {
    overline: "Zo werkt BetaalBuddy",
    lines: ["Stuur je rekening door.", "Buddy seint je op tijd.", "Jij betaalt op tijd."],
    forwardButton: "Doorsturen",
    remind7: { text: "Nog 7 dagen · €86,40", time: "20 nov" },
    remind2: { text: "Nog 2 dagen · betaal op tijd", time: "25 nov" },
    paidTitle: "Betaald",
    paidText: "Energieleverancier · op tijd",
    crossedOut: ["Aanmaning", "Extra kosten"],
  },
  steps: ["Stuur door", "Buddy onthoudt", "Seintje op tijd"],
  send: {
    title: "Stuur je rekening door naar je eigen Buddy-adres.",
    body: "Met de hand, of automatisch met één filterregel in je mail.",
    composeTitle: "Doorsturen",
    toLabel: "Aan",
    address: "jouwnaam@in.betaalbuddy.nl",
    subjectLabel: "Onderwerp",
    subjectLine: "Fwd: Je factuur van november",
    sendButton: "Verstuur",
    autoLabel: "Automatisch doorsturen",
    autoNote: "Voor je vaste afzenders",
  },
  read: {
    title: "Buddy haalt eruit wat telt.",
    body: "Alleen uit wat jij doorstuurt.\nJe mailbox ziet hij nooit.",
    greeting: "Beste klant,",
    fields: [
      { label: "Te betalen", value: "€86,40", chip: "€86,40" },
      { label: "Vervaldatum", value: "27 november", chip: "27 nov" },
      { label: "Kenmerk", value: "4471 0923 5518", chip: "Kenmerk" },
      { label: "Betaallink", value: "Betaal direct", chip: "Betaallink" },
    ],
  },
  remind: {
    title: "Jij krijgt op tijd een seintje.",
    body: "7 en 2 dagen vooraf in je mail.\nDe vervaldatum staat in je agenda.",
    month: "november",
    weekdays: ["ma", "di", "wo", "do", "vr", "za", "zo"],
    firstDay: 16,
    daysInMonth: 30,
    dueDay: 27,
    eventLabel: "Energie €86,40",
    remind7: { text: "Nog 7 dagen · €86,40", time: "20 nov" },
    remind2: { text: "Nog 2 dagen · betaal op tijd", time: "25 nov" },
  },
  end: {
    headline: "Nooit meer een\nrekening vergeten.",
    subline: "Geen app. Geen bankkoppeling.",
    button: "activeer buddy",
    showButton: true,
  },
  colors: {
    blue: brand.blue,
    light: brand.light,
    softBlue: brand.blueSoft,
    bodyOnBlue: brand.blueText,
    alert: brand.red,
  },
  timing: {
    pitch: 5.6,
    send: 3.4,
    read: 3.2,
    remind: 3.6,
    end: 3.4,
    transition: 0.4,
    loopIn: 0.4,
  },
  music: "",
  musicVolume: 0.6,
};

export const FPS = 30;

export const heroVslFrames = (t: HeroVslProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  return {
    pitch: f(t.pitch),
    send: f(t.send),
    read: f(t.read),
    remind: f(t.remind),
    end: f(t.end),
    transition: f(t.transition),
    loopIn: f(t.loopIn),
  };
};

export const heroVslTotal = (t: HeroVslProps["timing"]) => {
  const s = heroVslFrames(t);
  return s.pitch + s.send + s.read + s.remind + s.end - 4 * s.transition;
};

/** Global frame at which each scene starts (transitions overlap). */
export const heroVslStarts = (t: HeroVslProps["timing"]) => {
  const s = heroVslFrames(t);
  const send = s.pitch - s.transition;
  const read = send + s.send - s.transition;
  const remind = read + s.read - s.transition;
  const end = remind + s.remind - s.transition;
  return { pitch: 0, send, read, remind, end };
};
