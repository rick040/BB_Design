import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";

// Hero VSL for the homepage (betaalbuddy.nl). Autoplays muted and loops, so
// everything is told in on-screen text. Deliberately calm: one short line on
// top, one object in the middle, Buddy below, always in the same place.
//
//   Step 1  "Stuur je rekening door."   the bill flies to Buddy
//   Step 2  "Buddy seint je op tijd."   one reminder rises out of Buddy
//   Step 3  "Jij betaalt op tijd."      "Betaald" with a checkmark (≈3.7 s)
//   USPs    three rows: any mail app · we don't keep your mail · no AI
//   End     promise + button + wordmark, then it slides back to frame 0.
//
// Every field below is editable in Remotion Studio (Props panel).

export const heroVslSchema = z.object({
  // The example bill.
  bill: z.object({
    sender: z.string(),
    dueLabel: z.string(),
    amount: z.string(),
    forwardButton: z.string(),
  }),
  // One line per step, shown one at a time.
  steps: z.array(z.string()).length(3),
  reminder: z.object({ text: z.string(), time: z.string() }),
  paid: z.object({ title: z.string(), text: z.string() }),
  // Three USPs, shown one by one on blue after the steps.
  usps: z
    .array(z.object({ icon: z.enum(["mail", "privacy", "noAi"]), text: z.string() }))
    .length(3),
  end: z.object({
    // First line white, the rest soft blue. "\n" = line break.
    headline: z.string(),
    // Optional small line under the headline; leave empty to hide it.
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
    step1: z.number().min(1.4).max(6),
    step2: z.number().min(1.4).max(6),
    step3: z.number().min(1.6).max(8),
    usps: z.number().min(1.6).max(8),
    end: z.number().min(2.2).max(8),
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
    dueLabel: "Vervalt 27 nov",
    amount: "€86,40",
    forwardButton: "Doorsturen",
  },
  steps: ["Stuur je rekening door.", "Buddy seint je op tijd.", "Jij betaalt op tijd."],
  reminder: { text: "Nog 2 dagen · €86,40", time: "25 nov" },
  paid: { title: "Betaald", text: "Op tijd, zonder extra kosten" },
  usps: [
    { icon: "mail", text: "Werkt met elk mailprogramma" },
    // Exact claim: the mail itself is not stored. Amount, date and a few
    // details are kept until 14 days after the due date, so never say
    // "we slaan niets op".
    { icon: "privacy", text: "We bewaren je mail niet" },
    { icon: "noAi", text: "Geen AI die je mail leest" },
  ],
  end: {
    headline: "Nooit meer een\nrekening vergeten.",
    subline: "",
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
    step1: 1.8,
    step2: 1.7,
    step3: 2.1,
    usps: 2.8,
    end: 3.0,
    transition: 0.4,
    loopIn: 0.4,
  },
  music: "",
  musicVolume: 0.6,
};

export const FPS = 30;

export const heroVslFrames = (t: HeroVslProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  const step1 = f(t.step1);
  const step2 = f(t.step2);
  const step3 = f(t.step3);
  return {
    step1,
    step2,
    step3,
    // Steps 1–3 are one continuous shot.
    steps: step1 + step2 + step3,
    usps: f(t.usps),
    end: f(t.end),
    transition: f(t.transition),
    loopIn: f(t.loopIn),
  };
};

export const heroVslTotal = (t: HeroVslProps["timing"]) => {
  const s = heroVslFrames(t);
  return s.steps + s.usps + s.end - 2 * s.transition;
};
