import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { Arrow } from "../../../components/CtaPill";
import { SceneBg, Stage } from "../../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { fonts } from "../../../theme";
import { DHeadline, DSubline } from "../../text";
import { decFonts } from "../../theme";
import { CAL, CAL_H, CalendarCard } from "../CalendarCard";
import { Flag } from "../Parcel";
import type { PakketjesProps } from "../schema";

// Beats (frames, scene-lokaal).
export const FWD_T = {
  mail: 6, // betaalmail komt binnen
  press: 30, // Doorsturen ingedrukt
  fly: 34, // mail vliegt naar Buddy
  flyLen: 18,
  gulp: 52, // Buddy slikt de mail
  flags: 58, // vlaggetjes verschijnen op de kalender
  flagStagger: 4, // per pakketje (7 dagen en 2 dagen vooraf komen kort na elkaar)
  legend: 60,
  subline: 100,
};

const MAIL = { x: 110, y: 6, w: 860, h: 96 };
const BUDDY = 165;
const BUDDY_FEET = 896;
const BUDDY_X = 905; // midden

export const FORWARD_FLAG_END = FWD_T.flags + 8 * FWD_T.flagStagger + 6 + 14;

export const ForwardScene: React.FC<{ props: PakketjesProps["forward"]; cal: PakketjesProps["spread"] }> = ({
  props,
  cal,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const mailIn = pop(frame, fps, FWD_T.mail, springs.smooth);
  const press = interpolate(frame, [FWD_T.press, FWD_T.press + 3, FWD_T.press + 8], [1, 0.86, 1], clamp);
  const ripple = interpolate(frame, [FWD_T.press + 1, FWD_T.press + 14], [0, 1], clamp);
  const fly = interpolate(frame, [FWD_T.fly, FWD_T.fly + FWD_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const mcx = MAIL.x + MAIL.w / 2;
  const mcy = MAIL.y + MAIL.h / 2;
  const bcx = BUDDY_X;
  const bcy = BUDDY_FEET - (BUDDY * BUDDY_RATIO) / 2;
  const fx = interpolate(fly, [0, 1], [mcx, bcx]);
  const fy = interpolate(fly, [0, 1], [mcy, bcy]);
  const fScale = interpolate(fly, [0, 1], [1, 0.08]);
  const fRot = interpolate(fly, [0, 1], [0, 24]);
  const fOpacity = interpolate(fly, [0.88, 1], [1, 0], clamp);

  const buddyIn = pop(frame, fps, 14, springs.bouncy);
  const gulp = interpolate(frame, [FWD_T.gulp - 2, FWD_T.gulp + 2, FWD_T.gulp + 7, FWD_T.gulp + 12], [1, 0.8, 1.12, 1], clamp);
  const idle = frame > FWD_T.gulp + 14 ? Math.sin((frame - FWD_T.gulp) / 8) * 4 : 0;
  const blink = blinkScale(frame, [FWD_T.gulp - 1, FWD_T.flags + 40]);
  const look = {
    x: interpolate(fly, [0, 1], [-0.2, -0.5]),
    y: frame < FWD_T.gulp ? -0.6 : -0.9,
  };

  const payIndex = (d: number) => cal.payDays.indexOf(d);
  const flagStart = (d: number, kind: 7 | 2) => FWD_T.flags + payIndex(d) * FWD_T.flagStagger + (kind === 7 ? 0 : 2);
  const legendIn = pop(frame, fps, FWD_T.legend, springs.pop);

  return (
    <SceneBg color={p.light}>
      <DHeadline text={props.headline} color={p.blue} delay={2} stagger={3} />

      <Stage offsetY={12}>
        <CalendarCard
          monthLabel={cal.monthLabel}
          weekdays={cal.weekdays}
          startCol={cal.startCol}
          days={cal.days}
          payDays={cal.payDays}
          parcelOn={() => 1}
          flagOn={(d, kind) => (frame < flagStart(d, kind) ? 0 : pop(frame, fps, flagStart(d, kind), springs.bouncy))}
          flag7={p.blue}
          flag2={p.ink}
          accent={p.blue}
          numberColor={p.blue}
          cellColor={p.light}
          style={{ top: CAL.y + 0 }}
        />

        {/* Legenda */}
        <div
          style={{
            position: "absolute",
            left: CAL.x,
            top: CAL.y + CAL_H + 22,
            display: "flex",
            gap: 18,
            transform: `scale(${legendIn})`,
            transformOrigin: "0% 50%",
            opacity: legendIn,
          }}
        >
          {[
            { c: p.blue, t: props.legend7 },
            { c: p.ink, t: props.legend2 },
          ].map((l, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px 10px 14px",
                borderRadius: 999,
                background: p.white,
                fontFamily: decFonts.text,
                fontWeight: 600,
                fontSize: 30,
                color: p.ink,
                boxShadow: "0 10px 30px rgba(1, 30, 140, 0.12)",
              }}
            >
              <Flag size={36} color={l.c} />
              {l.t}
            </div>
          ))}
        </div>

        {/* Buddy vangt de doorgestuurde mail */}
        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={blink}
          squash={gulp}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + idle,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* Betaalmail met Doorsturen-knop */}
        <div
          style={{
            position: "absolute",
            left: fx - MAIL.w / 2,
            top: fy - MAIL.h / 2,
            width: MAIL.w,
            height: MAIL.h,
            borderRadius: 40,
            background: p.white,
            boxShadow: "0 24px 60px rgba(1, 30, 140, 0.28)",
            padding: "0 26px 0 24px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: 22,
            fontFamily: fonts.ui,
            opacity: mailIn * fOpacity,
            transform: `translateY(${(1 - mailIn) * -60}px) scale(${fScale}) rotate(${fRot}deg)`,
            zIndex: 8,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: p.grey,
              color: p.blueMid,
              fontWeight: 600,
              fontSize: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {props.sender[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 30, fontWeight: 600, color: p.ink }}>{props.sender}</div>
            <div style={{ fontSize: 24, color: p.greyText, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {props.subject}
            </div>
          </div>
          <div style={{ position: "relative", transform: `scale(${press})` }}>
            <div
              style={{
                height: 58,
                borderRadius: 29,
                background: p.blue,
                color: p.white,
                padding: "0 24px 0 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 26,
                fontWeight: 500,
              }}
            >
              <Arrow size={26} />
              {props.button}
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 130,
                height: 130,
                marginLeft: -65,
                marginTop: -65,
                borderRadius: "50%",
                border: `4px solid ${p.blue}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0,
                transform: `scale(${0.3 + ripple * 1.2})`,
              }}
            />
          </div>
        </div>
      </Stage>

      <DSubline text={props.subline} color={p.blue} delay={FWD_T.subline} />
    </SceneBg>
  );
};
