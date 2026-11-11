import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { NOTA_H, NOTA_W, NotaCard, Ticket } from "../components/Parts";
import { SCENE_STARTS, type OproepProps, wordAt } from "../schema";

const S = SCENE_STARTS[1];
// The tap lands on "door"; Buddy swallows the three notas, then reads each
// due date on "leest ... vervaldatum" and hands it back with a queue ticket.
export const FWD_T = {
  button: S - 6,
  tap: wordAt("door"),
  fly: wordAt("door") + 4,
  flyStagger: 5,
  flyLen: 10,
  read: wordAt("leest") - 2,
  readStagger: 10,
  subline: wordAt("leest"),
};

const BUDDY = 220;
const FEET = 880;
const MOUTH = { x: 540, y: FEET - BUDDY * BUDDY_RATIO * 0.55 };
const STACK = [450, 540, 630];
const ROW = [210, 540, 870];
const ROW_TOP = 250;
const SCALE = 0.86;

export const ForwardScene: React.FC<{
  props: OproepProps["forward"];
  notas: OproepProps["notas"];
}> = ({ props, notas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const btnIn = pop(frame, fps, FWD_T.button, springs.pop);
  const tap = interpolate(frame, [FWD_T.tap, FWD_T.tap + 3, FWD_T.tap + 8], [1, 0.9, 1], clamp);
  const btnOut = interpolate(frame, [FWD_T.tap + 6, FWD_T.tap + 14], [1, 0], clamp);
  const buddyIn = pop(frame, fps, FWD_T.fly - 8, springs.bouncy);

  const gulps = notas.map((_, i) => FWD_T.fly + i * FWD_T.flyStagger + FWD_T.flyLen);
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  for (const g of gulps) {
    squash *= interpolate(frame, [g, g + 3, g + 8], [1, 0.86, 1], clamp);
  }
  const reads = notas.map((_, i) => FWD_T.read + i * FWD_T.readStagger);
  for (const r of reads) {
    squash *= interpolate(frame, [r - 4, r, r + 6], [1, 1.12, 1], clamp);
  }
  // Buddy looks at the nota he's reading.
  const readIdx = reads.filter((r) => frame >= r).length - 1;
  const look =
    readIdx >= 0
      ? { x: (ROW[readIdx] - 540) / 330, y: -0.9 }
      : frame >= FWD_T.fly
        ? { x: 0, y: -1 }
        : { x: 0.2, y: -0.5 };

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={S - 10} stagger={2} />
      <Stage>
        {notas.map((n, i) => {
          const f0 = FWD_T.fly + i * FWD_T.flyStagger;
          const u = interpolate(frame, [f0, f0 + FWD_T.flyLen], [0, 1], {
            ...clamp,
            easing: Easing.in(Easing.cubic),
          });
          const out = pop(frame, fps, reads[i], springs.bouncy);
          const inside = u >= 1 && frame < reads[i];
          if (inside) return null;
          let x: number;
          let y: number;
          let sc: number;
          let rot: number;
          if (frame < reads[i]) {
            x = STACK[i] + (MOUTH.x - STACK[i]) * u;
            y = 60 + (MOUTH.y - NOTA_H / 2 - 60) * u;
            sc = 0.8 * (1 - 0.85 * u);
            rot = (i - 1) * 8 * (1 - u) + 120 * u * (i - 1);
          } else {
            x = MOUTH.x + (ROW[i] - MOUTH.x) * out;
            y = MOUTH.y - NOTA_H / 2 + (ROW_TOP - (MOUTH.y - NOTA_H / 2)) * out;
            sc = 0.15 + (SCALE - 0.15) * out;
            rot = (1 - out) * 30 * (i - 1);
          }
          const stubIn = pop(frame, fps, reads[i] + 6, springs.pop);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - NOTA_W / 2,
                top: y,
                transform: `rotate(${rot}deg) scale(${sc})`,
                transformOrigin: "50% 50%",
                opacity: frame < FWD_T.button ? 0 : 1,
              }}
            >
              <NotaCard
                sender={n.sender}
                subject={n.subject}
                amount={n.amount}
                due={frame >= reads[i] ? n.due : "Vervalt ?"}
                read={frame >= reads[i] + 6 ? stubIn : 0}
              />
              {frame >= reads[i] ? (
                <div
                  style={{
                    position: "absolute",
                    left: NOTA_W / 2 - 125,
                    top: -150,
                    transform: `translateY(${(1 - stubIn) * 120}px) rotate(${(i - 1) * -4}deg)`,
                    opacity: Math.min(1, stubIn * 2),
                  }}
                >
                  <Ticket width={250} height={140} top="vervalt" big={n.due} />
                </div>
              ) : null}
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, btnIn * 2) * btnOut,
            transform: `scale(${(0.6 + 0.4 * btnIn) * tap})`,
          }}
        >
          <div
            style={{
              background: p.white,
              color: p.blue,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 46,
              padding: "22px 52px",
              borderRadius: 60,
              boxShadow: "0 20px 60px rgba(0, 20, 120, 0.3)",
            }}
          >
            {props.button} ↪
          </div>
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [wordAt("vervaldatum") + 20])}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={FWD_T.subline} />
    </SceneBg>
  );
};
