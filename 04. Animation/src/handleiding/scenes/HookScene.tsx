import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import {
  Callout,
  DashLine,
  InkChip,
  INK_W,
  LineEnvelope,
  LineHouse,
  ManualFigure,
  WarningTriangle,
} from "../components/Manual";
import type { HandleidingProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  drop: 34, // part ③ comes loose and falls off the sheet
  dropLen: 22,
  missing: 42, // dashed "Onderdeel kwijt" outline where it was
  slam: 48, // reminder card slams onto the house, sheet shakes
  cost: 60, // chip "kan uitlopen op €40"
  shrug: 66, // the manual person shrugs
};

const ENV_W = 170;
const ENV_H = 112;
// Envelope top-left positions (stage coordinates) and where their assembly
// line meets the house.
const PARTS = [
  { x: 120, y: 200, to: { x: 440, y: 612 } },
  { x: 330, y: 156, to: { x: 505, y: 566 } },
  { x: 580, y: 156, to: { x: 575, y: 566 } },
  { x: 770, y: 200, to: { x: 640, y: 612 } },
];
const HOUSE = { x: 390, y: 520, w: 300, h: 290 };
const SHEET = { x: 60, y: 0, w: 960, h: 900 };

export const HookScene: React.FC<{ props: HandleidingProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const s = shake(frame, HOOK_T.slam, 16, 14);
  const float = (i: number) => Math.sin(frame / 9 + i * 1.7) * 5;

  // Part ③ falls: accelerating drop with a tumble, clipped by the sheet.
  const fall = interpolate(frame, [HOOK_T.drop, HOOK_T.drop + HOOK_T.dropLen], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const wobble = frame < HOOK_T.drop ? Math.max(0, frame - (HOOK_T.drop - 10)) / 10 : 0;
  const missing = pop(frame, fps, HOOK_T.missing, springs.pop);
  const slam = pop(frame, fps, HOOK_T.slam, { damping: 11, stiffness: 260, mass: 0.7 });
  const cost = pop(frame, fps, HOOK_T.cost, springs.bouncy);
  const shrug = interpolate(frame, [HOOK_T.shrug, HOOK_T.shrug + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const scratch = interpolate(frame, [HOOK_T.shrug - 4, HOOK_T.shrug + 4], [1, 0], clamp);
  const qBob = Math.sin(frame / 6) * 4;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-16} stagger={3} />

      <Stage offsetY={40}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r * 0.6}deg)`,
          }}
        >
          {/* The instruction sheet */}
          <div
            style={{
              position: "absolute",
              left: SHEET.x,
              top: SHEET.y,
              width: SHEET.w,
              height: SHEET.h,
              background: p.white,
              border: `${INK_W}px solid ${p.ink}`,
              borderRadius: 18,
              boxShadow: "0 18px 50px rgba(1,59,255,0.10)",
              overflow: "hidden",
            }}
          >
            {/* header strip */}
            <div
              style={{
                position: "absolute",
                left: 34,
                right: 34,
                top: 22,
                display: "flex",
                justifyContent: "space-between",
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 34,
                color: p.ink,
                letterSpacing: "-0.02em",
              }}
            >
              <span>{props.sheetTitle}</span>
              <span style={{ fontWeight: 500 }}>1/1</span>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 80, height: INK_W, background: p.ink }} />
          </div>

          {/* Assembly lines (drawn under the parts) */}
          {PARTS.map((pt, i) => (
            <div key={i} style={{ opacity: i === 2 ? 1 - Math.min(1, fall * 3) : 1 }}>
              <DashLine
                x1={pt.x + ENV_W / 2}
                y1={pt.y + ENV_H + 4}
                x2={pt.to.x}
                y2={pt.to.y}
                color={p.ink}
              />
            </div>
          ))}

          <LineHouse w={HOUSE.w} h={HOUSE.h} style={{ left: HOUSE.x, top: HOUSE.y }} />

          {/* Missing-part outline where ③ used to float */}
          <div
            style={{
              position: "absolute",
              left: PARTS[2].x - 8,
              top: PARTS[2].y - 8,
              width: ENV_W + 16,
              height: ENV_H + 16,
              borderRadius: 14,
              border: `5px dashed ${p.red}`,
              opacity: missing,
              transform: `scale(${0.8 + 0.2 * missing})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: PARTS[2].x - 20,
              width: ENV_W + 40,
              top: PARTS[2].y + ENV_H + 18,
              textAlign: "center",
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 27,
              whiteSpace: "nowrap",
              color: p.red,
              opacity: missing,
            }}
          >
            {props.missing}
          </div>

          {/* The four parts with numbered callouts */}
          {PARTS.map((pt, i) => {
            const dropping = i === 2;
            const dy = dropping ? fall * 820 : float(i);
            const rot = dropping ? fall * 50 + Math.sin(frame * 1.6) * 6 * wobble : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: pt.x,
                  top: pt.y,
                  transform: `translate(${dropping ? fall * 90 : 0}px, ${dy}px) rotate(${rot}deg)`,
                  opacity: dropping ? 1 - interpolate(fall, [0.7, 1], [0, 1], clamp) : 1,
                }}
              >
                <Callout n={i + 1} size={58} style={{ left: -4, top: -78 }} />
                <div
                  style={{
                    position: "absolute",
                    left: 66,
                    top: -70,
                    fontFamily: fonts.display,
                    fontWeight: 600,
                    fontSize: 38,
                    color: p.ink,
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {props.parts[i]}
                </div>
                <LineEnvelope w={ENV_W} h={ENV_H} />
              </div>
            );
          })}

          {/* The confused manual person */}
          <ManualFigure h={300} scratch={scratch} shrug={shrug} style={{ left: 130, top: 508 }} />
          <div
            style={{
              position: "absolute",
              left: 236,
              top: 436 + qBob,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 96,
              color: p.ink,
            }}
          >
            ?
          </div>

          {/* Reminder card slams onto the house */}
          <div
            style={{
              position: "absolute",
              left: 470,
              top: 610,
              width: 500,
              height: 158,
              borderRadius: 26,
              background: p.ink,
              display: frame >= HOOK_T.slam ? "flex" : "none",
              alignItems: "center",
              gap: 26,
              padding: "0 30px",
              boxSizing: "border-box",
              transform: `rotate(-4deg) scale(${interpolate(slam, [0, 1], [1.5, 1])})`,
              opacity: Math.min(1, slam * 2.5),
              boxShadow: "0 24px 60px rgba(17,17,20,0.35)",
            }}
          >
            <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
              <WarningTriangle size={96} color={p.red} style={{ left: 0, top: 0 }} />
            </div>
            <div style={{ fontFamily: fonts.display, color: p.white, lineHeight: 1.05 }}>
              <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.04em" }}>{props.reminder}</div>
              <div style={{ fontSize: 30, color: p.greyText, fontFamily: fonts.ui }}>{props.reminderSender}</div>
            </div>
          </div>

          <InkChip
            text={props.cost}
            size={36}
            color={p.red}
            style={{
              left: 520,
              top: 790,
              opacity: frame >= HOOK_T.cost ? Math.min(1, cost * 2) : 0,
              transform: `scale(${0.6 + 0.4 * cost})`,
              transformOrigin: "50% 50%",
            }}
          />
        </div>
      </Stage>
    </SceneBg>
  );
};
