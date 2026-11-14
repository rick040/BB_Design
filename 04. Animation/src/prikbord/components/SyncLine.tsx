import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { fonts, headlineTracking } from "../../theme";

/**
 * Headline whose words pop in on given frames (one per word, the last frame
 * repeats). Used to land on-screen words on the spoken words.
 */
export const SyncHeadline: React.FC<{
  text: string;
  at: number[];
  color: string;
  accent?: string;
  hideFrom?: number;
  sizeFactor?: number;
}> = ({ text, at, color, accent, hideFrom, sizeFactor = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  if (hideFrom !== undefined && frame >= hideFrom) return null;
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: L.safeTop,
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
                    color: li > 0 && accent ? accent : color,
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
