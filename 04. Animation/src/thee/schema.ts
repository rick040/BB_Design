import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import voTiming from "../../public/vo/thee/timing.json";

// Concept 58 · "Thee laat je trekken. Rekeningen niet." (theezakje)
// Every field below is editable in Remotion Studio (Props panel).
// Scene starts follow the voice-over: public/vo/thee/timing.json holds the
// frame where each [S1]..[S4] cue starts in the single ElevenLabs take.

export const theeSchema = z.object({
  bill: z.object({
    sender: z.string(),
    amount: z.string(),
    dueDay: z.string(),
    dueWeekday: z.string(),
    dueMonth: z.string(),
  }),
  hook: z.object({
    headline: z.string(),
    subline: z.string(),
    // Time-passing chip next to the mug, one label per step.
    lying: z.array(z.string()).length(3),
    reminderLabel: z.string(),
    costChip: z.string(),
  }),
  forward: z.object({
    headline: z.string(),
    subject: z.string(),
    button: z.string(),
    toChip: z.string(),
  }),
  agenda: z.object({
    headline: z.string(),
    subline: z.string(),
    reminder: z.string(),
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
  tea: z.object({
    fresh: zColor(),
    bitter: zColor(),
  }),
  timing: z.object({
    // Frames before a cue at which the transition to that scene starts.
    leadIn: z.number().int().min(0).max(20),
    transition: z.number().int().min(4).max(20),
    // Seconds after the last spoken word, for the CTA to land.
    tail: z.number().min(0.5).max(3),
  }),
  withVoice: z.boolean(),
  voice: z.string(),
  voiceVolume: z.number().min(0).max(1),
  music: z.string(),
  musicVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type TheeProps = z.infer<typeof theeSchema>;

export const defaultTheeProps: TheeProps = {
  bill: {
    sender: "Energieleverancier",
    amount: "€87,60",
    dueDay: "17",
    dueWeekday: "do",
    dueMonth: "dec",
  },
  hook: {
    headline: "Een rekening\nis net thee.",
    subline: "Hoe langer hij ligt,\nhoe bitterder.",
    lying: ["Ligt er 2 dagen", "Ligt er 1 week", "Ligt er 3 weken"],
    reminderLabel: "Aanmaning",
    costChip: "Kan uitlopen op €40",
  },
  forward: {
    headline: "Stuur hem door.",
    subject: "Je factuur van november",
    button: "Doorsturen",
    toChip: "Naar Buddy",
  },
  agenda: {
    headline: "Buddy zet hem op tijd\nin je agenda.",
    subline: "Met een herinnering\nwanneer jij kiest.",
    reminder: "Herinnering · ma 14 dec",
  },
  cta: {
    tagline: "Thee laat je trekken.\nRekeningen niet.",
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
  tea: {
    fresh: "#e9b872",
    bitter: "#4a2612",
  },
  timing: {
    leadIn: 8,
    transition: 10,
    tail: 1.0,
  },
  withVoice: true,
  voice: "vo/thee/voice-over.mp3",
  voiceVolume: 1,
  music: "",
  musicVolume: 0.3,
  showSafeZones: false,
};

export const FPS = voTiming.fps;
export const VO = voTiming;

/** Cue frame per scene (1-based scene number) from timing.json. */
export const cueFrame = (scene: number) => {
  const c = voTiming.cues.find((x) => x.scene === scene);
  if (!c) throw new Error(`No cue for scene ${scene} in timing.json`);
  return c.frame;
};

/**
 * Scene lengths so that the transition into scene k starts `leadIn` frames
 * before its spoken cue. TransitionSeries overlaps each transition, so a
 * scene's length includes the transition into the next one.
 */
export const theeFrames = (t: TheeProps["timing"]) => {
  const total = voTiming.voice_end_frame + Math.round(t.tail * FPS);
  const starts = [0, cueFrame(2) - t.leadIn, cueFrame(3) - t.leadIn, cueFrame(4) - t.leadIn];
  const len = (k: number) => (k < 3 ? starts[k + 1] - starts[k] + t.transition : total - starts[k]);
  return {
    starts,
    hook: len(0),
    forward: len(1),
    agenda: len(2),
    cta: len(3),
    transition: t.transition,
    total,
  };
};

export const theeTotal = (t: TheeProps["timing"]) => theeFrames(t).total;
