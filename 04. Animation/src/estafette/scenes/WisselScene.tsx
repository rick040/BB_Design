import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Baton, Runner, type RunnerPose, runnerHand, SpeedLines, Tag, Track } from "../components/Track";
import type { EstafetteProps } from "../schema";

// Timeline (frames, scene-local).
export const WISSEL_T = {
  tag: 14, // yellow "Doorsturen" tag pops on the baton
  pass: 34, // baton leaves the runner's hand ...
  catch: 44, // ... and Buddy catches it (squash)
  forwarded: 46, // tag turns into "Doorgestuurd ✓"
  read: 54, // Buddy looks down at the baton
  amount: 60, // amount chip
  due: 68, // due-date chip
  subline: 74,
  blink: 84,
  crouch: 96, // Buddy crouches ...
  sprint: 102, // ... and sprints off to the right
};

const FEET = 730;
const RUNNER_H = 440;
const BUDDY = 250;
const BUDDY_X = 760; // centre
const ZONE = { x: 560, w: 400 };

export const WisselScene: React.FC<{
  props: EstafetteProps["wissel"];
  bill: EstafetteProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Runner comes in fast from the left, reaches out and slows down after the pass.
  const runnerX = interpolate(frame, [0, WISSEL_T.pass, WISSEL_T.pass + 30], [40, 400, 440], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const run = interpolate(frame, [WISSEL_T.pass, WISSEL_T.pass + 26], [1, 0], clamp);
  const reach = interpolate(frame, [6, 22, WISSEL_T.catch, WISSEL_T.catch + 12], [0, 1, 1, 0], clamp);
  const pose: RunnerPose = {
    phase: frame * 0.62,
    run,
    arms: reach > 0.01 ? "reach" : "down",
    reach,
    lean: 4 + 8 * run,
  };
  const hand = runnerHand(pose, runnerX, FEET, RUNNER_H);

  // Buddy jogs in place in the zone, catches, reads, then sprints away.
  const jog = frame < WISSEL_T.crouch ? Math.abs(Math.sin(frame / 4)) * -14 * (frame < WISSEL_T.catch ? 1 : 0.4) : 0;
  const sprintT = interpolate(frame, [WISSEL_T.sprint, WISSEL_T.sprint + 18], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const buddyX = BUDDY_X + sprintT * 700;
  const squash = interpolate(
    frame,
    [
      WISSEL_T.catch - 2,
      WISSEL_T.catch + 2,
      WISSEL_T.catch + 8,
      WISSEL_T.catch + 14,
      WISSEL_T.crouch,
      WISSEL_T.crouch + 5,
      WISSEL_T.sprint + 2,
      WISSEL_T.sprint + 8,
    ],
    [1, 0.8, 1.1, 1, 1, 0.82, 1.12, 1],
    clamp,
  );
  const lookBack = frame < WISSEL_T.catch ? { x: -1, y: 0 } : frame < WISSEL_T.read ? { x: -0.4, y: 0.2 } : frame < WISSEL_T.crouch ? { x: 0.1, y: 0.8 } : { x: 1, y: 0 };
  const blink = blinkScale(frame, [WISSEL_T.blink]);
  const buddyTop = FEET - BUDDY * BUDDY_RATIO + jog;

  // Baton: in the runner's hand, then flies into Buddy's arms.
  const passT = interpolate(frame, [WISSEL_T.pass, WISSEL_T.catch], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const onBuddy = { x: buddyX + 10, y: buddyTop + BUDDY * BUDDY_RATIO * 0.62 };
  const inHand = { x: hand.x + 90, y: hand.y };
  const baton = {
    x: interpolate(passT, [0, 1], [inHand.x, onBuddy.x]),
    y: interpolate(passT, [0, 1], [inHand.y, onBuddy.y]) - Math.sin(passT * Math.PI) * 50,
    r: interpolate(passT, [0, 1], [0, -8]),
  };

  const tag = pop(frame, fps, WISSEL_T.tag, springs.pop);
  const forwarded = frame >= WISSEL_T.forwarded;
  const fwdPop = pop(frame, fps, WISSEL_T.forwarded, springs.pop);

  const amount = pop(frame, fps, WISSEL_T.amount, springs.bouncy);
  const due = pop(frame, fps, WISSEL_T.due, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={-4} stagger={3} />

      <Stage offsetY={70}>
        <Track
          top={FEET}
          scroll={frame * 4}
          band={p.blueMid}
          line={p.blueSoft}
          zone={{ x: ZONE.x, w: ZONE.w, color: "rgba(255,255,255,0.10)", label: props.zoneLabel, labelColor: p.blueSoft }}
        />

        {/* Chips Buddy reads off the baton */}
        <Tag text={bill.amount} x={360} y={120} bg={p.white} fg={p.blue} size={52} scale={amount} />
        <Tag text={`Vervalt ${bill.due}`} x={720} y={120} bg={p.blueSoft} fg={p.blue} size={52} scale={due} />

        <Runner x={runnerX} feetY={FEET} height={RUNNER_H} color={p.white} farColor={p.blueSoft} {...pose} />

        <SpeedLines x={buddyX - 80} y={FEET - 20} strength={sprintT > 0 ? Math.min(1, sprintT * 3) : 0} color={p.blueSoft} />

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={lookBack}
          style={{ position: "absolute", left: buddyX - BUDDY / 2, top: buddyTop }}
        />

        <Baton
          label={bill.sender}
          cx={baton.x}
          cy={frame >= WISSEL_T.catch ? onBuddy.y : baton.y}
          rotate={baton.r}
          width={330}
          height={62}
          bg={p.yellow}
          fg={p.blue}
        />

        <Tag
          text={forwarded ? props.forwardedTag : props.forwardTag}
          icon={forwarded ? "check" : "arrow"}
          x={baton.x}
          y={frame >= WISSEL_T.catch ? buddyTop - 16 : baton.y - 44}
          bg={forwarded ? p.white : p.yellow}
          fg={p.blue}
          size={40}
          scale={(forwarded ? 0.85 + 0.15 * fwdPop : tag) * (1 - sprintT)}
        />
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={WISSEL_T.subline} />
    </SceneBg>
  );
};
