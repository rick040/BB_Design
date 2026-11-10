import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { AntennaBuddy } from "../components/AntennaBuddy";
import { type RadioProps, VO_WORDS } from "../schema";

// Beats (scene-local = spoken word frame minus the scene start).
export const forwardBeats = (start: number) => ({
  tap: VO_WORDS.stuur - start + 4, // "stuur": tap on Doorsturen
  fly: VO_WORDS.stuur - start + 10, // the mail turns into a signal and flies
  catch: VO_WORDS.Buddy - start, // "Buddy": the antenna catches it
});

const BUDDY = 340;
const FEET = { x: 540, y: 930 };

export const ForwardScene: React.FC<{
  props: RadioProps["forward"];
  bill: RadioProps["bill"];
  start: number;
}> = ({ props, bill, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = forwardBeats(start);

  const cardIn = pop(frame, fps, 2, springs.smooth);
  const tap = interpolate(frame, [T.tap, T.tap + 3, T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [T.tap + 1, T.tap + 14], [0, 1], clamp);
  const fly = interpolate(frame, [T.fly, T.catch], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

  const buddyIn = pop(frame, fps, 4, springs.bouncy);
  const caught = frame >= T.catch;
  const squash = caught
    ? interpolate(frame, [T.catch, T.catch + 3, T.catch + 9, T.catch + 14], [1, 0.82, 1.08, 1], clamp)
    : interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  const glow = interpolate(frame, [T.catch, T.catch + 4, T.catch + 20], [0, 1, 0.7], clamp);
  const waves = caught ? (frame - T.catch) / 24 : 0;
  const lookY = interpolate(fly, [0, 1], [-1, -0.2]);

  // Card path: from the top into the antenna tip, shrinking to a dot.
  const cardX = interpolate(fly, [0, 1], [0, -70]);
  const cardY = interpolate(fly, [0, 1], [0, 200]);
  const cardS = interpolate(fly, [0, 1], [1, 0.08]);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={4} stagger={3} />
      <Stage offsetY={30}>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 70,
            width: 900,
            padding: "34px 38px",
            boxSizing: "border-box",
            borderRadius: 36,
            background: p.white,
            boxShadow: "0 30px 70px rgba(0, 10, 80, 0.35)",
            fontFamily: fonts.ui,
            opacity: Math.min(1, cardIn * 2) * (fly > 0.95 ? 0 : 1),
            transform: `translate(${cardX}px, ${cardY + (1 - cardIn) * 60}px) scale(${cardS})`,
            transformOrigin: "50% 50%",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 48, color: p.ink }}>{bill.sender}</div>
          <div style={{ fontSize: 38, color: p.greyText, marginTop: 6 }}>{bill.subject}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22, position: "relative" }}>
            <div style={{ transform: `scale(${0.9 * tap})`, transformOrigin: "100% 50%", position: "relative" }}>
              <CtaPill text={props.button} outline />
              <div
                style={{
                  position: "absolute",
                  left: -40,
                  top: -40,
                  width: 184,
                  height: 184,
                  borderRadius: "50%",
                  border: `6px solid ${p.blue}`,
                  opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
                  transform: `scale(${0.3 + ripple})`,
                }}
              />
            </div>
          </div>
        </div>

        <AntennaBuddy
          feetX={FEET.x}
          feetY={FEET.y}
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          blink={blinkScale(frame, [T.catch + 18])}
          look={{ x: -0.3, y: lookY }}
          glow={glow}
          waves={waves}
          waveColor={p.blueSoft}
          tipColor={caught ? p.yellow : p.blueSoft}
          stickColor={p.white}
          opacity={Math.min(1, buddyIn * 3)}
          scale={0.5 + 0.5 * buddyIn}
        />
      </Stage>
    </SceneBg>
  );
};
