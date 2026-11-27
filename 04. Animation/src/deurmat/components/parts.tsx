import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

export const ENV_W = 470;
export const ENV_H = 270;

/** A paper envelope with a window: sender and due date stay editable text. */
export const Envelope: React.FC<{
  sender: string;
  due: string;
  w?: number;
  compact?: boolean;
}> = ({ sender, due, w = ENV_W, compact = false }) => {
  const p = usePalette();
  const s = w / ENV_W;
  const h = ENV_H * s;
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        background: p.white,
        borderRadius: 18 * s,
        boxShadow: `0 ${14 * s}px ${36 * s}px rgba(1, 20, 90, 0.22)`,
        overflow: "hidden",
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${ENV_W} ${ENV_H}`} style={{ position: "absolute", inset: 0 }}>
        <path d={`M0 0 L${ENV_W / 2} 120 L${ENV_W} 0`} fill="none" stroke={p.grey} strokeWidth={5} />
      </svg>
      {compact ? null : (
        <div
          style={{
            position: "absolute",
            left: 36,
            right: 36,
            bottom: 30,
            background: p.light,
            border: `2px solid ${p.grey}`,
            borderRadius: 14,
            padding: "14px 20px",
            fontFamily: fonts.ui,
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{sender}</div>
          <div style={{ fontSize: 26, fontWeight: 500, color: p.red, marginTop: 4 }}>{due}</div>
        </div>
      )}
    </div>
  );
};

/** Headline whose words land on given frames (spoken words). Line 1 in c1, rest in c2. */
export const SpokenHeadline: React.FC<{
  text: string;
  at: number[];
  c1: string;
  c2: string;
  top: number;
  size: number;
  fadeOutAt?: number;
}> = ({ text, at, c1, c2, top, size, fadeOutAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  const out = fadeOutAt === undefined ? 1 : interpolate(frame, [fadeOutAt, fadeOutAt + 6], [1, 0], clamp);
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: headlineTracking,
        opacity: out,
        transform: `translateY(${(1 - out) * -30}px)`,
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
                    color: li === 0 ? c1 : c2,
                    opacity: Math.min(1, s * 1.4),
                    transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
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

/** Doormat with a woven edge and a word on it. */
export const Doormat: React.FC<{ text: string; w: number; h: number; color: string; textColor: string }> = ({
  text,
  w,
  h,
  color,
  textColor,
}) => (
  <div
    style={{
      width: w,
      height: h,
      background: color,
      borderRadius: 22,
      boxShadow: "0 18px 40px rgba(1, 20, 90, 0.25)",
      backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 6px, transparent 6px 14px)`,
      outline: `6px dashed ${textColor}55`,
      outlineOffset: -18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: h * 0.42,
      letterSpacing: "-0.04em",
      color: textColor,
    }}
  >
    {text}
  </div>
);
