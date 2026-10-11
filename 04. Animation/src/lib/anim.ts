import { Easing, interpolate, spring, type SpringConfig } from "remotion";

export const springs = {
  // Snappy UI pop with a little overshoot.
  pop: { damping: 13, stiffness: 180, mass: 0.7 } as Partial<SpringConfig>,
  // Soft, no overshoot.
  smooth: { damping: 200 } as Partial<SpringConfig>,
  // Bouncy, for Buddy.
  bouncy: { damping: 9, stiffness: 160, mass: 0.8 } as Partial<SpringConfig>,
};

export const pop = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<SpringConfig> = springs.pop,
  durationInFrames?: number,
) => spring({ frame: frame - delay, fps, config, durationInFrames });

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const fadeIn = (frame: number, start: number, length = 10) =>
  interpolate(frame, [start, start + length], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

/**
 * Lock-screen style stacking: each new item enters at slot 0 and pushes the
 * older ones down one slot. Returns how many slots item `i` has been pushed.
 */
export const pushedSlots = (
  frame: number,
  fps: number,
  arrivals: number[],
  i: number,
) => {
  let slots = 0;
  for (let j = i + 1; j < arrivals.length; j++) {
    slots += spring({
      frame: frame - arrivals[j],
      fps,
      config: { damping: 18, stiffness: 170 },
    });
  }
  return slots;
};

/** Decaying shake, returns pixel offsets. */
export const shake = (frame: number, start: number, length = 14, amp = 18) => {
  const t = frame - start;
  if (t < 0 || t > length) return { x: 0, y: 0, r: 0 };
  const decay = 1 - t / length;
  return {
    x: Math.sin(t * 2.7) * amp * decay,
    y: Math.cos(t * 3.4) * amp * 0.6 * decay,
    r: Math.sin(t * 2.1) * 1.2 * decay,
  };
};

/** Frames at which a blink (6 frames) is happening → eye scaleY. */
export const blinkScale = (frame: number, blinkAt: number[]) => {
  for (const b of blinkAt) {
    const t = frame - b;
    if (t >= 0 && t <= 6) {
      return interpolate(t, [0, 2, 3, 6], [1, 0.08, 0.08, 1], clamp);
    }
  }
  return 1;
};
