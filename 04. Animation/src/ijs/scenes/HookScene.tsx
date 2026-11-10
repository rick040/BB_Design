import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BillSlip, SLIP_H, SLIP_W } from "../components/BillSlip";
import { type Crack, IceSheet } from "../components/Ice";
import type { IjsProps } from "../schema";
import { wordAt } from "../vo";

// Beats (scene-local frames; scene 1 starts at frame 0), hung on the voice.
export const HOOK_T = {
  hairline: wordAt("dun"), // "...op DUN ijs": first hairline cracks
  hairLen: 22,
  crack: wordAt("kraakt"), // "tot het KRAAKT": ice breaks, shake
  crackLen: 8,
  sink: wordAt("kraakt") + 2, // bill drops through the hole
  overdue: wordAt("kraakt") + 9, // comes back up as a reminder letter
  chip: wordAt("kraakt") + 15, // "Kan uitlopen op €40"
};

const ICE = { x: 40, y: 300, w: 1000, h: 520 };
const HOLE = { x: 540, y: 600 }; // stage coords
const SLIP = { x: 540 - SLIP_W / 2, y: 345 };

const poly = (pts: number[][]): Crack & { d: string } => {
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return { d: "M " + pts.map((q) => q.join(" ")).join(" L "), at: 0, len: Math.ceil(len) + 2 };
};
// ice-local coords; origin of the cracks = the hole
const o = [HOLE.x - ICE.x, HOLE.y - ICE.y];
const CRACKS = [
  poly([o, [o[0] - 90, o[1] + 40], [o[0] - 170, o[1] + 20], [o[0] - 300, o[1] + 80], [o[0] - 420, o[1] + 60]]),
  poly([o, [o[0] + 110, o[1] + 50], [o[0] + 190, o[1] + 30], [o[0] + 320, o[1] + 95], [o[0] + 400, o[1] + 70]]),
  poly([o, [o[0] - 40, o[1] + 80], [o[0] - 20, o[1] + 150], [o[0] - 70, o[1] + 205]]),
  poly([o, [o[0] + 60, o[1] + 90], [o[0] + 140, o[1] + 140], [o[0] + 150, o[1] + 200]]),
  poly([o, [o[0] - 150, o[1] - 30], [o[0] - 260, o[1] - 90], [o[0] - 380, o[1] - 100]]),
  poly([o, [o[0] + 170, o[1] - 40], [o[0] + 270, o[1] - 110], [o[0] + 390, o[1] - 120]]),
];

export const HookScene: React.FC<{ props: IjsProps["hook"]; bill: IjsProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const hair = interpolate(frame, [HOOK_T.hairline, HOOK_T.hairline + HOOK_T.hairLen], [0, 0.45], clamp);
  const big = interpolate(frame, [HOOK_T.crack, HOOK_T.crack + HOOK_T.crackLen], [0, 1], clamp);
  const crackProgress = CRACKS.map((_, i) => (i < 2 ? Math.max(hair, big) : big));
  const hole = frame >= HOOK_T.crack ? pop(frame, fps, HOOK_T.crack, { damping: 14, stiffness: 220 }) : 0;
  const s = shake(frame, HOOK_T.crack, 16, 16);

  // Before the break the bill wobbles a little: the ice is thin.
  const wobble = frame < HOOK_T.crack ? Math.sin(frame / 5) * interpolate(frame, [HOOK_T.hairline, HOOK_T.crack], [0.6, 2.4], clamp) : 0;
  const sink = frame >= HOOK_T.sink ? interpolate(frame - HOOK_T.sink, [0, 9], [0, 1], { ...clamp, easing: (t) => t * t }) : 0;
  const back = pop(frame, fps, HOOK_T.overdue, { damping: 11, stiffness: 150 });
  const chip = pop(frame, fps, HOOK_T.chip, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-30} stagger={3} />
      <Stage offsetY={70}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 62%", transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg) scale(1.22)` }}>
          <IceSheet
            w={ICE.w}
            h={ICE.h}
            ice="#dfe8ff"
            shine="#ffffff"
            rim={p.blueSoft}
            crackColor="#6f8fff"
            water={p.blue}
            cracks={CRACKS}
            crackProgress={crackProgress}
            hole={hole}
            holeCx={o[0]}
            holeCy={o[1]}
            style={{ left: ICE.x, top: ICE.y }}
          />
          {/* Everything above the water line; cards sink below it and vanish. */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: HOLE.y + 4, overflow: "hidden" }}>
            {frame < HOOK_T.overdue ? (
              <BillSlip
                sender={bill.sender}
                subject={bill.subject}
                amount={bill.amount}
                due={bill.due}
                style={{
                  left: SLIP.x,
                  top: SLIP.y + sink * (SLIP_H + 40),
                  transform: `rotate(${wobble + sink * 8}deg)`,
                  transformOrigin: "50% 100%",
                }}
              />
            ) : (
              <BillSlip
                sender={bill.sender}
                subject={bill.subject}
                amount={bill.amount}
                due={bill.due}
                overdue={props.overdue}
                style={{
                  left: SLIP.x,
                  top: SLIP.y - 20 + (1 - back) * (SLIP_H + 60),
                  transform: `rotate(${(1 - back) * -6}deg)`,
                }}
              />
            )}
          </div>
          {/* cost chip on the ice */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 700,
              display: "flex",
              justifyContent: "center",
              opacity: frame >= HOOK_T.chip ? Math.min(1, chip * 2) : 0,
              transform: `scale(${0.6 + 0.4 * chip})`,
            }}
          >
            <div
              style={{
                background: p.red,
                color: p.white,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 40,
                padding: "16px 34px",
                borderRadius: 999,
                boxShadow: "0 14px 30px rgba(255,90,121,0.35)",
              }}
            >
              {props.costChip}
            </div>
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
