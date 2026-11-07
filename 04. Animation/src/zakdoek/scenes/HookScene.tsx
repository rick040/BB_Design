import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BillCard, BILL_W } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Handkerchief, Knot, QuestionBadge } from "../components/Cloth";
import type { ZakdoekProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  ask: 6, // "?" badges pop above the knots
  askStagger: 6,
  untie: 30, // the big knot comes undone ...
  untieLen: 12,
  notice: 46, // ... and out slams the reminder notice ("Aanmaning")
  cost: 60, // chip "Kan uitlopen op €40"
};

const HANKY = { x: 200, y: -10, size: 680 };
// Knots (stage coords, centre) with their size and the angle of the ends.
const KNOTS = [
  { x: 330, y: 150, s: 170, a: -25 },
  { x: 760, y: 130, s: 150, a: 22 },
  { x: 560, y: 390, s: 220, a: -8 }, // the one that comes undone
];
const BIG = 2;
const NOTICE = { x: (1080 - BILL_W) / 2, y: 520 };

export const HookScene: React.FC<{
  props: ZakdoekProps["hook"];
  bill: ZakdoekProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const breathe = Math.sin(frame / 14) * 1.2;
  const loosen = interpolate(frame, [HOOK_T.untie, HOOK_T.untie + HOOK_T.untieLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const wobble = frame < HOOK_T.untie ? Math.sin(frame / 3) * Math.min(1, frame / 20) * 6 : 0;

  // The notice flies out of the knot and lands in front, with a jolt.
  const out = pop(frame, fps, HOOK_T.notice - 10, { damping: 15, stiffness: 150 });
  const nx = interpolate(out, [0, 1], [KNOTS[BIG].x - BILL_W / 2, NOTICE.x]);
  const ny = interpolate(out, [0, 1], [KNOTS[BIG].y - 165, NOTICE.y]);
  const s = shake(frame, HOOK_T.notice, 14, 14);
  const cost = pop(frame, fps, HOOK_T.cost, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-20} stagger={3} />

      <Stage offsetY={30} style={{ transform: `translate(${s.x}px, ${s.y}px)` }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${-4 + breathe}deg)`, transformOrigin: "50% 40%" }}>
          <Handkerchief size={HANKY.size} style={{ left: HANKY.x, top: HANKY.y }} />
          {KNOTS.map((k, i) => {
            const big = i === BIG;
            return (
              <Knot
                key={i}
                size={k.s}
                angle={k.a + (big ? wobble : 0)}
                loosen={big ? loosen : 0}
                style={{ left: k.x - k.s / 2, top: k.y - k.s / 2 }}
              />
            );
          })}
          {KNOTS.map((k, i) => {
            const t = pop(frame, fps, HOOK_T.ask + i * HOOK_T.askStagger, springs.bouncy);
            const gone = i === BIG ? 1 - loosen : 1;
            const size = i === BIG ? 92 : 76;
            return (
              <QuestionBadge
                key={`q${i}`}
                size={size}
                style={{
                  left: k.x - size / 2 + k.s * 0.32,
                  top: k.y - k.s * 0.5 - size * 0.7 + Math.sin((frame + i * 9) / 7) * 5,
                  opacity: Math.min(1, t * 2) * gone,
                  transform: `scale(${t * (0.6 + 0.4 * gone)}) rotate(${(1 - t) * -30}deg)`,
                }}
              />
            );
          })}
        </div>

        {frame >= HOOK_T.notice - 10 ? (
          <BillCard
            sender={bill.sender}
            subject={props.noticeSubject}
            amount={bill.amount}
            dueLabel={props.noticeLabel}
            urgent
            style={{
              position: "absolute",
              left: nx,
              top: ny,
              transform: `scale(${0.25 + 0.75 * out}) rotate(${(1 - out) * 14 - 3}deg)`,
              opacity: Math.min(1, out * 3),
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 880,
            display: "flex",
            justifyContent: "center",
            opacity: frame >= HOOK_T.cost ? Math.min(1, cost * 2) : 0,
            transform: `scale(${cost})`,
          }}
        >
          <div
            style={{
              padding: "14px 34px",
              borderRadius: 40,
              background: p.red,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 40,
              boxShadow: "0 16px 40px rgba(255,90,121,0.35)",
            }}
          >
            {props.costChip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
