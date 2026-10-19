import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { SceneBg, Stage } from "../../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { AddressChip } from "../../d02-advent/components/Cards";
import { DHeadline, DSubline } from "../../text";
import { dec, decFonts, decTracking } from "../../theme";
import { Envelope, FRIEND_BODY } from "../components/Props";
import type { VriendProps } from "../schema";
import { PILE } from "./HookScene";

// Timeline (frames, scene-local).
export const FWD_T = {
  chip: 8, // het Buddy-adres veert op
  fly: 18, // de eerste envelop vliegt erin
  flyStagger: 5, // duur: tussen twee enveloppen
  flyLen: 16, // duur van een vlucht
  card: 66, // de agenda klapt open onder het adres
  row: 68, // eerste agenda-item
  rowStagger: 14, // duur: tussen twee agenda-items
  toast: 118, // de Buddies kijken tevreden
  sub: 96,
};

const SIZE = 250;
const H = SIZE * BUDDY_RATIO;
const FEET = 800;
const CHIP = { x: 540, y: 56 };
const CARD = { x: 90, y: 150, w: 900, h: 390 };
const ROW_H = 108;

export const ForwardScene: React.FC<{ props: VriendProps["forward"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const chipIn = pop(frame, fps, FWD_T.chip - 6, springs.pop);
  const cardIn = pop(frame, fps, FWD_T.card, springs.pop);
  const chipPulse = (() => {
    let pulse = 0;
    PILE.forEach((_, i) => {
      const at = FWD_T.fly + i * FWD_T.flyStagger + FWD_T.flyLen;
      pulse = Math.max(pulse, interpolate(frame, [at, at + 3, at + 8], [0, 1, 0], clamp));
    });
    return pulse;
  })();

  const happy = interpolate(frame, [FWD_T.toast, FWD_T.toast + 6, FWD_T.toast + 12], [1, 1.08, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <DHeadline text={props.headline} color={p.blue} delay={-8} stagger={3} sizeFactor={0.76} />
      <Stage offsetY={40}>
        {/* Het eigen Buddy-adres */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: CHIP.y - 46,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `scale(${0.8 + 0.2 * chipIn})`,
          }}
        >
          <AddressChip text={props.addressChip} pulse={chipPulse} />
        </div>

        {/* Agenda onder het adres */}
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 48,
            background: dec.white,
            boxShadow: "0 28px 80px rgba(1, 40, 160, 0.16)",
            opacity: Math.min(1, cardIn * 2),
            transform: `translateY(${(1 - cardIn) * -40}px) scale(${0.9 + 0.1 * cardIn})`,
            transformOrigin: "50% 0%",
          }}
        >
          {props.rows.map((r, i) => {
            const t = pop(frame, fps, FWD_T.row + i * FWD_T.rowStagger, springs.pop);
            const f1 = pop(frame, fps, FWD_T.row + i * FWD_T.rowStagger + 8, springs.bouncy);
            const f2 = pop(frame, fps, FWD_T.row + i * FWD_T.rowStagger + 13, springs.bouncy);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 36,
                  right: 36,
                  top: 28 + i * (ROW_H + 8),
                  height: ROW_H,
                  borderRadius: 30,
                  background: dec.ice,
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "0 24px 0 16px",
                  boxSizing: "border-box",
                  opacity: Math.min(1, t * 2),
                  transform: `translateX(${(1 - t) * -60}px)`,
                  fontFamily: decFonts.ui,
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 22,
                    background: dec.blue,
                    color: dec.white,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  <span style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 40, letterSpacing: decTracking }}>{r.day}</span>
                  <span style={{ fontSize: 17, fontWeight: 600, textTransform: "uppercase", color: dec.softBlue }}>{r.month}</span>
                </div>
                <div style={{ flex: 1, fontSize: 38, fontWeight: 600, color: dec.ink }}>{r.title}</div>
                <div style={{ display: "flex", gap: 14 }}>
                  {[
                    { label: props.flagFar, a: f1 },
                    { label: props.flagNear, a: f2 },
                  ].map((f, k) => (
                    <div
                      key={k}
                      style={{
                        width: 66,
                        height: 66,
                        borderRadius: 33,
                        background: dec.blue,
                        color: dec.white,
                        fontFamily: decFonts.display,
                        fontWeight: 500,
                        fontSize: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `scale(${f.a})`,
                      }}
                    >
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Buddies onderaan; rechts de berg die kleiner wordt */}
        <Buddy
          size={SIZE}
          body={p.blue}
          eye={dec.white}
          squash={happy}
          blink={blinkScale(frame, [40, 100])}
          look={{ x: 0.5, y: -0.4 }}
          style={{ position: "absolute", left: 100, top: FEET - H }}
        />
        <Buddy
          size={SIZE}
          body={FRIEND_BODY}
          eye={p.blueMascot}
          squash={happy}
          blink={blinkScale(frame, [52, 108])}
          look={{ x: -0.4, y: -0.5 }}
          style={{ position: "absolute", left: 730, top: FEET - H }}
        />
        {PILE.map((e, i) => {
          const start = FWD_T.fly + i * FWD_T.flyStagger;
          const t = interpolate(frame, [start, start + FWD_T.flyLen], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
          if (t >= 1) return null;
          // De pile staat rond (780, 560) in de hook; hier iets lager en kleiner rond de rechter Buddy.
          const sx = 855 + (e.x - 780) * 0.62;
          const sy = 745 + (e.y - 560) * 0.5;
          const x = interpolate(t, [0, 1], [sx, CHIP.x]);
          const y = interpolate(t, [0, 1], [sy, CHIP.y]) - Math.sin(Math.PI * t) * 120;
          return (
            <Envelope
              key={i}
              width={130}
              style={{
                position: "absolute",
                left: x - 65,
                top: y - 45,
                transform: `rotate(${e.r * (1 - t)}deg) scale(${1 - 0.7 * t})`,
                zIndex: 30,
              }}
            />
          );
        })}
      </Stage>
      <DSubline text={props.subline} color={p.blue} delay={FWD_T.sub} />
    </SceneBg>
  );
};
