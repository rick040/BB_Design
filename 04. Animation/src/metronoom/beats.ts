import { SCENE_STARTS, VOICE_END, wordAt } from "./schema";

// All beats in absolute frames of the single shot (30 fps).
export const BEATS = {
  blueRise: SCENE_STARTS[1] - 8, // blue floods up from below with the metronome
  knock: wordAt("nee") + 8, // pendulum swats the AI cloud away on "Nee."
  buddyLand: wordAt("buddy") - 2, // Buddy drops onto the pendulum weight
  ticking: wordAt("maat") - 12, // pendulum starts
  fields: [wordAt("bedrag"), wordAt("vervaldatum"), wordAt("betaallink"), wordAt("kenmerk")],
  billSwap: SCENE_STARTS[3] - 4, // first bill slides out, second slides in
  fastFields: [wordAt("dezelfde"), wordAt("vier"), wordAt("tikken"), wordAt("tikken") + 12],
  billOut: wordAt("activeer") - 16, // second bill drops away for the button
  stop: wordAt("maat", 2) + 8, // pendulum stops dead centre
  button: wordAt("activeer"),
  logo: wordAt("activeer") + 8,
  subline: wordAt("activeer") + 14,
  pulses: [wordAt("activeer", 1), wordAt("buddy", 2), VOICE_END + 2],
};

/** Pendulum key poses: [frame, angle in units of the swing (−1..1)]. */
export const swingKeys = (): [number, number][] => {
  const k: [number, number][] = [
    [0, 0],
    [BEATS.blueRise + 6, -0.4],
    [BEATS.knock, 1.25],
    [BEATS.buddyLand - 4, 0],
    [BEATS.ticking, 0],
  ];
  const ticks = [
    wordAt("maat"),
    ...BEATS.fields,
    wordAt("elke"),
    wordAt("rekening", 2),
    ...BEATS.fastFields,
    wordAt("geen"),
    wordAt("ai", 2),
    wordAt("gewoon"),
  ];
  ticks.forEach((f, i) => k.push([f, i % 2 === 0 ? 1 : -1]));
  k.push([BEATS.stop, 0]);
  return k;
};
