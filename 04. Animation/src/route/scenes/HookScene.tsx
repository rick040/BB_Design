import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { DottedRoute, MapCard, MapLabel, NavArrow, NavBanner, Pin, type Pt, RouteLine } from "../components/MapKit";
import type { RouteProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  pass: 20, // the car drives straight past the turn
  missed: 30, // banner turns red: "Afslag gemist", map shakes
  detour: 36, // the detour starts drawing (red dots)
  detourLen: 22,
  warnPin: 52, // "Aanmaning" pin pops on the detour
  chip: 62, // "Kan uitlopen op €40"
};

const MAP = { x: 60, y: 170 };
// Planned route: up the main road, right at the turn, to the bill.
const PLANNED: Pt[] = [
  [300, 720],
  [300, 330],
  [620, 330],
];
const CAR_STOP = 190;
// The detour after missing the turn, past the reminder letter.
const DETOUR: Pt[] = [
  [300, CAR_STOP],
  [300, 110],
  [760, 110],
  [760, 330],
  [640, 330],
];

export const HookScene: React.FC<{ props: RouteProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const carY = interpolate(frame, [-16, HOOK_T.missed + 4], [700, CAR_STOP], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const missed = frame >= HOOK_T.missed;
  const flip = pop(frame, fps, HOOK_T.missed, { damping: 12, stiffness: 200 });
  const s = shake(frame, HOOK_T.missed, 16, 12);
  const plannedFade = interpolate(frame, [HOOK_T.missed, HOOK_T.missed + 8], [1, 0.25], clamp);
  const detour = interpolate(frame, [HOOK_T.detour, HOOK_T.detour + HOOK_T.detourLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const warn = pop(frame, fps, HOOK_T.warnPin, springs.bouncy);
  const chip = pop(frame, fps, HOOK_T.chip, springs.pop);
  const pulse = frame > HOOK_T.chip + 10 ? 1 + Math.max(0, Math.sin((frame - HOOK_T.chip - 10) / 4)) * 0.04 : 1;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-18} stagger={3} />

      <Stage offsetY={30}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)` }}>
          <MapCard
            mode="light"
            style={{ left: MAP.x, top: MAP.y }}
            overlay={
              <>
                <RouteLine pts={PLANNED} progress={1} color={missed ? "#9aa6c4" : p.blue} opacity={plannedFade} />
                <DottedRoute id="hook-detour" pts={DETOUR} progress={detour} color={p.red} />
              </>
            }
          >
            <Pin x={620} y={330} color={missed ? "#9aa6c4" : p.blue} icon="flag" />
            <MapLabel
              text={props.destination}
              x={620}
              y={196}
              bg={p.white}
              color={missed ? "#9aa6c4" : p.blue}
            />
            {frame >= HOOK_T.warnPin ? <Pin x={760} y={110} color={p.red} icon="alert" scale={warn} /> : null}
            {frame >= HOOK_T.warnPin ? (
              <MapLabel
                text={props.detourPin}
                x={700}
                y={52}
                anchor="right"
                bg={p.white}
                color={p.red}
                style={{ opacity: Math.min(1, warn * 2) }}
              />
            ) : null}
            {frame >= HOOK_T.chip ? (
              <MapLabel
                text={props.detourChip}
                x={600}
                y={470}
                bg={p.red}
                color={p.white}
                size={36}
                style={{
                  opacity: Math.min(1, chip * 2),
                  transform: `translate(-50%, -50%) scale(${(0.6 + 0.4 * chip) * pulse})`,
                }}
              />
            ) : null}
            <NavArrow x={300} y={carY} heading={-90} color={missed ? p.red : p.blue} />
          </MapCard>

          {/* Turn-by-turn banner: flips to red when the turn is missed */}
          <NavBanner
            title={missed ? props.bannerMissed : props.bannerTurn}
            sub={missed ? props.bannerMissedSub : props.bannerTurnSub}
            bg={missed ? p.red : p.blue}
            icon={missed ? "reroute" : "right"}
            style={{
              left: 60,
              top: 0,
              width: 960,
              boxSizing: "border-box",
              transform: missed ? `scale(${0.92 + 0.08 * flip})` : undefined,
            }}
          />
        </div>
      </Stage>
    </SceneBg>
  );
};
