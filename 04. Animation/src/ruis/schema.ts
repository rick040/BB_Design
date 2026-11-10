import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import voTiming from "../../public/vo/ruis/timing.json";
import { brand } from "../theme";

// Concept 59 · "Geen ruis. Gewoon op tijd." (radio afstemmen)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.
//
// The animation follows the voice-over, not the other way round: the scene
// starts come from public/vo/ruis/timing.json (measured with the ElevenLabs
// character timestamps of one single take). Regenerate the take, rewrite
// timing.json, and the scenes move with it.

export const ruisSchema = z.object({
  hook: z.object({
    headline: z.string(),
    // Mail in the static; the bill (see `bill`) is drawn on top of these.
    noiseMails: z.array(z.object({ from: z.string(), subject: z.string() })).length(3),
    overdue: z.string(),
    costChip: z.string(),
  }),
  tune: z.object({
    headline: z.string(),
    forwardedChip: z.string(),
    station: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    // Seven day tiles; `billDay` and `reminderDay` are indexes into it.
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(7),
    billDay: z.number().int().min(0).max(6),
    reminderDay: z.number().int().min(0).max(6),
    reminderLabel: z.string(),
  }),
  bill: z.object({
    sender: z.string(),
    subject: z.string(),
    amount: z.string(),
    due: z.string(),
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
  voice: z.object({
    withVoice: z.boolean(),
    src: z.string(),
    volume: z.number().min(0).max(1),
    // Frame (30 fps) where each spoken scene cue starts: [S2], [S3], [S4],
    // and the frame where the last word ends. Defaults from timing.json.
    s2: z.number().int().min(30),
    s3: z.number().int().min(45),
    s4: z.number().int().min(60),
    end: z.number().int().min(90),
  }),
  timing: z.object({
    // Transition length in frames; a transition starts `lead` frames
    // before the spoken cue so the new picture is there as the word lands.
    transition: z.number().int().min(6).max(24),
    lead: z.number().int().min(0).max(12),
    // Seconds of CTA after the last spoken word.
    tail: z.number().min(0.5).max(3),
  }),
  showSafeZones: z.boolean(),
});

export type RuisProps = z.infer<typeof ruisSchema>;

const cue = voTiming.scenes;

export const defaultRuisProps: RuisProps = {
  hook: {
    headline: "Raakt jouw rekening\nzoek in de ruis?",
    noiseMails: [
      { from: "Webshop", subject: "Sale: alles moet weg" },
      { from: "Pakketdienst", subject: "Je pakket is onderweg" },
      { from: "Sportschool", subject: "Nieuw rooster" },
    ],
    overdue: "Aanmaning",
    costChip: "Kan uitlopen op €40",
  },
  tune: {
    headline: "Stuur hem door\nnaar Buddy.",
    forwardedChip: "Doorgestuurd",
    station: "Buddy",
  },
  agenda: {
    headline: "Buddy zet hem\nin je agenda.",
    subline: "Jij kiest wanneer je\neen herinnering krijgt.",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
      { day: "za", date: "19" },
      { day: "zo", date: "20" },
    ],
    billDay: 3,
    reminderDay: 0,
    reminderLabel: "Herinnering",
  },
  bill: {
    sender: "Energieleverancier",
    subject: "Je factuur van december",
    amount: "€87,60",
    due: "Vervalt do 17 dec",
  },
  cta: {
    tagline: "Geen ruis.\nGewoon op tijd.",
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
  voice: {
    withVoice: true,
    src: "vo/ruis/voice-over.mp3",
    volume: 1,
    s2: cue.S2.frame,
    s3: cue.S3.frame,
    s4: cue.S4.frame,
    end: voTiming.voFrames,
  },
  timing: {
    transition: 12,
    lead: 6,
    tail: 1.0,
  },
  showSafeZones: false,
};

export const FPS = 30;

/** Sequence lengths so that each transition is centred-ish on its spoken cue. */
export const ruisFrames = (v: RuisProps["voice"], t: RuisProps["timing"]) => {
  const T = t.transition;
  const start2 = v.s2 - t.lead;
  const start3 = v.s3 - t.lead;
  const start4 = v.s4 - t.lead;
  const total = v.end + Math.round(t.tail * FPS);
  return {
    transition: T,
    hook: start2 + T,
    tune: start3 - start2 + T,
    agenda: start4 - start3 + T,
    cta: total - start4,
    total,
  };
};

export const ruisTotal = (v: RuisProps["voice"], t: RuisProps["timing"]) => ruisFrames(v, t).total;
