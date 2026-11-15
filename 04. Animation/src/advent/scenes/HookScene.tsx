import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Door, Star } from "../components/Door";
import { type AdventProps, wordAt } from "../schema";

// Absolute frames, hung on the spoken words.
export const HOOK_T = {
  tease: wordAt("deurtje"), // one door peeks open and shuts again
  nice: wordAt("leuk") - 4, // the nice door opens: a star
  bad: wordAt("aanmaning") - 6, // door 17 opens
  zoom: wordAt("aanmaning"), // the reminder letter flies out
  chip: wordAt("is") + 2, // "Kan uitlopen op €40"
};

const DW = 205;
const DH = 215;
const GAP = 22;
const PAD = 30;
const BW = 4 * DW + 3 * GAP + 2 * PAD;
const BH = 3 * DH + 2 * GAP + 2 * PAD;
const BX = (1080 - BW) / 2;
const BY = 40;

export const doorPos = (i: number) => ({
  x: BX + PAD + (i % 4) * (DW + GAP),
  y: BY + PAD + Math.floor(i / 4) * (DH + GAP),
});

export const HookScene: React.FC<{ props: AdventProps["hook"]; bill: AdventProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const teaseIdx = 9;
  const tease = interpolate(frame, [HOOK_T.tease, HOOK_T.tease + 5, HOOK_T.tease + 14], [0, 0.28, 0], clamp);
  const nice = pop(frame, fps, HOOK_T.nice, springs.pop);
  const starIn = pop(frame, fps, HOOK_T.nice + 5, springs.bouncy);
  const bad = interpolate(frame, [HOOK_T.bad, HOOK_T.bad + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // Letter zooms out of door 17 to the centre.
  const z = interpolate(frame, [HOOK_T.zoom, HOOK_T.zoom + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const from = doorPos(props.badIndex);
  const fx = from.x + DW / 2;
  const fy = from.y + DH / 2;
  const cx = interpolate(z, [0, 1], [fx, 540]);
  const cy = interpolate(z, [0, 1], [fy, 360]);
  const sc = interpolate(z, [0, 1], [0.2, 1.0]);
  const sh = shake(frame, HOOK_T.zoom + 12, 14, 20);
  const stampIn = pop(frame, fps, HOOK_T.zoom + 10, springs.pop);
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);
  const dim = interpolate(frame, [HOOK_T.zoom, HOOK_T.zoom + 10], [0, 0.55], clamp);
  const boardShake = shake(frame, HOOK_T.zoom + 12, 10, 8);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-14} stagger={2} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: BX + boardShake.x,
            top: BY + boardShake.y,
            width: BW,
            height: BH,
            borderRadius: 44,
            background: p.blue,
            boxShadow: "0 30px 80px rgba(1, 40, 160, 0.22)",
          }}
        />
        {props.doors.map((n, i) => {
          const pos = doorPos(i);
          const open = i === props.niceIndex ? nice : i === props.badIndex ? bad : i === teaseIdx ? tease : 0;
          return (
            <Door
              key={i}
              w={DW}
              h={DH}
              label={n}
              open={open}
              front={p.blueMid}
              frontText={p.white}
              recess="#0a1f7a"
              style={{ left: pos.x + boardShake.x, top: pos.y + boardShake.y }}
            >
              {i === props.niceIndex ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${starIn})`,
                  }}
                >
                  <Star size={130} color={p.yellow} rot={(1 - starIn) * -60 + Math.sin(frame / 6) * 6} />
                </div>
              ) : null}
              {i === props.badIndex && z <= 0 ? (
                <div
                  style={{
                    position: "absolute",
                    left: 30,
                    right: 30,
                    top: 60,
                    height: 95,
                    borderRadius: 14,
                    background: p.white,
                  }}
                />
              ) : null}
            </Door>
          );
        })}
        {/* Dim the calendar once the reminder letter is out. */}
        <div
          style={{
            position: "absolute",
            left: BX - 10,
            top: BY - 10,
            width: BW + 20,
            height: BH + 20,
            borderRadius: 50,
            background: p.light,
            opacity: dim,
          }}
        />
        {z > 0 ? (
          <div
            style={{
              position: "absolute",
              left: cx + sh.x - BILL_W / 2,
              top: cy + sh.y - BILL_H / 2,
              width: BILL_W,
              height: BILL_H,
              transform: `rotate(${(1 - z) * -12 + sh.r}deg) scale(${sc})`,
            }}
          >
            <BillCard
              sender={bill.sender}
              subject={bill.subject}
              amount={bill.amount}
              dueLabel={props.lateLabel}
              urgent
              stamp={props.stamp}
              stampIn={stampIn}
            />
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 590,
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
              boxShadow: "0 20px 50px rgba(17, 24, 39, 0.3)",
            }}
          >
            {props.costChip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
