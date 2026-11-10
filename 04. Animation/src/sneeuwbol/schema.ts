import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import { VO_AUDIO_SEC, VO_FILE, VO_SCENES_SEC } from "./vo";

// Concept 62 · "Laat de rest maar dwarrelen." (sneeuwbol)
// Every field below is editable in Remotion Studio (Props panel).
// Tip: "\n" in a headline or subline forces a line break.
// Scene starts come from the voice-over (public/vo/sneeuwbol/timing.json);
// each transition is centred on the spoken cue.

export const sneeuwbolSchema = z.object({
  bill: z.object({
    sender: z.string(),
    shortSender: z.string(),
    subject: z.string(),
    amount: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    reminderSubject: z.string(),
    reminderStamp: z.string(),
    reminderDue: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    fromLabel: z.string(),
    forwardButton: z.string(),
  }),
  catch: z.object({
    headline: z.string(),
    subline: z.string(),
    // Five weekdays shown in the agenda strip.
    days: z.array(z.object({ day: z.string(), date: z.string() })).length(5),
    billDay: z.number().int().min(0).max(4),
    reminderDay: z.number().int().min(0).max(4),
    reminderLabel: z.string(),
  }),
  cta: z.object({
    // First line is white, the rest soft blue.
    tagline: z.string(),
    tileDay: z.string(),
    tileDate: z.string(),
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
    // Scene starts in seconds (from the voice-over alignment).
    forwardStart: z.number().min(1).max(20),
    catchStart: z.number().min(1.5).max(25),
    ctaStart: z.number().min(2).max(30),
    // Total length = voice-over length + this hold for the CTA.
    voiceSec: z.number().min(1).max(40),
    ctaHold: z.number().min(0).max(5),
    transition: z.number().min(0.2).max(1),
  }),
  withVoice: z.boolean(),
  voiceFile: z.string(),
  voiceVolume: z.number().min(0).max(1),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type SneeuwbolProps = z.infer<typeof sneeuwbolSchema>;

export const defaultSneeuwbolProps: SneeuwbolProps = {
  bill: {
    sender: "Energieleverancier",
    shortSender: "Energie",
    subject: "Je factuur van november",
    amount: "€87,60",
  },
  hook: {
    headline: "Dwarrelt jouw\nrekening ook weg?",
    reminderSubject: "Herinnering",
    reminderStamp: "AANMANING",
    reminderDue: "Vervallen",
    costChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door\nnaar Buddy.",
    fromLabel: "Van",
    forwardButton: "Doorsturen",
  },
  catch: {
    headline: "Buddy zet hem\nin je agenda.",
    subline: "Met een herinnering\nwanneer jij dat wilt.",
    days: [
      { day: "ma", date: "14" },
      { day: "di", date: "15" },
      { day: "wo", date: "16" },
      { day: "do", date: "17" },
      { day: "vr", date: "18" },
    ],
    billDay: 3,
    reminderDay: 0,
    reminderLabel: "Herinnering",
  },
  cta: {
    tagline: "Laat de rest\nmaar dwarrelen.",
    tileDay: "do",
    tileDate: "17",
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
    forwardStart: VO_SCENES_SEC[1],
    catchStart: VO_SCENES_SEC[2],
    ctaStart: VO_SCENES_SEC[3],
    voiceSec: VO_AUDIO_SEC,
    ctaHold: 1.25,
    transition: 0.4,
  },
  withVoice: true,
  voiceFile: VO_FILE,
  voiceVolume: 1,
  music: "",
  musicVolume: 0.3,
  showSafeZones: false,
};

export const FPS = 30;

/**
 * Scene lengths so that every transition is centred on its spoken cue.
 * `starts` are the global frames where each scene's sequence begins.
 */
export const sneeuwbolFrames = (t: SneeuwbolProps["timing"]) => {
  const f = (s: number) => Math.round(s * FPS);
  const tr = f(t.transition);
  const half = Math.floor(tr / 2);
  const total = f(t.voiceSec + t.ctaHold);
  const s2 = f(t.forwardStart);
  const s3 = f(t.catchStart);
  const s4 = f(t.ctaStart);
  return {
    transition: tr,
    total,
    hook: s2 + half,
    forward: s3 - s2 + tr,
    catch: s4 - s3 + tr,
    cta: total - (s4 - half),
    starts: [0, s2 - half, s3 - half, s4 - half],
  };
};

export const sneeuwbolTotal = (t: SneeuwbolProps["timing"]) => sneeuwbolFrames(t).total;
