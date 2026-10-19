import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { Checkmark } from "../../../components/Checkmark";
import { SceneBg, Stage } from "../../../components/Stage";
import { clamp, pop, springs } from "../../../lib/anim";
import { useLayout } from "../../../lib/layout";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import { dec, decFonts, decTracking } from "../../theme";
import type { VoornemenProps } from "../schema";

// Beats (frames, scene-lokaal).
export const THIRTY_T = {
  timer: 12, // de timer verschijnt op 0:30
  run: 22, // hij loopt af
  runLen: 54,
  step1: 26, // open de mail
  step2: 46, // tik op doorsturen
  step3: 66, // klaar
  done: 76, // vinkje in de timer
  sub: 70,
};

const R = 185;
const CIRC = 2 * Math.PI * R;

export const ThirtyScene: React.FC<{ props: VoornemenProps["thirty"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const timerIn = pop(frame, fps, THIRTY_T.timer, springs.bouncy);
  const run = interpolate(frame, [THIRTY_T.run, THIRTY_T.run + THIRTY_T.runLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const seconds = Math.ceil(30 * (1 - run));
  const done = interpolate(frame, [THIRTY_T.done, THIRTY_T.done + 12], [0, 1], clamp);
  const buddyIn = pop(frame, fps, THIRTY_T.step3, springs.bouncy);
  const stepAt = [THIRTY_T.step1, THIRTY_T.step2, THIRTY_T.step3];

  return (
    <SceneBg color={p.light}>
      <DHeadline text={props.headline} color={p.blue} delay={4} stagger={3} sizeFactor={L.tall ? 0.85 : 1.0} />
      <Stage offsetY={40}>
        <div
          style={{
            position: "absolute",
            left: 540 - R - 30,
            top: 0,
            width: (R + 30) * 2,
            height: (R + 30) * 2,
            transform: `scale(${0.5 + 0.5 * Math.min(1, timerIn)})`,
            opacity: Math.min(1, timerIn * 2),
          }}
        >
          <svg width={(R + 30) * 2} height={(R + 30) * 2} viewBox={`${-R - 30} ${-R - 30} ${(R + 30) * 2} ${(R + 30) * 2}`}>
            <circle r={R} fill={p.white} stroke={dec.softBlue} strokeWidth={26} />
            <circle
              r={R}
              fill="none"
              stroke={p.blue}
              strokeWidth={26}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * run}
              transform="rotate(-90)"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: decFonts.display,
              fontWeight: 500,
              letterSpacing: decTracking,
              fontSize: 150,
              color: p.blue,
              opacity: 1 - Math.min(1, done * 3),
            }}
          >
            0:{String(seconds).padStart(2, "0")}
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: done }}>
            <Checkmark size={200} color={p.blue} progress={done} strokeWidth={13} />
          </div>
        </div>

        <div style={{ position: "absolute", left: 130, top: 470 }}>
          {props.steps.map((s, i) => {
            const t = pop(frame, fps, stepAt[i], springs.pop);
            const c = interpolate(frame, [stepAt[i] + 6, stepAt[i] + 16], [0, 1], clamp);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  height: 118,
                  opacity: Math.min(1, t * 2),
                  transform: `translateX(${(1 - t) * -40}px)`,
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 22,
                    background: c > 0.5 ? p.blue : p.white,
                    border: `4px solid ${p.blue}`,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Checkmark size={48} color={p.white} progress={c} strokeWidth={15} />
                </div>
                <span style={{ fontFamily: decFonts.text, fontWeight: 500, fontSize: 56, color: dec.ink }}>{s}</span>
              </div>
            );
          })}
        </div>

        <Buddy
          size={200}
          body={p.blue}
          eye={p.white}
          blink={frame > THIRTY_T.step3 ? 0.2 : 1}
          squash={0.6 + 0.4 * Math.min(1, buddyIn)}
          style={{
            position: "absolute",
            left: 790,
            top: 880 - 200 * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
      </Stage>
      <DSubline text={props.subline} color={p.blue} delay={THIRTY_T.sub} />
    </SceneBg>
  );
};
