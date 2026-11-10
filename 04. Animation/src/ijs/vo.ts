import timing from "../../public/vo/ijs/timing.json";

// Concept 61 · "Van dun ijs naar vaste grond."
// The animation follows the voice: every scene start and beat below comes
// from public/vo/ijs/timing.json (ElevenLabs alignment, one take).
// Regenerate the voice? Rewrite timing.json and everything moves with it.

export const VO = timing;
export const VO_FPS = timing.fps;

/** Global frame at which the n-th occurrence (0-based) of a spoken word starts. */
export const wordAt = (w: string, n = 0): number => {
  const hits = timing.words.filter((x) => x.w.toLowerCase() === w.toLowerCase());
  if (!hits[n]) throw new Error(`Word "${w}" (#${n}) not in timing.json`);
  return hits[n].frame;
};

/** Scene cues [S1..S4] in global frames. */
export const CUES = timing.scenes.map((s) => s.frame);
export const VOICE_END = timing.voice_end_frame;
