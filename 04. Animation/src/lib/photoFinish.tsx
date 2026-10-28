import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// "Photo finish": a finish-camera scan line sweeps from left to right. Behind
// the line the new scene is already there, with a band of horizontal streaks
// (like a slit-scan photo) and a time stamp riding on the line. Plain CSS.
type PhotoFinishProps = {
  lineColor: string;
  streakColor: string;
  stampBg: string;
  stampColor: string;
  /** Text in the time stamp, e.g. "00:03,00". */
  stamp: string;
};

const PhotoFinishPresentation: React.FC<TransitionPresentationComponentProps<PhotoFinishProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  const band = 180;
  const lx = p * (width + band);
  const visible = Math.max(0, width - lx);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${visible}px 0 0)` }}>{children}</AbsoluteFill>
      {p > 0 && p < 1 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: lx - band,
              top: 0,
              width: band,
              height,
              backgroundImage: `repeating-linear-gradient(180deg, ${passedProps.streakColor} 0 6px, transparent 6px 22px)`,
              opacity: 0.55,
              maskImage: "linear-gradient(90deg, transparent, black)",
              WebkitMaskImage: "linear-gradient(90deg, transparent, black)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: lx - 7,
              top: 0,
              width: 14,
              height,
              background: passedProps.lineColor,
              boxShadow: `0 0 30px ${passedProps.lineColor}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: lx + 16,
              top: height * 0.5 - 30,
              padding: "10px 18px",
              borderRadius: 12,
              background: passedProps.stampBg,
              color: passedProps.stampColor,
              fontFamily: "'Geist', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 36,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            {passedProps.stamp}
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

export const photoFinish = (props: PhotoFinishProps): TransitionPresentation<PhotoFinishProps> => ({
  component: PhotoFinishPresentation,
  props,
});
