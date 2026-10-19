import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../../components/Buddy";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useWalkLayout } from "../layout";
import type { WalkthroughProps } from "../schema";
import { bb, wfonts } from "../tokens";

// Timeline (frames, scene-local).
// Frame 0 is complete on purpose (it is the thumbnail): title, subtitle and
// the step list are already there; Buddy and the step numbers add the motion.
export const INTRO_T = {
  hop: 10, // Buddy hops
  look: 28, // ... and looks at the step list
  item: 34, // the step numbers bump one by one: "5 steps"
  itemStagger: 8,
  blink: 96,
};

export const IntroScene: React.FC<{ props: WalkthroughProps["intro"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useWalkLayout();
  const T = INTRO_T;

  const buddySize = L.tall ? 150 : 170;
  const hopT = interpolate(frame, [T.hop, T.hop + 16], [0, 1], clamp);
  const hop = -70 * 4 * hopT * (1 - hopT);
  const squash = interpolate(
    frame,
    [T.hop - 5, T.hop, T.hop + 3, T.hop + 16, T.hop + 20, T.hop + 26],
    [1, 0.82, 1.12, 1, 0.9, 1],
    clamp,
  );
  const look = interpolate(frame, [T.look, T.look + 8], [0, 1], clamp);

  const col = L.tall ? { left: 72, top: 120, width: L.width - 144 } : { left: 150, top: 190, width: 760 };
  const cardBox = L.tall ? { left: 72, top: 880, width: L.width - 144 } : { left: 1010, top: 140, width: 760 };

  return (
    <AbsoluteFill style={{ background: bb.blue, fontFamily: wfonts.body }}>
      <div style={{ position: "absolute", ...col }}>
        <Buddy
          size={buddySize}
          blink={blinkScale(frame, [T.blink])}
          squash={squash}
          look={L.tall ? { x: 0, y: look } : { x: look, y: 0.2 * look }}
          style={{ transform: `translateY(${hop}px)` }}
        />
        <div
          style={{
            marginTop: L.tall ? 48 : 52,
            fontFamily: wfonts.heading,
            fontWeight: 600,
            fontSize: L.tall ? 116 : 112,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: "#fff",
            whiteSpace: "pre-line",
          }}
        >
          {props.title}
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: L.tall ? 42 : 40,
            lineHeight: 1.3,
            color: bb.onBlue,
            whiteSpace: "pre-line",
          }}
        >
          {props.subtitle}
        </div>
      </div>

      {/* the step list, as on the desktop page */}
      <div
        style={{
          position: "absolute",
          ...cardBox,
          padding: 14,
          borderRadius: 34,
          background: "#fff",
          boxShadow: "0 30px 80px rgba(0,20,120,.35)",
          display: "grid",
          gap: 6,
        }}
      >
        {props.steps.map((s, i) => {
          const at = T.item + i * T.itemStagger;
          const bump = pop(frame, fps, at, springs.pop) - pop(frame, fps, at + 6, springs.smooth);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: L.tall ? "30px 26px" : "22px 24px",
                borderRadius: 22,
                background: i === 0 ? bb.tint2 : "#fff",
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  border: `3px solid ${i === 0 ? bb.blue : bb.field}`,
                  background: i === 0 ? bb.blue : "#fff",
                  color: i === 0 ? "#fff" : bb.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 27,
                  transform: `scale(${1 + 0.18 * bump})`,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: L.tall ? 38 : 33, fontWeight: 650, color: bb.ink, lineHeight: 1.2 }}>{s.label}</div>
                <div style={{ fontSize: L.tall ? 27 : 24, color: bb.muted, marginTop: 3 }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
