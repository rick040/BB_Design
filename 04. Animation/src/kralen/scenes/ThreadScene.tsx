import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Bead, Thread, threadPoint, useBeadColors } from "../components/Bead";
import { type KralenProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[1];
// Absolute frames, hung on the spoken words.
export const THREAD_T = {
  headline: S + 2,
  forwarded: wordAt("door"), // "Stuur ze door,"
  thread: wordAt("dan"), // thread is pulled across
  first: wordAt("rijgt"), // first bead lands on the thread
  beadStagger: 8,
  dates: wordAt("datum"), // beads bounce in date order, Buddy happy
  subline: wordAt("op") + 2,
};

const SIZE = 150;
const X1 = 60;
const Y1 = 250;
const X2 = 890;
const Y2 = 250;
const SAG = 230;
const T_POS = [0.1, 0.29, 0.5, 0.71, 0.9];
const BUDDY = 190;

export const ThreadScene: React.FC<{ props: KralenProps["thread"]; beads: KralenProps["beads"] }> = ({
  props,
  beads,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const colors = useBeadColors();

  const fwdIn = pop(frame, fps, THREAD_T.forwarded, springs.bouncy);
  const check = interpolate(frame, [THREAD_T.forwarded + 4, THREAD_T.forwarded + 14], [0, 1], clamp);
  const draw = interpolate(frame, [THREAD_T.thread - 6, THREAD_T.first], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const arrivals = T_POS.map((_, i) => THREAD_T.first + i * THREAD_T.beadStagger);

  // Buddy tugs the thread at every arrival.
  let squash = 1;
  for (const a of arrivals) {
    const d = interpolate(frame, [a, a + 3, a + 9], [1, 0.86, 1], clamp);
    squash = Math.min(squash, d);
  }
  const buddyIn = pop(frame, fps, S - 2, springs.bouncy);
  const happy = frame >= THREAD_T.dates && frame < THREAD_T.dates + 26;
  const blink = happy ? 0.18 : blinkScale(frame, [S + 10]);
  const lookX = interpolate(frame, [arrivals[0], arrivals[4]], [-1, -0.2], clamp);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={THREAD_T.headline} stagger={3} />
      <Stage offsetY={-30}>
        {/* "Doorgestuurd" chip: where the beads come from */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, fwdIn * 2),
            transform: `scale(${0.5 + 0.5 * fwdIn})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: p.white,
              color: p.blue,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 42,
              padding: "16px 36px 16px 22px",
              borderRadius: 50,
              boxShadow: "0 20px 50px rgba(0, 20, 90, 0.35)",
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: p.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Checkmark size={34} color={p.white} progress={check} strokeWidth={16} />
            </div>
            {props.forwarded}
          </div>
        </div>

        {/* knot at the start of the thread */}
        <div
          style={{
            position: "absolute",
            left: X1 - 16,
            top: Y1 - 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: p.yellow,
            opacity: draw > 0 ? 1 : 0,
          }}
        />
        <Thread x1={X1} y1={Y1} x2={X2} y2={Y2} sag={SAG} color={p.yellow} width={9} draw={draw} />

        {beads.map((b, i) => {
          const a = arrivals[i];
          const target = threadPoint(X1, Y1, X2, Y2, SAG, T_POS[i]);
          const u = interpolate(frame, [a - 12, a], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
          if (u <= 0) return null;
          const from = { x: 540, y: 80 };
          const x = from.x + (target.x - from.x) * u;
          const y = from.y + (target.y - from.y) * u - 160 * Math.sin(Math.PI * u);
          const land = interpolate(frame, [a, a + 3, a + 9], [1, 0.82, 1], clamp);
          const bounce = frame >= THREAD_T.dates ? -30 * Math.max(0, Math.sin(Math.min(Math.PI, (frame - THREAD_T.dates - i * 3) / 5))) : 0;
          const labelIn = pop(frame, fps, a + 2, springs.smooth);
          return (
            <React.Fragment key={i}>
              <Bead
                size={SIZE}
                fill={colors[i].fill}
                text={colors[i].text}
                day={b.day}
                month={b.month}
                style={{
                  left: x - SIZE / 2,
                  top: y - SIZE / 2 + (frame >= THREAD_T.dates ? bounce : 0),
                  transform: `scale(${(0.6 + 0.4 * u) * land}, ${(0.6 + 0.4 * u) * (2 - land)})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: target.x - 90,
                  width: 180,
                  top: target.y + SIZE / 2 + 14,
                  textAlign: "center",
                  fontFamily: fonts.ui,
                  lineHeight: 1.15,
                  opacity: labelIn,
                  transform: `translateY(${(1 - labelIn) * 20}px)`,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 600, color: p.white }}>{b.short}</div>
                <div style={{ fontSize: 31, color: p.blueText }}>{b.amount}</div>
              </div>
            </React.Fragment>
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: lookX, y: 0.2 }}
          style={{
            position: "absolute",
            left: X2 + 70 - BUDDY / 2,
            top: Y2 + 150 - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.5 + 0.5 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={THREAD_T.subline} />
    </SceneBg>
  );
};
