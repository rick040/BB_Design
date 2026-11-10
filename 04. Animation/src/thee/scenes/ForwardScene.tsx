import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { TheeProps } from "../schema";

// Timeline (frames, scene-local). The scene is short on purpose: it rides
// on "Dus stuur hem door," in the voice-over.
export const FWD_T = {
  headline: 2, // "Stuur hem door."
  tap: 12, // tap on Doorsturen ("stuur")
  fly: 18, // card shrinks and flies to Buddy
  flyLen: 14,
  catch: 32, // Buddy catches it (squash)
};

const BUDDY = 220;
const FEET = 800;

export const ForwardScene: React.FC<{ props: TheeProps["forward"]; bill: TheeProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const tap = interpolate(frame, [FWD_T.tap, FWD_T.tap + 3, FWD_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [FWD_T.tap, FWD_T.tap + 14], [0, 1], clamp);
  const fly = interpolate(frame, [FWD_T.fly, FWD_T.fly + FWD_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const chip = pop(frame, fps, FWD_T.tap + 2, springs.bouncy);
  const caught = frame >= FWD_T.catch;
  const squash = interpolate(frame, [FWD_T.catch, FWD_T.catch + 4, FWD_T.catch + 10], [1, 0.82, 1], clamp);
  const buddyIn = pop(frame, fps, 0, springs.bouncy);

  // Card path: from centre to Buddy's head.
  const cx = interpolate(fly, [0, 1], [0, 280]);
  const cy = interpolate(fly, [0, 1], [0, 330]);
  const cs = interpolate(fly, [0, 1], [1, 0.12]);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={FWD_T.headline} stagger={3} />
      <Stage offsetY={40}>
        <div style={{ position: "absolute", inset: 0, transform: "scale(1.12)", transformOrigin: "50% 40%" }}>
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 120,
            width: 860,
            padding: "36px 40px",
            borderRadius: 34,
            background: p.white,
            fontFamily: fonts.ui,
            color: "#1b1b2e",
            boxShadow: "0 30px 70px rgba(0,20,90,0.35)",
            transform: `translate(${cx}px, ${cy}px) scale(${cs}) rotate(${fly * 18}deg)`,
            transformOrigin: "50% 50%",
            opacity: caught ? 0 : 1,
          }}
        >
          <div style={{ fontSize: 30, color: p.greyText, fontWeight: 500 }}>Van</div>
          <div style={{ fontSize: 44, fontWeight: 600 }}>{bill.sender}</div>
          <div style={{ fontSize: 34, marginTop: 10, color: "#4a4a5e" }}>{props.subject}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 30 }}>
            <div
              style={{
                position: "relative",
                padding: "18px 34px",
                borderRadius: 999,
                background: p.blue,
                color: p.white,
                fontSize: 36,
                fontWeight: 600,
                transform: `scale(${tap})`,
              }}
            >
              {props.button} →
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 120,
                  height: 120,
                  marginLeft: -60,
                  marginTop: -60,
                  borderRadius: "50%",
                  border: `5px solid ${p.blueSoft}`,
                  opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0,
                  transform: `scale(${0.4 + ripple * 1.6})`,
                }}
              />
            </div>
            <div
              style={{
                padding: "14px 24px",
                borderRadius: 999,
                background: p.blueSoft,
                color: p.blue,
                fontSize: 30,
                fontWeight: 600,
                opacity: Math.min(1, chip * 2),
                transform: `scale(${0.6 + 0.4 * chip})`,
              }}
            >
              {props.toChip}
            </div>
          </div>
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash * (0.7 + 0.3 * buddyIn)}
          blink={blinkScale(frame, [4])}
          look={{ x: caught ? 0 : -0.6, y: caught ? 0.2 : -0.6 }}
          style={{ position: "absolute", left: 820 - BUDDY / 2, top: FEET - BUDDY * BUDDY_RATIO }}
        />
        </div>
      </Stage>
    </SceneBg>
  );
};
