import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Baton, outfitFor, Runner, type RunnerPose, runnerHand, SpeedLines, Tag, Track } from "../components/Track";
import type { EstafetteProps } from "../schema";

// Timeline (frames, scene-local).
export const SCORE_T = {
  board: 8, // scoreboard switches on
  row1: 24, // "17 NOV · Mail: nog 7 dagen" lights up
  row2: 38, // "22 NOV · Mail: nog 2 dagen"
  row3: 52, // "24 NOV · Vervaldatum, in je agenda"
  arrive: 58, // Buddy runs up to the runner
  subline: 62,
  handback: 72, // Buddy hands the baton back ...
  handbackLen: 10,
  payTag: 84, // ... "Jij betaalt" tag
  go: 92, // runner sprints to the finish
  tape: 117, // runner breaks the tape
};

const FEET = 790;
const RUNNER_H = 350;
const BUDDY = 200;
const RUNNER_X0 = 740;
const FINISH_X = 990;

export const ScoreScene: React.FC<{
  props: EstafetteProps["score"];
  bill: EstafetteProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const board = pop(frame, fps, SCORE_T.board, springs.smooth);

  // Buddy runs in from the left with the baton.
  const buddyX = interpolate(frame, [0, SCORE_T.arrive], [-140, 520], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const running = frame < SCORE_T.arrive;
  const hop = running ? -Math.abs(Math.sin(frame / 3.2)) * 34 : 0;
  const land = interpolate(frame, [SCORE_T.arrive, SCORE_T.arrive + 4, SCORE_T.arrive + 10], [0.82, 1.08, 1], clamp);
  const buddyTop = FEET - BUDDY * BUDDY_RATIO + hop;
  const blink = frame > SCORE_T.go ? 0.18 + 0.82 * interpolate(frame, [SCORE_T.go, SCORE_T.go + 4], [1, 0], clamp) : blinkScale(frame, [SCORE_T.arrive + 6]);

  // Runner waits, takes the baton, then sprints to the finish.
  const goT = interpolate(frame, [SCORE_T.go, SCORE_T.tape + 16], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const runnerX = RUNNER_X0 + goT * 520;
  const run = frame < SCORE_T.go ? 0 : Math.min(1, (frame - SCORE_T.go) / 6);
  const reachBack = interpolate(frame, [SCORE_T.arrive - 10, SCORE_T.handback, SCORE_T.handback + SCORE_T.handbackLen + 4], [0, 1, 0], clamp);
  const pose: RunnerPose = {
    phase: frame * 0.7,
    run,
    arms: frame < SCORE_T.go ? "back" : "swing",
    reach: frame < SCORE_T.go ? reachBack : 0,
    lean: 2 + 10 * run,
  };
  const hand = runnerHand(pose, runnerX, FEET, RUNNER_H);

  const handT = interpolate(frame, [SCORE_T.handback, SCORE_T.handback + SCORE_T.handbackLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const onBuddy = { x: buddyX + 8, y: buddyTop + BUDDY * BUDDY_RATIO * 0.62 };
  const inHand = { x: hand.x + (frame < SCORE_T.go ? -20 : 60), y: hand.y };
  const baton = {
    x: interpolate(handT, [0, 1], [onBuddy.x, inHand.x]),
    y: interpolate(handT, [0, 1], [onBuddy.y, inHand.y]) - Math.sin(handT * Math.PI) * 40,
  };

  const payTag = pop(frame, fps, SCORE_T.payTag, springs.pop);
  const tapeBreak = interpolate(frame, [SCORE_T.tape, SCORE_T.tape + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const rowOn = (i: number) => pop(frame, fps, [SCORE_T.row1, SCORE_T.row2, SCORE_T.row3][i], springs.pop);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-4} stagger={3} />

      <Stage offsetY={-10}>
        {/* Stadium scoreboard */}
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 0,
            width: 900,
            height: 410,
            borderRadius: 30,
            background: p.blue,
            boxShadow: `0 0 0 12px ${p.blueSoft}, 0 24px 50px rgba(1,30,120,0.25)`,
            padding: "30px 44px",
            boxSizing: "border-box",
            opacity: board,
            transform: `scale(${0.94 + 0.06 * board})`,
            fontFamily: fonts.ui,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              color: p.white,
              fontWeight: 700,
              fontSize: 40,
              paddingBottom: 18,
              borderBottom: `3px dashed ${p.blueText}`,
            }}
          >
            <span>{bill.sender}</span>
            <span style={{ color: p.yellow }}>{bill.amount}</span>
          </div>
          {props.rows.map((row, i) => {
            const on = rowOn(i);
            const isDue = i === props.rows.length - 1;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  marginTop: 26,
                  fontSize: 38,
                  color: p.white,
                  opacity: 0.22 + 0.78 * Math.min(1, on),
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: on > 0.05 ? (isDue ? p.yellow : p.teal) : "transparent",
                    border: `4px solid ${on > 0.05 ? (isDue ? p.yellow : p.teal) : p.blueText}`,
                    transform: `scale(${0.6 + 0.4 * on})`,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontWeight: 700, letterSpacing: "0.08em", color: p.blueSoft, width: 160 }}>{row.date}</span>
                <span
                  style={{
                    fontWeight: isDue ? 600 : 500,
                    transform: `translateX(${(1 - Math.min(1, on)) * 30}px)`,
                  }}
                >
                  {row.text}
                </span>
              </div>
            );
          })}
        </div>

        <Track top={FEET} scroll={0} band={p.blueSoft} line={p.white} finishX={FINISH_X} />

        {/* Finish posts + tape */}
        <div style={{ position: "absolute", left: FINISH_X - 6, top: FEET - 290, width: 14, height: 290, borderRadius: 6, background: p.blue }} />
        {[0, 1].map((side) => {
          const dir = side === 0 ? -1 : 1;
          return (
            <div
              key={side}
              style={{
                position: "absolute",
                left: side === 0 ? FINISH_X - 150 : FINISH_X,
                top: FEET - 220,
                width: 150,
                height: 14,
                borderRadius: 7,
                background: p.yellow,
                transformOrigin: side === 0 ? "0% 50%" : "100% 50%",
                transform: `rotate(${dir * -tapeBreak * 70}deg) scaleX(${1 - tapeBreak * 0.3})`,
                opacity: side === 1 ? 1 - tapeBreak : 1,
              }}
            />
          );
        })}

        <Runner x={runnerX} feetY={FEET} height={RUNNER_H} outfit={outfitFor(p, false)} {...pose} />

        <SpeedLines x={runnerX - 60} y={FEET - 30} strength={goT > 0 ? Math.min(1, goT * 4) : 0} color={p.blueSoft} />
        <SpeedLines x={buddyX - 60} y={FEET - 10} strength={running ? 0.8 : 0} color={p.blueSoft} />

        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={blink}
          squash={running ? 1 : land}
          look={frame < SCORE_T.arrive ? { x: 1, y: 0 } : { x: 0.8, y: -0.2 }}
          style={{ position: "absolute", left: buddyX - BUDDY / 2, top: buddyTop }}
        />

        <Baton
          label={bill.sender}
          cx={frame >= SCORE_T.handback ? (handT >= 1 ? inHand.x : baton.x) : onBuddy.x}
          cy={frame >= SCORE_T.handback ? (handT >= 1 ? inHand.y : baton.y) : onBuddy.y}
          rotate={frame >= SCORE_T.handback ? 0 : -8}
          width={300}
          height={56}
          bg={p.yellow}
          fg={p.blue}
        />

        {frame >= SCORE_T.payTag ? (
          <Tag text={props.handbackTag} x={inHand.x} y={inHand.y - 34} bg={p.blue} fg={p.white} size={40} scale={payTag} icon="check" />
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={SCORE_T.subline} />
    </SceneBg>
  );
};
