// Generated from public/vo/sneeuwbol/timing.json (ElevenLabs alignment, one take).
// The animation follows the voice: scene starts and beats hang on spoken words.
export const VO_FILE = "vo/sneeuwbol/voice-over.mp3";
export const VO_AUDIO_SEC = 9.953;
export const VO_END_FRAME = 290;

/** Scene starts in seconds ([S1]..[S4] markers in CONCEPT-62.md). */
export const VO_SCENES_SEC = [0.0, 4.32, 5.8, 8.24];

/** Every spoken word with its start frame (30 fps). */
export const VO_WORDS = [
  { w: "Dwarrelt", f: 0 },
  { w: "die", f: 14 },
  { w: "ene", f: 20 },
  { w: "rekening", f: 26 },
  { w: "ook", f: 41 },
  { w: "altijd", f: 50 },
  { w: "weg", f: 62 },
  { w: "tot", f: 79 },
  { w: "er", f: 83 },
  { w: "een", f: 86 },
  { w: "aanmaning", f: 92 },
  { w: "ligt", f: 106 },
  { w: "Stuur", f: 130 },
  { w: "hem", f: 139 },
  { w: "door", f: 144 },
  { w: "naar", f: 148 },
  { w: "Buddy", f: 154 },
  { w: "want", f: 174 },
  { w: "die", f: 180 },
  { w: "vangt", f: 185 },
  { w: "hem", f: 196 },
  { w: "en", f: 202 },
  { w: "zet", f: 206 },
  { w: "hem", f: 212 },
  { w: "in", f: 216 },
  { w: "je", f: 220 },
  { w: "agenda", f: 223 },
  { w: "dus", f: 247 },
  { w: "de", f: 259 },
  { w: "rest", f: 264 },
  { w: "mag", f: 274 },
  { w: "dwarrelen", f: 277 },
];

/** Start frame (global) of the n-th occurrence of a spoken word. */
export const wordAt = (w: string, n = 0): number => {
  const hits = VO_WORDS.filter((x) => x.w.toLowerCase() === w.toLowerCase());
  if (!hits[n]) throw new Error(`word not in voice-over: ${w}`);
  return hits[n].f;
};
