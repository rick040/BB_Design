import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { LedDisplay, NumberTag } from "../components/Parts";
import { SCENE_STARTS, type WachtkamerProps, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const AGENDA_T = {
  call1: wordAt("elke"), // display roept 1 op
  call2: wordAt("nota"), // display roept 2 op
  call3: wordAt("tijd"), // display roept 3 op
  flyLen: 14,
  reminder: wordAt("agenda"), // belletje herinnering
  subline: wordAt("agenda") + 4,
};
const CALLS = [AGENDA_T.call1, AGENDA_T.call2, AGENDA_T.call3];

const COL_W = 190;
const GAP = 12;
const X0 = (1080 - (5 * COL_W + 4 * GAP)) / 2;
const GRID_TOP = 250;
const CELL_TOP = GRID_TOP + 70;
const CELL_H = 420;
const CHIP_H = 170;
const DISPLAY = { x: 540, y: 70 };

export const AgendaScene: React.FC<{ props: WachtkamerProps["agenda"]; notas: WachtkamerProps["notas"] }> = ({
  props,
  notas,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const called = CALLS.filter((c) => frame >= c).length;
  const calledAt = called > 0 ? CALLS[called - 1] : S - 30;
  const valueIn = pop(frame, fps, calledAt, springs.pop);
  const press = Math.max(...CALLS.map((c) => interpolate(frame, [c - 4, c, c + 6], [0, 1, 0], clamp)));
  const remIn = pop(frame, fps, AGENDA_T.reminder, springs.bouncy);
  const ring = frame >= AGENDA_T.reminder ? Math.sin((frame - AGENDA_T.reminder) * 0.9) * 14 * Math.max(0, 1 - (frame - AGENDA_T.reminder) / 24) : 0;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={S - 10} stagger={2} />
      <Stage offsetY={-20}>
        <div style={{ position: "absolute", left: DISPLAY.x - 200, top: 0 }}>
          <LedDisplay label={props.nowLabel} value={called > 0 ? String(called) : "-"} width={400} height={130} valueIn={valueIn} />
        </div>
        <Buddy
          size={130}
          body={p.blueMascot}
          eye={p.white}
          blink={blinkScale(frame, [AGENDA_T.reminder + 10])}
          squash={1 - 0.18 * press}
          look={{ x: -0.7, y: 0.4 }}
          style={{ position: "absolute", left: 790, top: 130 - 130 * BUDDY_RATIO }}
        />

        {props.days.map((d, i) => {
          const x = X0 + i * (COL_W + GAP);
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: GRID_TOP,
                  width: COL_W,
                  textAlign: "center",
                  fontFamily: fonts.ui,
                  fontSize: 34,
                  fontWeight: 600,
                  color: p.blue,
                }}
              >
                {d.day} <span style={{ color: p.greyText, fontWeight: 400 }}>{d.date}</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: CELL_TOP,
                  width: COL_W,
                  height: CELL_H,
                  borderRadius: 24,
                  background: p.white,
                  border: `3px solid ${p.grey}`,
                  boxSizing: "border-box",
                }}
              />
            </React.Fragment>
          );
        })}

        {/* Reminder bell on the day you chose */}
        <div
          style={{
            position: "absolute",
            left: X0 + props.reminderIndex * (COL_W + GAP) + 10,
            top: CELL_TOP + 20,
            width: COL_W - 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            padding: "16px 0",
            borderRadius: 18,
            background: p.yellow,
            fontFamily: fonts.ui,
            fontSize: 24,
            fontWeight: 600,
            color: p.ink,
            opacity: Math.min(1, remIn * 2),
            transform: `scale(${0.5 + 0.5 * remIn}) rotate(${ring}deg)`,
          }}
        >
          <svg width={44} height={44} viewBox="0 0 40 40">
            <path d="M20 5c-6 0-10 4.5-10 10.5v7L6 28h28l-4-5.5v-7C30 9.5 26 5 20 5z" fill={p.ink} />
            <circle cx={20} cy={33} r={4} fill={p.ink} />
          </svg>
          {props.reminderLabel}
        </div>

        {/* Called bills fly from the display into their day */}
        {notas.map((n, i) => {
          const at = CALLS[i];
          const t = interpolate(frame, [at + 2, at + 2 + AGENDA_T.flyLen], [0, 1], {
            ...clamp,
            easing: Easing.inOut(Easing.cubic),
          });
          if (frame < at) return null;
          const tx = X0 + props.notaDays[i] * (COL_W + GAP) + COL_W / 2;
          const ty = CELL_TOP + CELL_H - CHIP_H / 2 - 24;
          const x = interpolate(t, [0, 1], [DISPLAY.x, tx]);
          const y = interpolate(t, [0, 1], [DISPLAY.y + 60, ty]) - Math.sin(t * Math.PI) * 140;
          const sc = interpolate(t, [0, 0.15, 1], [0.2, 1.1, 1]);
          const land = interpolate(frame, [at + 2 + AGENDA_T.flyLen, at + 5 + AGENDA_T.flyLen, at + 10 + AGENDA_T.flyLen], [1, 0.9, 1], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - (COL_W - 20) / 2,
                top: y - CHIP_H / 2,
                width: COL_W - 20,
                height: CHIP_H,
                borderRadius: 20,
                background: p.blue,
                color: p.white,
                fontFamily: fonts.ui,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transform: `scale(${sc * land}) rotate(${(1 - t) * -12}deg)`,
                boxShadow: "0 16px 36px rgba(1, 30, 120, 0.25)",
              }}
            >
              <NumberTag n={String(i + 1)} size={52} />
              <div style={{ fontSize: 26, fontWeight: 600, whiteSpace: "nowrap" }}>{n.short}</div>
              <div style={{ fontFamily: fonts.display, fontSize: 32, fontWeight: 500, color: p.blueSoft }}>{n.amount}</div>
            </div>
          );
        })}
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
