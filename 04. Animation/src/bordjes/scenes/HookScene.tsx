import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { StatusIcon } from "../../components/StatusIcon";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { PlateOnStick, Shards } from "../components/Plate";
import type { BordjesProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  wobble: 6, // one plate starts to wobble
  fall: 38, // ... loses its balance and drops off the stick
  shatter: 50, // hits the floor and breaks
  notice: 54, // "Aanmaning" card rises from the shards
  chip: 64, // "Kan uitlopen op €40"
};

export const PLATE_XS = [138, 403, 677, 942];
export const PLATE_TIPS = [190, 130, 200, 120];
export const PLATE_RX = 120;
export const FLOOR = 610;
export const SPIN = 0.045; // turns per frame

export const HookScene: React.FC<{
  props: BordjesProps["hook"];
  plates: BordjesProps["plates"];
  fallingIndex: number;
}> = ({ props, plates, fallingIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const drop = FLOOR - 20 - PLATE_TIPS[fallingIndex];
  const fallLen = HOOK_T.shatter - HOOK_T.fall;
  const g = drop / (fallLen * fallLen);
  const dir = fallingIndex >= 2 ? 1 : -1;
  const tf = frame - HOOK_T.fall;
  const wobbleAmp = interpolate(frame, [HOOK_T.wobble, HOOK_T.fall], [0, 24], clamp);
  const s = shake(frame, HOOK_T.shatter, 14, 14);

  const notice = pop(frame, fps, HOOK_T.notice, springs.bouncy);
  const chip = pop(frame, fps, HOOK_T.chip, springs.pop);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-24} stagger={3} />

      <Stage offsetY={55}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${s.x}px, ${s.y}px)` }}>
          {/* floor line */}
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: FLOOR,
              height: 6,
              borderRadius: 3,
              background: "#dfe5f0",
            }}
          />
          {plates.map((label, i) => {
            const falling = i === fallingIndex;
            const idle = Math.sin(frame / 9 + i * 1.7) * 2.2;
            let wobble = idle;
            let plate = { x: 0, y: 0, r: 0 };
            if (falling) {
              wobble = wobbleAmp * Math.sin((frame - HOOK_T.wobble) * 0.55) + idle;
              if (tf > 0) {
                const t = Math.min(tf, fallLen);
                plate = { x: dir * 5 * t, y: g * t * t, r: dir * 7 * t };
              }
            }
            return (
              <PlateOnStick
                key={i}
                x={PLATE_XS[i]}
                tipY={PLATE_TIPS[i]}
                floorY={FLOOR}
                rx={PLATE_RX}
                label={label}
                phase={frame * SPIN * (falling && tf > 0 ? 0.4 : 1) + i * 0.27}
                wobble={tf > 0 && falling ? 0 : wobble}
                plate={plate}
                hidePlate={falling && frame >= HOOK_T.shatter}
                stickSway={falling && tf <= 0 ? wobble * 0.15 : idle * 0.2}
              />
            );
          })}
          <Shards x={PLATE_XS[fallingIndex] + dir * 5 * fallLen} y={FLOOR - 10} t={frame - HOOK_T.shatter} color="#e6ecfb" rim="#b9c6e6" />

          {/* The fallen plate comes back as a reminder letter with costs */}
          <div
            style={{
              position: "absolute",
              left: 540 - 420,
              top: 650,
              width: 840,
              height: 176,
              borderRadius: 34,
              background: p.white,
              boxShadow: "0 18px 50px rgba(1,59,255,0.16)",
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "0 36px",
              boxSizing: "border-box",
              opacity: frame >= HOOK_T.notice ? Math.min(1, notice * 2) : 0,
              transform: `translateY(${(1 - notice) * 90}px) scale(${0.7 + 0.3 * notice}) rotate(${(1 - notice) * -6}deg)`,
              borderLeft: `14px solid ${p.red}`,
            }}
          >
            <StatusIcon kind="alert" size={92} />
            <div style={{ fontFamily: fonts.ui }}>
              <div style={{ fontSize: 54, fontWeight: 700, color: p.red, lineHeight: 1.05 }}>{props.noticeTitle}</div>
              <div style={{ fontSize: 40, fontWeight: 500, color: p.ink, marginTop: 6 }}>{props.noticeLine}</div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 856,
              display: "flex",
              justifyContent: "center",
              opacity: frame >= HOOK_T.chip ? Math.min(1, chip * 2) : 0,
              transform: `scale(${0.6 + 0.4 * chip})`,
            }}
          >
            <div
              style={{
                background: p.red,
                color: p.white,
                fontFamily: fonts.ui,
                fontWeight: 700,
                fontSize: 44,
                padding: "16px 38px",
                borderRadius: 999,
              }}
            >
              {props.costChip}
            </div>
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
