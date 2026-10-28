import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, shake } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Baton, outfitFor, Runner, type RunnerPose, runnerHand, Tag, Track } from "../components/Track";
import type { EstafetteProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  wobble: 18, // the stack starts to sway harder
  drop: 30, // top baton slips off the stack
  land: 44, // ... and hits the track
  stop: 52, // runner has come to a halt
  alert: 50, // red "Aanmaning" chip slams on the fallen baton
  subline: 58,
};

const RUNNER_X = 600;
const FEET = 770;
const RUNNER_H = 460;
const TRACK_TOP = 770;
const BW = 290; // baton width
const BH = 62; // baton height
const SPEED = 15; // px per frame while running
const STRIDE = 0.42; // radians per px/frame

/** Ground speed: full until the drop, then the runner brakes. */
const speedAt = (f: number) =>
  interpolate(f, [HOOK_T.drop + 4, HOOK_T.stop], [SPEED, 0], clamp);

/** Distance travelled (px) at frame f; frame 0 starts mid-stride. */
const distance = (f: number) => {
  let d = 400;
  for (let i = 0; i < Math.max(0, Math.floor(f)); i++) d += speedAt(i);
  return d;
};

export const HookScene: React.FC<{ props: EstafetteProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const dist = distance(frame);
  const run = speedAt(frame) / SPEED;
  const pose: RunnerPose = {
    phase: (dist / SPEED) * STRIDE * 2.2,
    run: Math.max(run, 0),
    arms: "carry",
    lean: 4 + 6 * run,
  };
  const hand = runnerHand(pose, RUNNER_X, FEET, RUNNER_H);

  // Stack of batons on the runner's hands; sways more and more.
  const sway = interpolate(frame, [0, HOOK_T.wobble, HOOK_T.drop], [0.5, 1, 1.6], clamp);
  const stop = frame >= HOOK_T.stop ? shake(frame, HOOK_T.stop, 14, 6) : { x: 0, y: 0, r: 0 };

  // Falling top baton: world-fixed after it lands.
  const top = props.batons.length - 1;
  const stackPos = (i: number) => ({
    cx: hand.x + 95 + Math.sin(frame / 4 + i * 1.3) * 6 * sway * (i + 1) * 0.6,
    cy: hand.y - BH / 2 - 4 - i * (BH + 8),
    r: Math.sin(frame / 5 + i) * 2.4 * sway * (i + 1) * 0.5,
  });
  const dropStart = stackPos(top);
  let fall = { cx: dropStart.cx, cy: dropStart.cy, r: dropStart.r };
  if (frame >= HOOK_T.drop) {
    const t = Math.min(frame, HOOK_T.land) - HOOK_T.drop;
    const T = HOOK_T.land - HOOK_T.drop;
    const groundY = TRACK_TOP + 44;
    // Gravity arc relative to the world: drifts back while the ground slides away.
    const x0 = stackPos(top);
    const worldBack = distance(frame) - distance(HOOK_T.drop);
    const air = Math.min(frame - HOOK_T.drop, T);
    const startCy = x0.cy;
    const cy = startCy + (groundY - startCy) * (t / T) ** 2 - 60 * Math.sin((Math.PI * t) / T);
    const bounce = frame > HOOK_T.land ? -Math.abs(Math.sin((frame - HOOK_T.land) / 2.2)) * 26 * Math.exp(-(frame - HOOK_T.land) / 5) : 0;
    fall = {
      cx: dropStart.cx - worldBack - 7 * air,
      cy: (frame >= HOOK_T.land ? groundY : cy) + bounce,
      r: frame >= HOOK_T.land ? -8 + bounce * 0.2 : -t * 9,
    };
  }

  const alert = pop(frame, fps, HOOK_T.alert, { damping: 10, stiffness: 220 });
  const alertShake = shake(frame, HOOK_T.alert, 16, 10);

  // Sweat drops once the runner stops.
  const sweat = frame >= HOOK_T.stop - 6 ? (frame - HOOK_T.stop + 6) % 24 : -1;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-20} stagger={3} />

      <Stage offsetY={40}>
        <Track top={TRACK_TOP} scroll={dist} band={p.blueSoft} line={p.white} />

        <Runner
          x={RUNNER_X + stop.x}
          feetY={FEET}
          height={RUNNER_H}
          outfit={outfitFor(p, false)}
          {...pose}
        />

        {props.batons.map((label, i) => {
          if (i === top && frame >= HOOK_T.drop) return null;
          const s = stackPos(i);
          return (
            <Baton
              key={i}
              label={label}
              cx={s.cx + stop.x}
              cy={s.cy}
              rotate={s.r}
              width={BW}
              height={BH}
              bg={p.white}
              fg={p.blue}
              style={{ zIndex: 2 }}
            />
          );
        })}

        {frame >= HOOK_T.drop ? (
          <Baton label={props.batons[top]} cx={fall.cx} cy={fall.cy} rotate={fall.r} width={BW} height={BH} bg={p.white} fg={p.blue} />
        ) : null}

        {frame >= HOOK_T.alert ? (
          <Tag
            text={props.alertChip}
            x={fall.cx + alertShake.x}
            y={fall.cy - 50}
            bg={p.red}
            fg={p.white}
            icon="alert"
            size={46}
            scale={alert}
            rotate={-4 + alertShake.r * 2}
          />
        ) : null}

        {sweat >= 0
          ? [0, 1].map((k) => {
              const t = ((sweat + k * 12) % 24) / 24;
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: RUNNER_X + 60 + k * 36 + t * 40,
                    top: FEET - RUNNER_H - 10 + t * 90,
                    width: 24,
                    height: 34,
                    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                    background: p.blueSoft,
                    opacity: interpolate(t, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
                  }}
                />
              );
            })
          : null}
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={HOOK_T.subline} />
    </SceneBg>
  );
};
