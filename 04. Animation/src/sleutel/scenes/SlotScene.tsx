import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { SlotPlate, SpokenHeadline } from "../components/Props";
import { SCENE_STARTS, type SleutelProps, wordAt, wordStartsFrom } from "../schema";

const S = SCENE_STARTS[2];
// Absolute frames on the spoken words.
export const SLOT_T = {
  billIn: S - 2, // the one bill hovers above the letterbox
  drop: wordAt("rekening"), // bill slides into the slot
  dropLen: 18,
  eyes: wordAt("dus"), // Buddy peeks through the slot
  subline: wordAt("dus"),
  fields: wordAt("meer"), // the four fields Buddy reads pop in
  fieldStagger: 5,
};

const SLOT_CY = 400;
const BILL_SCALE = 0.8;

export const SlotScene: React.FC<{ props: SleutelProps["slot"]; bill: SleutelProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const billIn = pop(frame, fps, SLOT_T.billIn, springs.pop);
  const d = interpolate(frame, [SLOT_T.drop, SLOT_T.drop + SLOT_T.dropLen], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const billTop = 40 + d * 400;
  const wiggle = frame < SLOT_T.drop ? Math.sin(frame / 5) * 2 : 0;
  const eyes = pop(frame, fps, SLOT_T.eyes, springs.bouncy);
  const look = frame < SLOT_T.fields ? 0 : Math.sin((frame - SLOT_T.fields) / 6) * 0.5;
  const flap = interpolate(
    frame,
    [SLOT_T.drop + 4, SLOT_T.drop + SLOT_T.dropLen, SLOT_T.drop + SLOT_T.dropLen + 8],
    [0, 1, 0],
    clamp,
  );
  const headlineAt = wordStartsFrom(S, 7);

  return (
    <SceneBg color={p.light}>
      <SpokenHeadline text={props.headline} at={headlineAt} color={p.blue} sizeFactor={0.92} />
      <Stage offsetY={50}>
        {/* bill, clipped at the slot so it disappears into it */}
        <div style={{ position: "absolute", left: 0, right: 0, top: -600, height: 600 + SLOT_CY, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 540 - (BILL_W * BILL_SCALE) / 2,
              top: 600 + billTop,
              width: BILL_W,
              height: BILL_H,
              transform: `scale(${BILL_SCALE * (0.6 + 0.4 * billIn)}) rotate(${wiggle}deg)`,
              transformOrigin: "0 0",
              opacity: Math.min(1, billIn * 2),
            }}
          >
            <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${flap * 6}px)` }}>
          <SlotPlate
            cx={540}
            cy={SLOT_CY}
            w={860}
            plate={p.blue}
            slot="#0a1f7a"
            label={props.slotLabel}
            labelColor={p.white}
            eyes={eyes}
            look={look}
            blink={blinkScale(frame, [SLOT_T.fields + 14])}
          />
        </div>
        {props.fields.map((f, i) => {
          const s = pop(frame, fps, SLOT_T.fields + i * SLOT_T.fieldStagger, springs.pop);
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: col === 0 ? 70 : 560,
                top: 570 + row * 130,
                width: 450,
                height: 104,
                borderRadius: 52,
                background: p.white,
                boxShadow: "0 14px 40px rgba(0, 20, 120, 0.12)",
                display: "flex",
                alignItems: "center",
                gap: 18,
                paddingLeft: 26,
                boxSizing: "border-box",
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 42,
                color: p.blue,
                opacity: Math.min(1, s * 2),
                transform: `translateY(${(1 - s) * -40}px) scale(${0.85 + 0.15 * s})`,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: p.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Checkmark size={34} color={p.white} progress={Math.min(1, s)} strokeWidth={14} />
              </div>
              {f}
            </div>
          );
        })}
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={SLOT_T.subline} />
    </SceneBg>
  );
};
