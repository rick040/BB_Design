import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { StatusIcon } from "../../components/StatusIcon";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Dart, dartFlight } from "../components/Dart";
import { Dartboard, zonePoint } from "../components/Dartboard";
import type { DartsProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  throwMiss: 8, // your second guess flies in...
  missHit: 20, // ...and lands next to the board, in the wall
  alert: 38, // "Aanmaning" card slams onto the board
  subline: 52, // "Hij moest op 21 november."
  duePulse: 60, // the date on the board pulses red
};

const R = 350;
const BOARD = { x: 540, y: 390 };
const NEAR = (() => {
  const z = zonePoint(R, 0, 168);
  return { x: BOARD.x + z.x, y: BOARD.y + z.y };
})();
const MISS = { x: 968, y: 690 };

export const HookScene: React.FC<{ props: DartsProps["hook"]; bill: DartsProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const settle = pop(frame, fps, -10, springs.pop);
  const miss = dartFlight(frame, HOOK_T.throwMiss, HOOK_T.missHit, { x: -260, y: 1100 }, MISS, 150, 160);
  const missTag = pop(frame, fps, HOOK_T.missHit + 2, springs.pop);
  const s1 = shake(frame, HOOK_T.missHit, 10, 6);
  const s2 = shake(frame, HOOK_T.alert, 16, 14);
  const sx = s1.x + s2.x;
  const sy = s1.y + s2.y;

  const alertIn = pop(frame, fps, HOOK_T.alert, { damping: 12, stiffness: 220, mass: 0.8 });
  const duePulse = frame >= HOOK_T.duePulse ? 1 + Math.max(0, Math.sin((frame - HOOK_T.duePulse) / 4)) * 0.12 : 1;
  const dueRed = interpolate(frame, [HOOK_T.alert, HOOK_T.alert + 8], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-20} stagger={3} />

      <Stage offsetY={30}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${sx}px, ${sy}px) rotate(${s2.r}deg)` }}>
          <Dartboard
            R={R}
            style={{ left: BOARD.x - R, top: BOARD.y - R, transform: `scale(${0.96 + 0.04 * settle})` }}
          />
          {/* the due date, sitting on the bullseye */}
          <div
            style={{
              position: "absolute",
              left: BOARD.x,
              top: BOARD.y - 130,
              transform: `translate(-50%, 0) scale(${duePulse})`,
              padding: "8px 22px 10px",
              borderRadius: 999,
              background: dueRed > 0.5 ? p.red : p.blue,
              color: p.white,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              boxShadow: "0 10px 26px rgba(1, 40, 160, 0.25)",
            }}
          >
            {bill.dueShort}
          </div>

          {/* first guess: already stuck in the outer ring on frame 0 */}
          <Dart x={NEAR.x} y={NEAR.y} angle={122} tag={props.guessNear} zIndex={3} />
          {/* second guess: misses the board completely */}
          <Dart
            x={miss.x}
            y={miss.y}
            angle={miss.angle}
            scale={miss.scale}
            opacity={miss.opacity}
            thud={miss.thud}
            tag={miss.landed ? props.guessMiss : undefined}
            tagIn={missTag}
            zIndex={4}
          />

          {/* the result */}
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 500,
              width: 780,
              height: 150,
              borderRadius: 40,
              background: p.white,
              boxShadow: "0 30px 80px rgba(1, 40, 160, 0.22)",
              border: `5px solid ${p.red}`,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 36px",
              boxSizing: "border-box",
              fontFamily: fonts.ui,
              zIndex: 6,
              opacity: frame >= HOOK_T.alert ? Math.min(1, alertIn * 2) : 0,
              transform: `scale(${interpolate(alertIn, [0, 1], [1.6, 1])}) rotate(${interpolate(alertIn, [0, 1], [-8, -3])}deg)`,
            }}
          >
            <StatusIcon kind="alert" size={84} />
            <div>
              <div style={{ fontSize: 48, fontWeight: 700, color: p.red, lineHeight: 1.05 }}>{props.alertTitle}</div>
              <div style={{ fontSize: 32, color: p.greyText, marginTop: 4 }}>{props.alertText}</div>
            </div>
          </div>
        </div>
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={HOOK_T.subline} />
    </SceneBg>
  );
};
