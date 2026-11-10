import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { RIM_CX, RIM_CY, SIEVE_H, SIEVE_W, SieveBack, SieveFront } from "../components/Sieve";
import { Chip } from "../components/Slip";
import type { ZeefProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  push: 12, // Buddy pushes the handle up: the sieve tips over
  pour: 20, // the two chips fall out
  land: 34, // they land in the due date cell, cell turns blue
  remind: 54, // reminder badge pops on the day you chose
  subline: 66,
  happy: 70, // Buddy squeezes his eyes shut (happy)
};

const CARD = { x: 50, y: 330, w: 980, h: 400 };
const COL = CARD.w / 7;
const SIEVE_SCALE = 0.5;
const BUDDY = 150;

const Clock: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
    <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="3" />
    <path d="M16 9v7.5l5 3" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const AgendaScene: React.FC<{ props: ZeefProps["agenda"]; bill: ZeefProps["bill"]; keepDue: string }> = ({
  props,
  bill,
  keepDue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, -4, springs.smooth);
  const dueX = CARD.x + COL * (props.dueIndex + 0.5);
  const remX = CARD.x + COL * (props.remindIndex + 0.5);

  // Sieve hangs above the due date; Buddy, to its right, lifts the handle.
  const sw = SIEVE_W * SIEVE_SCALE;
  const sieveLeft = dueX - RIM_CX * SIEVE_SCALE;
  const sieveTop = 90;
  const tip = interpolate(frame, [AGENDA_T.push, AGENDA_T.pour + 4], [0, -30], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const back = interpolate(frame, [AGENDA_T.land + 6, AGENDA_T.land + 18], [1, 0], clamp);
  const sieveRot = tip * back;

  const buddyFeet = sieveTop + (RIM_CY + 20) * SIEVE_SCALE + BUDDY * BUDDY_RATIO * 0.55;
  const buddyX = sieveLeft + sw + 30;
  const push = interpolate(frame, [AGENDA_T.push - 4, AGENDA_T.push, AGENDA_T.push + 8], [0, 1, 1], clamp) * back;
  const squash = interpolate(frame, [AGENDA_T.push - 4, AGENDA_T.push, AGENDA_T.push + 6], [1, 0.85, 1.12], clamp);
  const happy = interpolate(frame, [AGENDA_T.happy, AGENDA_T.happy + 4], [1, 0.18], clamp);
  const blink = Math.min(blinkScale(frame, [40]), happy);
  const buddyIn = pop(frame, fps, -2, springs.bouncy);

  // Chips fall from the rim into the cell.
  const fall = interpolate(frame, [AGENDA_T.pour, AGENDA_T.land], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const startY = sieveTop + RIM_CY * SIEVE_SCALE + 10;
  const endY = CARD.y + 150;
  const land = pop(frame, fps, AGENDA_T.land, springs.bouncy);
  const remind = pop(frame, fps, AGENDA_T.remind, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={2} stagger={3} />

      <Stage offsetY={50}>
        {/* Week card */}
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 44,
            background: p.white,
            boxShadow: "0 30px 80px rgba(1, 40, 160, 0.14)",
            fontFamily: fonts.ui,
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 30}px)`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 36, top: 26, fontSize: 36, fontWeight: 600, color: p.ink }}>{props.month}</div>
          {props.days.map((d, i) => {
            const isDue = i === props.dueIndex;
            const isRem = i === props.remindIndex;
            const fill = isDue ? land : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: COL * i + 8,
                  top: 96,
                  width: COL - 16,
                  height: CARD.h - 116,
                  borderRadius: 26,
                  background: isDue && frame >= AGENDA_T.land ? p.blue : isRem && frame >= AGENDA_T.remind ? `${p.blueSoft}55` : "transparent",
                  transform: isDue ? `scale(${1 + 0.06 * Math.sin(Math.min(1, fill) * Math.PI)})` : undefined,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 30, color: isDue && frame >= AGENDA_T.land ? p.blueSoft : p.greyText, marginTop: 14 }}>{d}</div>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 500,
                    fontSize: 66,
                    letterSpacing: "-0.04em",
                    color: isDue && frame >= AGENDA_T.land ? p.white : p.ink,
                    marginTop: 2,
                  }}
                >
                  {props.dates[i]}
                </div>
                {isDue && frame >= AGENDA_T.land ? (
                  <div style={{ marginTop: 10, opacity: Math.min(1, land * 2), transform: `scale(${land})` }}>
                    <div style={{ fontSize: 24, fontWeight: 600, color: p.white }}>{props.dueLabel}</div>
                    <div style={{ fontSize: 24, color: p.blueSoft }}>{bill.amount}</div>
                  </div>
                ) : null}
                {isRem && frame >= AGENDA_T.remind ? (
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "center", transform: `scale(${remind})` }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        background: p.blue,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Clock color={p.white} size={34} />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Reminder label under the card */}
        {frame >= AGENDA_T.remind ? (
          <Chip
            text={props.remindLabel}
            bg={p.blue}
            fg={p.white}
            size={34}
            style={{
              left: Math.max(40, remX - 120),
              top: CARD.y + CARD.h + 26,
              transform: `scale(${remind})`,
              transformOrigin: "30% 0%",
              opacity: Math.min(1, remind * 2),
            }}
          />
        ) : null}

        {/* Falling chips */}
        {frame >= AGENDA_T.pour && frame < AGENDA_T.land + 2 ? (
          <>
            <Chip
              text={bill.amount}
              bg={p.blue}
              fg={p.white}
              size={34}
              style={{ left: dueX - 150, top: startY + (endY - startY) * fall, transform: `rotate(${-10 + fall * 30}deg) scale(${1 - fall * 0.4})` }}
            />
            <Chip
              text={keepDue}
              bg={p.blue}
              fg={p.white}
              size={34}
              style={{ left: dueX - 60, top: startY - 40 + (endY - startY + 40) * fall, transform: `rotate(${8 - fall * 24}deg) scale(${1 - fall * 0.4})` }}
            />
          </>
        ) : null}

        {/* Sieve, tipping */}
        <div
          style={{
            position: "absolute",
            left: dueX - RIM_CX,
            top: sieveTop + RIM_CY * SIEVE_SCALE - RIM_CY,
            width: SIEVE_W,
            height: SIEVE_H,
            transform: `rotate(${sieveRot}deg) scale(${SIEVE_SCALE})`,
            transformOrigin: `${RIM_CX}px ${RIM_CY}px`,
            opacity: cardIn,
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(0deg)` }}>
            <SieveBack inner={p.grey} />
            <SieveFront mesh={p.blueSoft} rim={p.blue} />
          </div>
        </div>

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={squash * (0.6 + 0.4 * buddyIn)}
          look={frame < AGENDA_T.land ? { x: -0.8, y: 0.4 } : { x: -0.3, y: 0.8 }}
          style={{
            position: "absolute",
            left: buddyX - BUDDY / 2,
            top: buddyFeet - BUDDY * BUDDY_RATIO - push * 30,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
