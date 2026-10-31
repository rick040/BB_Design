import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, springs } from "../lib/anim";
import { usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";

// Layout for the hero VSL. Two formats share every scene:
//  · wide  = 16:9 desktop hero (1920 × 1080): text column left, visual right
//  · tall  = 4:5 mobile hero (1080 × 1350): text on top, visual below
// Visuals are drawn on a fixed 1000 × 860 design box that is placed and
// scaled per format, so scenes use plain coordinates.
export const BOX_W = 1000;
export const BOX_H = 860;

export type HeroMode = "pitch" | "detail";

export const useHeroLayout = (mode: HeroMode = "detail") => {
  const { width, height } = useVideoConfig();
  const wide = width / height > 1.2;

  const boxScale = wide ? 1 : mode === "pitch" ? 1 : 0.92;
  const boxW = BOX_W * boxScale;
  // Wide: the box content (x 90–910) spans x 1000–1820 of the frame.
  const box = wide
    ? { left: 1000 - 90 * boxScale, top: mode === "pitch" ? 130 : 150, scale: boxScale }
    : { left: (width - boxW) / 2, top: mode === "pitch" ? 440 : 296, scale: boxScale };

  return {
    width,
    height,
    wide,
    box,
    pad: wide ? 110 : 64,
    // Left text column (wide only).
    textRight: wide ? 950 : width - 64,
  };
};

/** The 1000 × 860 design box for visuals, placed per format. */
export const VisualBox: React.FC<{ mode?: HeroMode; children: React.ReactNode }> = ({
  mode = "detail",
  children,
}) => {
  const L = useHeroLayout(mode);
  return (
    <div
      style={{
        position: "absolute",
        left: L.box.left,
        top: L.box.top,
        width: BOX_W,
        height: BOX_H,
        transform: `scale(${L.box.scale})`,
        transformOrigin: "0 0",
      }}
    >
      {children}
    </div>
  );
};

/** Words pop in one by one (same motion language as the Instagram ads). */
export const PopWords: React.FC<{
  text: string;
  delay: number;
  stagger?: number;
  colorForLine?: (lineIndex: number) => string;
  color?: string;
}> = ({ text, delay, stagger = 3, colorForLine, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;
  return (
    <>
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, i) => {
            const s = pop(frame, fps, delay + wi++ * stagger, springs.pop);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    color: colorForLine ? colorForLine(li) : color,
                    opacity: Math.min(1, s * 1.4),
                    transform: `translateY(${(1 - s) * 0.45}em) scale(${0.9 + 0.1 * s})`,
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
    </>
  );
};

/**
 * Title + body for the detail scenes. Wide: left column, vertically centred.
 * Tall: title on top, body under the visual.
 */
export const DetailText: React.FC<{
  title: string;
  body: string;
  titleDelay?: number;
  bodyDelay?: number;
}> = ({ title, body, titleDelay = 6, bodyDelay = 22 }) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const L = useHeroLayout("detail");
  const bodyIn = interpolate(frame, [bodyDelay, bodyDelay + 14], [0, 1], clamp);
  const eased = 1 - Math.pow(1 - bodyIn, 3);

  const titleStyle: React.CSSProperties = {
    fontFamily: fonts.display,
    fontWeight: 500,
    letterSpacing: headlineTracking,
    lineHeight: 1.04,
    color: p.white,
    textWrap: "balance",
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: fonts.display,
    fontWeight: 400,
    letterSpacing: "0.005em",
    lineHeight: 1.3,
    color: p.blueText,
    whiteSpace: "pre-line",
    textWrap: "balance",
    opacity: eased,
    transform: `translateY(${(1 - eased) * 24}px)`,
  };

  if (L.wide) {
    return (
      <div
        style={{
          position: "absolute",
          left: L.pad,
          width: L.textRight - L.pad,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: 70,
        }}
      >
        <div style={{ ...titleStyle, fontSize: 78 }}>
          <PopWords text={title} delay={titleDelay} stagger={2} />
        </div>
        <div style={{ ...bodyStyle, fontSize: 42, marginTop: 38 }}>{body}</div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          ...titleStyle,
          position: "absolute",
          top: 150,
          left: L.pad,
          right: L.pad,
          fontSize: 58,
          textAlign: "center",
        }}
      >
        <PopWords text={title} delay={titleDelay} stagger={2} />
      </div>
      <div
        style={{
          ...bodyStyle,
          position: "absolute",
          bottom: 58,
          left: L.pad,
          right: L.pad,
          fontSize: 39,
          textAlign: "center",
        }}
      >
        {body}
      </div>
    </>
  );
};
