import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { fonts, headlineTracking } from "../../theme";

/**
 * Headline whose words land on given frames (the spoken words). Missing
 * frames reuse the last one. Line 0 uses `first`, later lines `rest`.
 */
export const SpokenLine: React.FC<{
  text: string;
  at: number[];
  first: string;
  rest: string;
  sizeFactor?: number;
  top?: number;
}> = ({ text, at, first, rest, sizeFactor = 1, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: top ?? L.safeTop,
        left: L.sidePadding,
        right: L.sidePadding,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: L.headlineSize * sizeFactor,
        lineHeight: 1.0,
        letterSpacing: headlineTracking,
      }}
    >
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, i) => {
            const f = at[wi] ?? at[at.length - 1];
            wi++;
            const s = pop(frame, fps, f - 3, springs.pop);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    color: li === 0 ? first : rest,
                    opacity: Math.min(1, s * 1.4),
                    transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                    filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                  }}
                >
                  {w}
                </span>{" "}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Small uppercase label chip ("MYTHE", "FEIT"). */
export const LabelChip: React.FC<{ text: string; bg: string; fg: string; scale?: number; style?: React.CSSProperties }> = ({
  text,
  bg,
  fg,
  scale = 1,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      background: bg,
      color: fg,
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: 40,
      letterSpacing: "0.12em",
      padding: "12px 30px 14px",
      borderRadius: 40,
      transform: `scale(${scale})`,
      ...style,
    }}
  >
    {text}
  </div>
);
