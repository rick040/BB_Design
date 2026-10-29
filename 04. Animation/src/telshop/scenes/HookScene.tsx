import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Envelope, ReenactedChip, Starburst, TvOverlay } from "../components/Telshop";
import type { TelshopProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  wobble: 0, // the grey stack of bills already wobbles on frame 0
  topple: 14, // ... and topples over
  toppleStagger: 2,
  slam: 48, // the red "Aanmaning" envelope slams in (only colour in the scene)
  burst: 58, // starburst "Kan uitlopen op €40!"
};

const GREY_BG = "#e4e4e8";
const GREY_INK = "#2c2c33";
const FLOOR = 830;
const ENV_W = 380;
const ENV_H = 228;
const STEP = 118;

// Where each envelope flies when the stack falls (velocity in px/frame, spin in deg/frame).
const FALL = [
  { vx: -9, vy: -6, spin: -6, restY: 610, restR: -14 },
  { vx: 7, vy: -9, spin: 7, restY: 640, restR: 12 },
  { vx: -16, vy: -12, spin: -10, restY: 540, restR: -30 }, // flies out of frame: lost
  { vx: 13, vy: -4, spin: 9, restY: 590, restR: 22 },
  { vx: 2, vy: -14, spin: -4, restY: 630, restR: -6 },
];
const G = 1.6;

export const HookScene: React.FC<{ props: TelshopProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const s = shake(frame, HOOK_T.slam + 3, 16, 14);
  const wobble = frame < HOOK_T.topple ? Math.sin(frame / 1.6) * (2 + frame * 0.45) : 0;

  const slam = interpolate(frame, [HOOK_T.slam, HOOK_T.slam + 6], [0, 1], clamp);
  const slamSettle = pop(frame, fps, HOOK_T.slam + 5, { damping: 10, stiffness: 220 });
  const burst = pop(frame, fps, HOOK_T.burst, springs.bouncy);

  return (
    <SceneBg color={GREY_BG}>
      <Headline text={props.headline} color={GREY_INK} delay={-12} stagger={3} sizeFactor={1.4} />

      <Stage offsetY={-10}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)` }}>
          {/* floor */}
          <div style={{ position: "absolute", left: -200, right: -200, top: FLOOR, height: 8, background: "#b9b9c0", borderRadius: 4 }} />

          {props.envelopes.map((label, i) => {
            const x0 = 540 - ENV_W / 2 + (i % 2 === 0 ? -14 : 16);
            const y0 = FLOOR - ENV_H - i * STEP;
            const r0 = (i % 2 === 0 ? -3 : 4) + wobble * (0.4 + i * 0.3);
            const t = frame - (HOOK_T.topple + (4 - i) * HOOK_T.toppleStagger);
            let x = x0;
            let y = y0;
            let r = r0;
            if (t > 0) {
              const f = FALL[i];
              const yFree = y0 + f.vy * t + 0.5 * G * t * t;
              y = Math.min(yFree, f.restY);
              const landed = yFree >= f.restY;
              const tLand = landed ? Math.max(1, (-f.vy + Math.sqrt(f.vy * f.vy + 2 * G * (f.restY - y0))) / G) : t;
              x = x0 + f.vx * Math.min(t, tLand) * (landed ? 1 : 1);
              r = landed ? f.restR : r0 + f.spin * t;
            }
            // Stack wobble pivots around the base of the stack.
            const pivot = t > 0 ? "50% 50%" : `50% ${FLOOR - y0}px`;
            return (
              <Envelope
                key={i}
                label={label}
                w={ENV_W}
                h={ENV_H}
                style={{ left: x, top: y, transform: `rotate(${r}deg)`, transformOrigin: pivot }}
              />
            );
          })}

          {/* The red reminder: the only colour in the black-and-white "before" */}
          <Envelope
            label={props.reminder}
            w={500}
            h={300}
            fill={p.red}
            line="#b8244a"
            ink={p.white}
            style={{
              left: 540 - 250,
              top: interpolate(slam, [0, 1], [-900, 250]),
              transform: `rotate(${interpolate(slam, [0, 1], [-25, 4])}deg) scale(${frame >= HOOK_T.slam + 5 ? 1.08 - 0.08 * slamSettle : 1})`,
              opacity: frame >= HOOK_T.slam ? 1 : 0,
            }}
          />

          <Starburst text={props.burst} size={370} t={frame >= HOOK_T.burst ? burst : 0} rotate={-12} fill={p.yellow} style={{ left: 680, top: 60 }} />
        </div>

        <ReenactedChip text={props.reenacted} frame={frame} style={{ left: 40, top: -40 }} />
      </Stage>

      <TvOverlay frame={frame} />
    </SceneBg>
  );
};
