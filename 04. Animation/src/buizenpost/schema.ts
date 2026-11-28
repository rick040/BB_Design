import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { brand } from "../theme";
import vo from "../../public/vo/buizenpost/timing.json";

// Concept 128 · "Alleen wat jij erin stopt." (buizenpost)
// One continuous shot: the camera follows a pneumatic-post capsule from your
// mailbox down a tube to Buddy. There are no scene cuts; the [S1]..[S5]
// markers of the voice-over set the camera beats (public/vo/buizenpost/timing.json).
// timing.json is an estimate until the voice exists; regenerate it with
//   python3 scripts/vo_to_timing.py public/vo/buizenpost/script.txt public/vo/buizenpost/timing.json --alignment public/vo/buizenpost/vo.json
// and every beat below follows the real voice.

export const FPS = 30;

export const SCENE_STARTS = vo.sceneStarts as [number, number, number, number, number];
export const VOICE_END = vo.voiceEnd;
export const TOTAL_FRAMES = vo.durationInFrames;
export const VO_FILE = "vo/buizenpost/voice-over.mp3";
export const VO_MEASURED = vo.source.startsWith("alignment");

/** Start frame of the n-th occurrence of a spoken word (punctuation ignored). */
export const wordAt = (word: string, nth = 1): number => {
  let seen = 0;
  for (const w of vo.words) {
    if (w.w.replace(/[.,?!]/g, "").toLowerCase() === word.toLowerCase()) {
      seen++;
      if (seen === nth) return w.start;
    }
  }
  throw new Error(`word not in voice-over: ${word}`);
};

export const buizenpostSchema = z.object({
  bill: z.object({
    sender: z.string(),
    amount: z.string(),
    due: z.string(),
    reference: z.string(),
  }),
  mailbox: z.object({
    label: z.string(),
    senders: z.array(z.string()).min(4).max(10),
    plugLabel: z.string(),
  }),
  headlines: z.object({
    hook: z.string(),
    hookAnswer: z.string(),
    pick: z.string(),
    tube: z.string(),
    read: z.string(),
  }),
  read: z.object({
    amountLabel: z.string(),
    dueLabel: z.string(),
    linkLabel: z.string(),
    referenceLabel: z.string(),
  }),
  cta: z.object({
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
  withVoice: z.boolean(),
  voiceVolume: z.number().min(0).max(1),
  showSafeZones: z.boolean(),
});

export type BuizenpostProps = z.infer<typeof buizenpostSchema>;

export const defaultBuizenpostProps: BuizenpostProps = {
  bill: {
    sender: "Zorgverzekeraar",
    amount: "€128,95",
    due: "Vervalt vr 18 dec",
    reference: "Kenmerk 4471-2093",
  },
  mailbox: {
    label: "Jouw mailbox",
    senders: ["Webshop", "Sportschool", "Nieuwsbrief", "Bank", "Gemeente", "Pakketdienst", "Verhuurder"],
    plugLabel: "Volledige toegang",
  },
  headlines: {
    hook: "Toegang tot je\nhele mailbox?",
    hookAnswer: "Hoeft niet.",
    pick: "Jij stopt er\néén rekening in.",
    tube: "Die gaat door\nde buis. Meer niet.",
    read: "Buddy leest alleen\nwat er aankomt.",
  },
  read: {
    amountLabel: "Bedrag",
    dueLabel: "Vervaldatum",
    linkLabel: "Betaallink",
    referenceLabel: "Kenmerk",
  },
  cta: {
    tagline: "Alleen wat jij\nerin stopt.",
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
  withVoice: true,
  voiceVolume: 1,
  showSafeZones: false,
};
