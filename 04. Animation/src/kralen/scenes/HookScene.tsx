import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Bead, useBeadColors } from "../components/Bead";
import { type KralenProps, wordAt } from "../schema";

// Absolute frames. Everything is already on screen at frame 0 (cover frame).
export const HOOK_T = {
  wobble: wordAt("betalen"), // beads jitter: which one first?
  ask: wordAt("wanneer"), // question marks pop above the beads
  chip: wordAt("wanneer") + 8,
};

const SIZE = 200;
// Loose spots on the stage (centres), deliberately out of order.
const SPOTS = [
  { x: 250, y: 150 },
  { x: 790, y: 120 },
  { x: 540, y: 400 },
  { x: 850, y: 600 },
  { x: 230, y: 640 },
];

export const HookScene: React.FC<{ props: KralenProps["hook"]; beads: KralenProps["beads"]; order: number[] }> = ({
  props,
  beads,
  order,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const colors = useBeadColors();
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-15} stagger={2} />
      <Stage>
        {order.map((bi, i) => {
          const b = beads[bi];
          const s = SPOTS[i];
          const drift = { x: 22 * Math.sin(frame / 17 + i * 1.7), y: 12 * Math.cos(frame / 21 + i) };
          const jitter = frame >= HOOK_T.wobble && frame < HOOK_T.wobble + 20 ? 6 * Math.sin((frame - HOOK_T.wobble) * 2.4 + i) : 0;
          const q = pop(frame, fps, HOOK_T.ask + i * 3, springs.pop);
          const x = s.x + drift.x + jitter;
          const y = s.y + drift.y;
          return (
            <React.Fragment key={bi}>
              <Bead
                size={SIZE}
                fill={colors[bi].fill}
                text={colors[bi].text}
                day={b.day}
                month={b.month}
                style={{
                  left: x - SIZE / 2,
                  top: y - SIZE / 2,
                  transform: `rotate(${drift.x * 0.6}deg)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x - 120,
                  width: 240,
                  top: y + SIZE / 2 + 10,
                  textAlign: "center",
                  fontFamily: fonts.ui,
                  color: p.ink,
                  lineHeight: 1.15,
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 600 }}>{b.short}</div>
                <div style={{ fontSize: 34, fontWeight: 400, color: "#5b6070" }}>{b.amount}</div>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: x + SIZE / 2 - 30,
                  top: y - SIZE / 2 - 40,
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: 84,
                  color: p.blue,
                  opacity: Math.min(1, q * 1.5),
                  transform: `scale(${q}) rotate(${12 - 24 * (i % 2)}deg)`,
                }}
              >
                ?
              </div>
            </React.Fragment>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 840,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `scale(${0.5 + 0.5 * chipIn})`,
          }}
        >
          <div
            style={{
              background: "#111827",
              color: "#fff",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 46,
              padding: "20px 44px",
              borderRadius: 50,
              boxShadow: "0 20px 50px rgba(17, 24, 39, 0.3)",
            }}
          >
            {props.chip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
