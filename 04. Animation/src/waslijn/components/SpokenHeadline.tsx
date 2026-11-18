import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { fonts, headlineTracking } from "../../theme";

/**
 * Kop waarvan elk woord op een eigen frame inploft (meestal het gesproken
 * woord). Optioneel per regel een andere kleur en een uitfade.
 */
export const SpokenHeadline: React.FC<{
  text: string;
  at: number[];
  colors: string[];
  sizeFactor?: number;
  out?: number;
  top?: number;
}> = ({ text, at, colors, sizeFactor = 1, out, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;
  const o = out === undefined ? 1 : Math.max(0, Math.min(1, 1 - (frame - out) / 6));

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
        opacity: o,
        transform: `translateY(${(1 - o) * -30}px)`,
      }}
    >
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, i) => {
            const t = at[wi] ?? at[at.length - 1];
            wi++;
            const s = pop(frame, fps, t - 3, springs.pop);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    color: colors[li] ?? colors[colors.length - 1],
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
