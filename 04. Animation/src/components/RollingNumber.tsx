import React from "react";
import { fonts } from "../theme";

/**
 * A giant numeral that rolls like a slot machine through `values`.
 * progress 0 shows values[0], progress 1 shows the last value.
 */
export const RollingNumber: React.FC<{
  values: string[];
  progress: number;
  size: number;
  color: string;
  /** Vertical motion blur in px while rolling. */
  blur?: number;
  style?: React.CSSProperties;
}> = ({ values, progress, size, color, blur = 0, style }) => {
  const steps = Math.max(1, values.length - 1);
  const cell = size;
  return (
    <div
      style={{
        height: cell,
        overflow: "hidden",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: size,
        lineHeight: `${cell}px`,
        letterSpacing: "-0.06em",
        color,
        textAlign: "center",
        ...style,
      }}
    >
      <div
        style={{
          transform: `translateY(${-progress * steps * cell}px)`,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        {values.map((v, i) => (
          <div key={i} style={{ height: cell }}>
            {v}
          </div>
        ))}
      </div>
    </div>
  );
};

/** "7" → "2" becomes ["7","6","5","4","3","2"]; non-numbers just swap. */
export const rollSequence = (from: string, to: string) => {
  const a = Number(from);
  const b = Number(to);
  if (Number.isInteger(a) && Number.isInteger(b) && a !== b && Math.abs(a - b) <= 20) {
    const dir = a > b ? -1 : 1;
    const out: string[] = [];
    for (let n = a; n !== b + dir; n += dir) out.push(String(n));
    return out;
  }
  return [from, to];
};
