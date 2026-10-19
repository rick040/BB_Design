import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, springs } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { decFonts } from "./theme";

/** Archivo Black-kop; woorden ploppen één voor één in. `\n` = harde regelafbreking. */
export const DHeadline: React.FC<{
  text: string;
  color: string;
  delay?: number;
  stagger?: number;
  sizeFactor?: number;
  top?: number;
}> = ({ text, color, delay = 0, stagger = 3, sizeFactor = 1, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wordIndex = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: top ?? L.safeTop,
        left: L.sidePadding,
        right: L.sidePadding,
        textAlign: "center",
        fontFamily: decFonts.display,
        fontWeight: 400,
        // Archivo Black is breder dan Space Grotesk: 0.8 houdt twee regels in beeld.
        fontSize: L.headlineSize * 0.8 * sizeFactor,
        lineHeight: 1.04,
        letterSpacing: "-0.02em",
        color,
        textWrap: "balance",
      }}
    >
      {lines.map((words, li) => (
        <React.Fragment key={li}>
          {li > 0 ? <br /> : null}
          {words.map((w, wi) => {
            const s = pop(frame, fps, delay + wordIndex++ * stagger, springs.pop);
            return (
              <React.Fragment key={wi}>
                <span
                  style={{
                    display: "inline-block",
                    transform: `translateY(${(1 - s) * 0.5}em) scale(${0.9 + 0.1 * s})`,
                    opacity: Math.min(1, s * 1.4),
                    filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                  }}
                >
                  {w}
                </span>{" "}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

/** Poppins-subregel, boven de safe zone onderaan. */
export const DSubline: React.FC<{
  text: string;
  color: string;
  delay?: number;
  bottom?: number;
}> = ({ text, color, delay = 0, bottom }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const t = interpolate(frame, [delay, delay + 14], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - t, 3);
  return (
    <div
      style={{
        position: "absolute",
        bottom: bottom ?? L.safeBottom,
        left: L.sidePadding + 20,
        right: L.sidePadding + 20,
        textAlign: "center",
        fontFamily: decFonts.text,
        fontWeight: 500,
        fontSize: L.sublineSize * 0.92,
        lineHeight: 1.28,
        color,
        textWrap: "balance",
        whiteSpace: "pre-line",
        opacity: eased,
        transform: `translateY(${(1 - eased) * 30}px)`,
      }}
    >
      {text}
    </div>
  );
};
