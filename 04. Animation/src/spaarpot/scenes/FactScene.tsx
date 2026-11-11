import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RollingNumber } from "../../components/RollingNumber";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Coin, Piggy, PIGGY_H, PIGGY_W, SLOT } from "../components/Piggy";
import { SCENE_STARTS, type SpaarpotProps, wordAt } from "../schema";

// Fact: "Zonde? Een aanmaning kan uitlopen op veertig euro."
const S = SCENE_STARTS[1];
export const FACT_T = {
  stamp: wordAt("aanmaning"),
  pourStart: wordAt("aanmaning") + 8,
  forty: wordAt("veertig"),
  note: wordAt("kan"),
};

const PX = 540 - PIGGY_W / 2;
const PY = 380;
const COINS = 9;

export const FactScene: React.FC<{ props: SpaarpotProps["fact"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const stampIn = pop(frame, fps, FACT_T.stamp, springs.pop);
  const sh = shake(frame, FACT_T.stamp, 14, 16);
  // Piggy tips upside down so the coins fall out of the slot.
  const tip = interpolate(frame, [FACT_T.stamp + 2, FACT_T.pourStart + 4], [0, 180], clamp);
  const counterIn = pop(frame, fps, FACT_T.pourStart - 4, springs.smooth);
  const roll = interpolate(frame, [FACT_T.pourStart, FACT_T.forty + 6], [0, 1], clamp);
  const landed = frame >= FACT_T.forty + 6;
  const bump = pop(frame, fps, FACT_T.forty + 6, springs.bouncy);

  // Slot position once the piggy is flipped (rotation around piggy centre).
  const cx = PX + PIGGY_W / 2;
  const cy = PY + PIGGY_H / 2;
  const slotX = cx - (SLOT.x - PIGGY_W / 2);
  const slotY = cy + (PIGGY_H / 2 - SLOT.y) - 10;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.red} delay={S - 3} sizeFactor={1.5} />
      <Stage>
        {/* counter */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, opacity: counterIn }}>
          <RollingNumber
            values={props.counter}
            progress={roll}
            size={200}
            color={landed ? p.red : p.blue}
            blur={roll > 0 && roll < 1 ? 4 : 0}
            style={{ transform: `scale(${landed ? 1 + 0.12 * (1 - bump) : 1})` }}
          />
        </div>
        {/* coins pour out of the slot */}
        {Array.from({ length: COINS }).map((_, i) => {
          const t0 = FACT_T.pourStart + i * ((FACT_T.forty - FACT_T.pourStart) / COINS);
          const t = frame - t0;
          if (t < 0) return null;
          const x = slotX + (i % 2 ? 1 : -1) * (20 + i * 9) * Math.min(1, t / 14);
          const y = slotY + 0.9 * t * t + 6 * t;
          if (y > 880) return null;
          const fade = Math.min(1, Math.max(0, (880 - y) / 120));
          return (
            <div key={i} style={{ position: "absolute", left: x - 45, top: y - 45, opacity: fade }}>
              <Coin size={90} color={p.yellow} edge="#e0a800" spin={t / 3 + i} />
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: PX + sh.x,
            top: PY + sh.y,
            width: PIGGY_W,
            height: PIGGY_H,
            transform: `rotate(${tip + sh.r}deg)`,
          }}
        >
          <Piggy body={p.blueMid} shade={p.blue} slot={p.ink} />
        </div>
        {/* stamp */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: PY + 100,
            display: "flex",
            justifyContent: "center",
            opacity: stampIn > 0.01 ? 1 : 0,
            transform: `rotate(-8deg) scale(${2.2 - 1.2 * stampIn})`,
          }}
        >
          <div
            style={{
              border: `8px solid ${p.red}`,
              borderRadius: 18,
              padding: "6px 26px",
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 70,
              letterSpacing: "0.02em",
              color: p.red,
              background: "rgba(255,255,255,0.9)",
            }}
          >
            {props.stamp}
          </div>
        </div>
      </Stage>
      <Subline text={props.note} color={p.blue} delay={FACT_T.note} />
    </SceneBg>
  );
};
