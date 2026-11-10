import React from "react";
import { Buddy, BUDDY_RATIO, type BuddyProps } from "../../components/Buddy";

// Buddy with a little radio antenna on his head. The antenna sits on the
// left lobe of his head and follows squash & stretch. `glow` 0..1 lights
// the tip, `waves` 0..1 sends out signal arcs (3 rings, staggered).
export const ANTENNA_H = 0.42; // × size

export const AntennaBuddy: React.FC<
  Omit<BuddyProps, "style"> & {
    feetX: number;
    feetY: number;
    glow?: number;
    waves?: number;
    waveColor: string;
    tipColor: string;
    stickColor: string;
    rotate?: number;
    opacity?: number;
    scale?: number;
  }
> = ({ feetX, feetY, glow = 0, waves = 0, waveColor, tipColor, stickColor, rotate = 0, opacity = 1, scale = 1, ...buddy }) => {
  const size = buddy.size;
  const sq = buddy.squash ?? 1;
  const h = size * BUDDY_RATIO * sq;
  const w = size / Math.sqrt(sq);
  // Base of the antenna: top of the left lobe (~37% across in the mascot).
  const baseX = (0.37 - 0.5) * w;
  const baseY = -h + size * 0.02;
  const stick = size * ANTENNA_H;
  const tipX = baseX - stick * 0.18;
  const tipY = baseY - stick;
  const tipR = size * 0.075 * (1 + glow * 0.25);

  return (
    <div
      style={{
        position: "absolute",
        left: feetX,
        top: feetY,
        width: 0,
        height: 0,
        opacity,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "0 0",
      }}
    >
      <svg
        width={size * 3}
        height={size * 3}
        viewBox={`${-size * 1.5} ${-size * 2.4} ${size * 3} ${size * 3}`}
        style={{ position: "absolute", left: -size * 1.5, top: -size * 2.4, overflow: "visible" }}
      >
        {[0, 1, 2].map((i) => {
          const t = waves * 1.6 - i * 0.3;
          const k = ((t % 1) + 1) % 1;
          if (waves <= 0 || t < 0) return null;
          return (
            <circle
              key={i}
              cx={tipX}
              cy={tipY}
              r={tipR + k * size * 0.75}
              fill="none"
              stroke={waveColor}
              strokeWidth={size * 0.035}
              opacity={(1 - k) * 0.9}
            />
          );
        })}
        <line
          x1={baseX}
          y1={baseY}
          x2={tipX}
          y2={tipY}
          stroke={stickColor}
          strokeWidth={size * 0.045}
          strokeLinecap="round"
        />
        <circle cx={tipX} cy={tipY} r={tipR * (1 + glow * 0.9)} fill={tipColor} opacity={glow * 0.35} />
        <circle cx={tipX} cy={tipY} r={tipR} fill={tipColor} />
      </svg>
      <Buddy
        {...buddy}
        style={{ position: "absolute", left: -size / 2, top: -size * BUDDY_RATIO }}
      />
    </div>
  );
};
