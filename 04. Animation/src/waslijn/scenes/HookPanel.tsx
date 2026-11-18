import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { DarkBox } from "../components/Laundry";
import { type WaslijnProps, wordAt } from "../schema";

// Absolute frames. De rekening zakt op de stem de doos in, die rammelt op "rekening".
export const HOOK_T = {
  sink: 6, // rekening begint de gleuf in te zakken
  inBox: wordAt("app") + 6, // rekening is verdwenen
  rattle: wordAt("rekening"), // doos rammelt
  marks: wordAt("rekening") + 6, // vraagtekens ploppen
  chip: wordAt("rekening") + 14, // "Geen idee."
};

const BOX_W = 480;
const BOX_H = 420;
const BOX_TOP = 320;
const SLOT_Y = BOX_TOP + 24;
const BILL_SCALE = 0.74;

const MARKS = [
  { x: 210, y: 300, r: -14, s: 1.1 },
  { x: 870, y: 270, r: 12, s: 1.3 },
  { x: 890, y: 580, r: 18, s: 1 },
];

export const HookPanel: React.FC<{ props: WaslijnProps["hook"]; bill: WaslijnProps["bill"]; dark: string }> = ({
  props,
  bill,
  dark,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const sink = interpolate(frame, [HOOK_T.sink, HOOK_T.inBox], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const billCy = interpolate(sink, [0, 1], [205, SLOT_Y + (BILL_H * BILL_SCALE) / 2 + 30]);
  const sh = shake(frame, HOOK_T.rattle, 18, 16);
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);

  return (
    <>
      <Headline text={props.headline} color={p.blue} delay={-25} stagger={2} />
      <Stage offsetY={20}>
        {/* Rekening, geknipt op de gleuf zodat hij de doos in zakt. */}
        <div style={{ position: "absolute", left: 0, top: -300, width: 1080, height: SLOT_Y + 300, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 540 - BILL_W / 2,
              top: 300 + billCy - BILL_H / 2,
              width: BILL_W,
              height: BILL_H,
              transform: `scale(${BILL_SCALE}) rotate(${-3 * (1 - sink)}deg)`,
            }}
          >
            <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 540 - BOX_W / 2 + sh.x,
            top: BOX_TOP + sh.y,
            transform: `rotate(${sh.r * 2}deg)`,
          }}
        >
          <DarkBox label={props.boxLabel} w={BOX_W} h={BOX_H} color={dark} />
        </div>
        {MARKS.map((m, i) => {
          const s = pop(frame, fps, HOOK_T.marks + i * 4, springs.bouncy);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: m.x - 50,
                top: m.y - 70,
                width: 100,
                textAlign: "center",
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: 130 * m.s,
                color: dark,
                opacity: Math.min(1, s * 1.5),
                transform: `scale(${s}) rotate(${m.r}deg)`,
              }}
            >
              ?
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BOX_TOP + BOX_H + 50,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `scale(${0.6 + 0.4 * chipIn})`,
          }}
        >
          <div
            style={{
              padding: "18px 40px",
              borderRadius: 999,
              background: dark,
              color: "#fff",
              fontFamily: fonts.display,
              fontSize: 46,
              fontWeight: 500,
            }}
          >
            {props.chip}
          </div>
        </div>
      </Stage>
    </>
  );
};
