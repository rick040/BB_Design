import { Easing, interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { squareCenter } from "./Board";

/**
 * Position of a piece hopping square by square along the board path.
 * `from`..`to` are square indices, one hop every `every` frames from `start`.
 * Returns the feet position (board coordinates), squash and the square it is on.
 */
export const hopAlong = (
  frame: number,
  start: number,
  from: number,
  to: number,
  every: number,
  arc: number,
) => {
  const n = to - from;
  const t = (frame - start) / every;
  if (t <= 0 || n <= 0) {
    const c = squareCenter(from);
    return { x: c.x, y: c.y, squash: 1, at: from, landing: -1 };
  }
  if (t >= n) {
    const c = squareCenter(to);
    const since = frame - (start + n * every);
    const squash = interpolate(since, [0, 2, 6, 10], [0.8, 0.8, 1.06, 1], clamp);
    return { x: c.x, y: c.y, squash, at: to, landing: since };
  }
  const i = Math.floor(t);
  const k = Easing.inOut(Easing.quad)(t - i);
  const a = squareCenter(from + i);
  const b = squareCenter(from + i + 1);
  const x = a.x + (b.x - a.x) * k;
  const y = a.y + (b.y - a.y) * k - arc * 4 * k * (1 - k);
  const squash = interpolate(k, [0, 0.15, 0.5, 0.9, 1], [0.85, 1.12, 1.05, 1, 0.9], clamp);
  return { x, y, squash, at: from + i, landing: -1 };
};
