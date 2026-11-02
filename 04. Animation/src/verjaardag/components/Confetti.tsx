import React from "react";
import { random } from "remotion";
import { usePalette } from "../../lib/palette";

/** A one-shot confetti burst from (x, y). Deterministic per `seed`. */
export const Confetti: React.FC<{
  frame: number;
  start: number;
  x: number;
  y: number;
  count?: number;
  spread?: number;
  /** Main direction in degrees (-90 = up). */
  direction?: number;
  power?: number;
  life?: number;
  seed?: string;
}> = ({ frame, start, x, y, count = 26, spread = 120, direction = -90, power = 26, life = 34, seed = "c" }) => {
  const p = usePalette();
  const t = frame - start;
  if (t < 0 || t > life) return null;
  const colors = [p.yellow, p.red, p.teal, p.blueSoft, p.blueMid];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = ((direction + (random(`${seed}a${i}`) - 0.5) * spread) * Math.PI) / 180;
        const v = power * (0.55 + random(`${seed}v${i}`) * 0.6);
        const px = x + Math.cos(a) * v * t * (1 - t / (life * 2.2));
        const py = y + Math.sin(a) * v * t * (1 - t / (life * 2.2)) + 0.5 * 1.1 * t * t;
        const rot = random(`${seed}r${i}`) * 360 + t * (random(`${seed}s${i}`) - 0.5) * 30;
        const w = 12 + random(`${seed}w${i}`) * 10;
        const opacity = t > life - 8 ? (life - t) / 8 : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - w / 2,
              top: py - w,
              width: w,
              height: w * 1.8,
              borderRadius: 3,
              background: colors[i % colors.length],
              transform: `rotate(${rot}deg) scaleY(${Math.cos((t + i) / 3) * 0.6 + 0.4})`,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};
