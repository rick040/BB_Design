import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Noise, Wave } from "../components/Noise";
import { Radio, screenSize } from "../components/Radio";
import type { RuisProps } from "../schema";

// Timeline (frames, scene-local). The scene starts 6 frames before the
// spoken "Stuur" ([S2]); "Buddy" is spoken at local 38-49.
export const TUNE_T = {
  hop: 6, // Buddy hops onto the tuning knob
  hopLen: 12,
  turn: 18, // his weight turns the knob, the needle sweeps
  turnLen: 20,
  locked: 36, // on the Buddy station: static gone, the bill is sharp
};

const RADIO_H = 600;
const RADIO_X = (1080 - 960) / 2;
const SCREEN = screenSize(RADIO_H);
const KNOB = { x: 540, y: 850, r: 112 };
const BUDDY = 175;
const STATION = 0.72;

export const TuneScene: React.FC<{
  props: RuisProps["tune"];
  bill: RuisProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const turn = interpolate(frame, [TUNE_T.turn, TUNE_T.turn + TUNE_T.turnLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const needle = interpolate(turn, [0, 1], [0.22, STATION]) + (turn < 1 ? Math.sin(frame / 2) * 0.01 : 0);
  const locked = pop(frame, fps, TUNE_T.locked, springs.pop);
  const noise = 0.9 * (1 - turn);

  // Hop: from the floor left of the knob onto its top, low arc.
  const hop = interpolate(frame, [TUNE_T.hop, TUNE_T.hop + TUNE_T.hopLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const floorFeet = 990;
  const knobFeet = KNOB.y - KNOB.r + 4;
  const bx = interpolate(hop, [0, 1], [250, KNOB.x]);
  const by = interpolate(hop, [0, 1], [floorFeet, knobFeet]) - Math.sin(hop * Math.PI) * 110;
  // Little running steps while the knob turns under him.
  const stepping = frame >= TUNE_T.turn && frame < TUNE_T.turn + TUNE_T.turnLen;
  let squash = 1;
  if (frame >= TUNE_T.hop + TUNE_T.hopLen && frame < TUNE_T.hop + TUNE_T.hopLen + 8) {
    squash = interpolate(frame - TUNE_T.hop - TUNE_T.hopLen, [0, 3, 8], [0.8, 1.06, 1], clamp);
  } else if (stepping) {
    squash = 1 + Math.sin((frame - TUNE_T.turn) * 1.4) * 0.05;
  } else if (frame < TUNE_T.hop + TUNE_T.hopLen && hop > 0) {
    squash = 1.06;
  }
  const lean = stepping ? -8 : 0;
  const blink = blinkScale(frame, [44]);
  const appear = pop(frame, fps, -6, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={-6} stagger={2} />

      <Stage offsetY={50}>
        <Radio
          height={RADIO_H}
          needle={needle}
          station={{ at: STATION, label: props.station, glow: locked }}
          body={p.white}
          scaleBg={p.grey}
          ink={p.ink}
          needleColor={p.blue}
          screenBg="#0a2a9e"
          style={{ left: RADIO_X, top: 0 }}
        >
          <Wave
            width={SCREEN.w}
            height={SCREEN.h}
            amplitude={40 + 30 * turn}
            phase={frame / 4}
            periods={3}
            color={p.blueSoft}
            stroke={8}
            jitter={70 * (1 - turn)}
            frame={frame}
            style={{ left: 0, top: 0, opacity: 0.55 }}
          />
          {/* The forwarded bill comes into focus as the static clears */}
          <div
            style={{
              position: "absolute",
              left: (SCREEN.w - 720) / 2,
              top: (SCREEN.h - 230) / 2,
              width: 720,
              height: 230,
              borderRadius: 40,
              background: p.white,
              padding: "30px 40px",
              boxSizing: "border-box",
              fontFamily: fonts.ui,
              color: p.ink,
              filter: turn < 0.98 ? `blur(${(1 - turn) * 18}px)` : undefined,
              opacity: 0.35 + 0.65 * turn,
              transform: `scale(${0.92 + 0.08 * turn})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  background: p.blueSoft,
                  color: p.blue,
                  fontWeight: 600,
                  fontSize: 26,
                  padding: "6px 18px",
                  borderRadius: 20,
                }}
              >
                {props.forwardedChip}
              </div>
              <div style={{ fontWeight: 600, fontSize: 32 }}>{bill.sender}</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 26 }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 84, letterSpacing: "-0.04em" }}>
                {bill.amount}
              </div>
              <div
                style={{
                  background: p.blue,
                  color: p.white,
                  fontWeight: 600,
                  fontSize: 30,
                  padding: "10px 22px",
                  borderRadius: 26,
                  transform: `scale(${0.6 + 0.4 * locked})`,
                  opacity: locked,
                }}
              >
                {bill.due}
              </div>
            </div>
          </div>
          <Noise
            width={SCREEN.w}
            height={SCREEN.h}
            amount={noise}
            frame={frame}
            colors={[p.white, p.blueSoft, "#5d7dff"]}
            seed="tune"
          />
        </Radio>

        {/* Tuning knob */}
        <div
          style={{
            position: "absolute",
            left: KNOB.x - KNOB.r,
            top: KNOB.y - KNOB.r,
            width: KNOB.r * 2,
            height: KNOB.r * 2,
            borderRadius: "50%",
            background: p.white,
            boxShadow: `0 0 0 14px ${p.blueSoft}55, 0 24px 50px rgba(0,0,40,0.3)`,
            transform: `rotate(${turn * 300 - 40}deg) scale(${0.6 + 0.4 * appear})`,
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: KNOB.r - 4,
                top: 10,
                width: 8,
                height: 22,
                borderRadius: 4,
                background: i === 0 ? p.blue : p.grey,
                transformOrigin: `4px ${KNOB.r - 10}px`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: frame < TUNE_T.locked ? 0.3 : 0, y: frame < TUNE_T.locked ? -0.6 : 0.2 }}
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: by - BUDDY * BUDDY_RATIO,
            transform: `rotate(${lean}deg) scale(${appear})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
    </SceneBg>
  );
};
