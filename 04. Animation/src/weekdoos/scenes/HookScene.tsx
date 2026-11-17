import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, shake } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { NOTA_H, NOTA_W, NotaCard } from "../components/NotaCard";
import { type WeekdoosProps, wordAt } from "../schema";

// The myth is struck through on "vanzelf"; meanwhile the slips fade like a memory.
export const HOOK_T = {
  fadeFrom: 14,
  strike: wordAt("vanzelf"),
  strikeLen: 7,
};

/** Centre y (px, full frame) of headline line i. */
export const headlineLineY = (safeTop: number, size: number, i: number) => safeTop + size * (i + 0.5);

const FAN = [
  { x: -250, y: 20, r: -11 },
  { x: 0, y: -20, r: 2 },
  { x: 250, y: 30, r: 12 },
];

export const HookScene: React.FC<{ props: WeekdoosProps["hook"]; notas: WeekdoosProps["notas"] }> = ({
  props,
  notas,
}) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const L = useLayout();
  const fade = interpolate(frame, [HOOK_T.fadeFrom, HOOK_T.strike], [0, 1], clamp);
  const sh = shake(frame, HOOK_T.strike + 2, 12, 16);
  const widths = [830, 860];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-12} stagger={2} />
      {widths.map((w, i) => {
        const s = interpolate(frame, [HOOK_T.strike + i * 4, HOOK_T.strike + i * 4 + HOOK_T.strikeLen], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (L.width - w) / 2,
              top: headlineLineY(L.safeTop, L.headlineSize, i) + 8,
              width: w * s,
              height: 14,
              borderRadius: 7,
              background: p.red,
              transform: `rotate(${i ? 1.2 : -1.2}deg)`,
            }}
          />
        );
      })}
      <Stage>
        {notas.map((n, i) => {
          const f = FAN[i];
          const drift = fade * (i - 1) * 40;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 540 + f.x + drift + sh.x - NOTA_W / 2,
                top: 430 + f.y + fade * (i === 1 ? 50 : 20) + sh.y - NOTA_H / 2,
                transform: `rotate(${f.r * (1 + fade * 0.6) + sh.r}deg)`,
                opacity: 1 - 0.6 * fade,
                filter: `blur(${fade * 12}px)`,
                zIndex: i === 1 ? 2 : 1,
              }}
            >
              <NotaCard sender={n.sender} amount={n.amount} due={n.due} />
            </div>
          );
        })}
      </Stage>
    </SceneBg>
  );
};
