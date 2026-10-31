import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { StatusIcon } from "../../components/StatusIcon";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Balloon, balloonKnot, BalloonString, PopBurst, StringLayer } from "../components/Balloon";
import { Hand, HAND_GRIP } from "../components/Hand";
import type { BallonProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  slip: 18, // one string slips out of the hand
  pop: 44, // the runaway balloon pops at the top
  notice: 48, // "Aanmaning" card drops where it popped
  cost: 62, // chip "kan uitlopen op €40"
};

const W = 250;
// Balloon centres (stage coordinates) for the four balloons in the hand.
const SLOTS = [
  { x: 210, y: 300 },
  { x: 430, y: 170 },
  { x: 670, y: 180 },
  { x: 880, y: 310 },
];
const HAND = { x: 540, y: 690 };
const NOTICE_W = 800;
const NOTICE_Y = 380;

export const HookScene: React.FC<{ props: BallonProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const colors = [
    { bg: p.blue, fg: p.white },
    { bg: p.blueSoft, fg: p.blue },
    { bg: p.teal, fg: p.ink },
    { bg: p.blueMid, fg: p.white },
  ];
  const grip = { x: HAND.x + HAND_GRIP.dx, y: HAND.y + HAND_GRIP.dy };

  // The runaway: rises and drifts from the slip until it pops.
  const rise = interpolate(frame, [HOOK_T.slip, HOOK_T.pop], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const popT = interpolate(frame, [HOOK_T.pop, HOOK_T.pop + 12], [0, 1], clamp);
  const flinch = interpolate(frame, [HOOK_T.slip, HOOK_T.slip + 4, HOOK_T.slip + 14], [0, -6, 0], clamp);

  const noticeIn = pop(frame, fps, HOOK_T.notice, { damping: 11, stiffness: 190 });
  const s = shake(frame, HOOK_T.notice + 6, 14, 10);
  const costIn = pop(frame, fps, HOOK_T.cost, springs.bouncy);

  const balloons = props.balloons.map((label, i) => {
    const base = SLOTS[i];
    const bob = Math.sin((frame + i * 13) / (11 + i)) * 8;
    const sway = Math.sin((frame + i * 17) / (14 + i)) * 3;
    let x = base.x;
    let y = base.y + bob;
    let alive = true;
    if (i === props.slipIndex) {
      x = base.x + rise * 70;
      y = base.y + bob - rise * 170;
      alive = frame < HOOK_T.pop;
    }
    return { label, x, y, sway, alive, i };
  });
  const runaway = balloons[props.slipIndex];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-20} stagger={3} />

      <Stage offsetY={40}>
        <StringLayer>
          {balloons.map((b) => {
            const knot = balloonKnot(b.x, b.y, W);
            if (b.i !== props.slipIndex) {
              return <BalloonString key={b.i} from={knot} to={grip} color={p.greyText} bend={(b.x - 540) * -0.08} />;
            }
            if (!b.alive) return null;
            // Before the slip it runs to the hand; after, it trails loose.
            const loose = interpolate(frame, [HOOK_T.slip, HOOK_T.slip + 10], [0, 1], clamp);
            const end = {
              x: interpolate(loose, [0, 1], [grip.x, knot.x + Math.sin(frame / 3) * 30]),
              y: interpolate(loose, [0, 1], [grip.y, knot.y + 300]),
            };
            return <BalloonString key={b.i} from={knot} to={end} color={p.greyText} bend={Math.sin(frame / 2.5) * 30 * loose} />;
          })}
        </StringLayer>

        {balloons.map((b) =>
          b.alive ? (
            <Balloon
              key={b.i}
              cx={b.x}
              cy={b.y}
              w={W}
              color={colors[b.i].bg}
              textColor={colors[b.i].fg}
              label={b.label}
              rotate={b.sway + (b.i === props.slipIndex ? rise * 12 : 0)}
            />
          ) : null,
        )}
        <PopBurst x={runaway.x} y={runaway.y} t={popT} color={p.red} radius={110} />

        <Hand x={HAND.x} y={HAND.y} sleeve={p.blue} rotate={flinch} />

        {/* The bill comes back as a final notice */}
        {frame >= HOOK_T.notice ? (
          <div
            style={{
              position: "absolute",
              left: 540 - NOTICE_W / 2,
              top: interpolate(noticeIn, [0, 1], [runaway.y - 120, NOTICE_Y]),
              width: NOTICE_W,
              transform: `translate(${s.x}px, ${s.y}px) rotate(${-3 + s.r}deg) scale(${0.6 + 0.4 * noticeIn})`,
              opacity: Math.min(1, noticeIn * 2),
              zIndex: 5,
            }}
          >
            <div
              style={{
                background: p.white,
                borderRadius: 34,
                padding: "30px 36px 30px 40px",
                display: "flex",
                alignItems: "center",
                gap: 26,
                boxShadow: "0 24px 70px rgba(17, 17, 40, 0.22)",
                borderLeft: `14px solid ${p.red}`,
              }}
            >
              <StatusIcon kind="alert" size={72} />
              <div>
                <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 70, letterSpacing: "-0.04em", color: p.red, lineHeight: 1 }}>
                  {props.noticeTitle}
                </div>
                <div style={{ fontFamily: fonts.ui, fontWeight: 500, fontSize: 34, color: p.ink, opacity: 0.7, marginTop: 10 }}>
                  {props.noticeSender}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
              <div
                style={{
                  background: p.red,
                  color: p.white,
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 42,
                  padding: "16px 34px",
                  borderRadius: 999,
                  transform: `scale(${costIn})`,
                  opacity: Math.min(1, costIn * 2),
                }}
              >
                {props.costChip}
              </div>
            </div>
          </div>
        ) : null}
      </Stage>
    </SceneBg>
  );
};
