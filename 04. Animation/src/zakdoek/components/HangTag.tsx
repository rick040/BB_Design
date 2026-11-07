import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

// A luggage-style label: what the knot is for. Lines appear one by one
// (`lines` 0..3). The hole sits at (TAG_HOLE.x, TAG_HOLE.y), where a thread ties on.
export const TAG_W = 420;
export const TAG_H = 250;
export const TAG_HOLE = { x: 64, y: TAG_H / 2 };

export const HangTag: React.FC<{
  sender: string;
  amount: string;
  due: string;
  dueLabel?: string;
  lines: number;
  style?: React.CSSProperties;
}> = ({ sender, amount, due, dueLabel = "vervalt", lines, style }) => {
  const p = usePalette();
  const line = (i: number): React.CSSProperties => {
    const t = interpolate(lines - i, [0, 1], [0, 1], clamp);
    return { opacity: t, transform: `translateX(${(1 - t) * 24}px)` };
  };
  return (
    <div style={{ position: "absolute", width: TAG_W, height: TAG_H, ...style }}>
      <svg width={TAG_W} height={TAG_H} viewBox={`0 0 ${TAG_W} ${TAG_H}`} style={{ position: "absolute", overflow: "visible" }}>
        <path
          d={`M0,${TAG_H / 2} L70,8 Q76,0 88,0 L${TAG_W - 30},0 Q${TAG_W},0 ${TAG_W},30 L${TAG_W},${TAG_H - 30} Q${TAG_W},${TAG_H} ${TAG_W - 30},${TAG_H} L88,${TAG_H} Q76,${TAG_H} 70,${TAG_H - 8} Z`}
          fill={p.white}
          style={{ filter: "drop-shadow(0 24px 40px rgba(1,40,160,0.22))" }}
        />
        <circle cx={TAG_HOLE.x} cy={TAG_HOLE.y} r={16} fill="none" stroke={p.blueSoft} strokeWidth={6} />
        <circle cx={TAG_HOLE.x} cy={TAG_HOLE.y} r={10} fill={p.blue} opacity={0.12} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 112,
          right: 26,
          top: 30,
          fontFamily: fonts.ui,
          color: p.ink,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 600, ...line(0) }}>{sender}</div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 82,
            lineHeight: 1.05,
            letterSpacing: headlineTracking,
            color: p.blue,
            marginTop: 4,
            ...line(1),
          }}
        >
          {amount}
        </div>
        <div style={{ fontSize: 30, fontWeight: 500, color: "#6b6b78", marginTop: 8, ...line(2) }}>
          {dueLabel} <span style={{ color: p.ink, fontWeight: 600 }}>{due}</span>
        </div>
      </div>
    </div>
  );
};
