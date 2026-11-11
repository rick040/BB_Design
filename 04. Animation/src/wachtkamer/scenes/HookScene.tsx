import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Chair, LedDisplay, NOTA_H, NOTA_W, NotaCard } from "../components/Parts";
import { type WachtkamerProps, wordAt } from "../schema";

// Absolute frames; every beat hangs on a spoken word.
export const HOOK_T = {
  tandarts: 0, // tandarts-nota zit al klaar
  fysio: wordAt("fysio"), // fysio-nota wipt op
  notas: wordAt("nota's"), // zorgverzekeraar wipt op
  wait2: wordAt("wachten"), // wachttijd 2 weken
  wait3: wordAt("wachten") + 9, // wachttijd 3 weken
  late: wordAt("aanmaning"), // tandarts-nota wordt aanmaning
  chip: wordAt("aanmaning") + 8, // chip €40
};

export const SEAT_Y = 640;
export const SEATS = [190, 540, 890];

export const HookScene: React.FC<{ props: WachtkamerProps["hook"]; notas: WachtkamerProps["notas"] }> = ({
  props,
  notas,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const hops = [HOOK_T.tandarts - 30, HOOK_T.fysio, HOOK_T.notas];
  const waitIdx = frame >= HOOK_T.wait3 ? 2 : frame >= HOOK_T.wait2 ? 1 : 0;
  const waitAt = [-30, HOOK_T.wait2, HOOK_T.wait3][waitIdx];
  const valueIn = pop(frame, fps, waitAt, springs.pop);
  const late = frame >= HOOK_T.late;
  const sh = shake(frame, HOOK_T.late, 14, 20);
  const stampIn = pop(frame, fps, HOOK_T.late, springs.pop);
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);
  // Slow sag of the waiting bills, as if they have been sitting for weeks.
  const sag = interpolate(frame, [0, HOOK_T.late], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-12} stagger={2} />
      <Stage offsetY={50}>
        <div style={{ position: "absolute", left: 540 - 330, top: 0 }}>
          <LedDisplay label={props.waitLabel} value={props.waitValues[waitIdx]} width={660} valueIn={valueIn} />
        </div>
        {SEATS.map((x, i) => (
          <Chair key={i} x={x} seatY={SEAT_Y} color={p.blueSoft} dark={p.blueMid} />
        ))}
        {notas.map((n, i) => {
          const h = pop(frame, fps, hops[i], springs.bouncy);
          const hop = Math.sin(Math.min(1, h) * Math.PI) * -40;
          const isLate = i === 0 && late;
          const s = i === 0 ? sh : { x: 0, y: 0, r: 0 };
          const tilt = (i === 1 ? 3 : i === 2 ? -2 : -3) * sag;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: SEATS[i] - NOTA_W / 2 + s.x,
                top: SEAT_Y - NOTA_H + 8 + hop + s.y,
                transform: `rotate(${tilt + s.r}deg)`,
                transformOrigin: "50% 100%",
              }}
            >
              <NotaCard
                sender={n.sender}
                subject={n.subject}
                amount={n.amount}
                due={isLate ? props.lateLabel : n.due}
                urgent={isLate}
                stamp={props.stamp}
                stampIn={isLate ? stampIn : 0}
              />
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 880,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `scale(${0.5 + 0.5 * chipIn})`,
          }}
        >
          <div
            style={{
              background: p.red,
              color: "#fff",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 46,
              padding: "20px 40px",
              borderRadius: 50,
              boxShadow: "0 20px 50px rgba(255, 90, 121, 0.35)",
            }}
          >
            {props.costChip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
