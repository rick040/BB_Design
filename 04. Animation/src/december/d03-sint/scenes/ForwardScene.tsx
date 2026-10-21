import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { Arrow } from "../../../components/CtaPill";
import { SceneBg, Stage } from "../../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { fonts } from "../../../theme";
import { DHeadline, DSubline } from "../../text";
import { Flag } from "../../d01-pakketjes/Parcel";
import { decFonts, decTracking } from "../../theme";
import { Phone } from "../Phone";
import type { SintProps } from "../schema";

// Beats (frames, scene-lokaal).
export const FWD_T = {
  phone: 2,
  press: 26, // Doorsturen ingedrukt
  fly: 30, // mail vliegt naar Buddy
  flyLen: 16,
  gulp: 48, // Buddy slikt
  switch: 54, // scherm wisselt naar de agenda
  rows: 62, // eerste agenda-regel
  rowStagger: 12,
  subline: 104,
};

const PHONE = { x: 100, y: 50 };
const BUDDY = 210;
const BUDDY_FEET = 840;
const BUDDY_X = 905;

const Tick: React.FC<{ progress: number; color: string }> = ({ progress, color }) => (
  <svg width={40} height={40} viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
    <circle cx={22} cy={22} r={18} fill={color} opacity={Math.min(1, progress * 1.4)} />
    <path
      d="M13 23 L19.5 29 L31 15"
      fill="none"
      stroke="#fff"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
    />
  </svg>
);

export const ForwardScene: React.FC<{ props: SintProps["forward"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const phone = pop(frame, fps, FWD_T.phone, springs.smooth);
  const press = interpolate(frame, [FWD_T.press, FWD_T.press + 3, FWD_T.press + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [FWD_T.press + 1, FWD_T.press + 14], [0, 1], clamp);
  const sw = interpolate(frame, [FWD_T.switch, FWD_T.switch + 8], [0, 1], clamp);

  // Mailkaartje vliegt van de knop naar Buddy
  const fly = interpolate(frame, [FWD_T.fly, FWD_T.fly + FWD_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const from = { x: PHONE.x + 280, y: PHONE.y + 700 };
  const to = { x: BUDDY_X, y: BUDDY_FEET - (BUDDY * BUDDY_RATIO) / 2 };
  const fx = interpolate(fly, [0, 1], [from.x, to.x]);
  const fy = interpolate(fly, [0, 1], [from.y, to.y]) - Math.sin(fly * Math.PI) * 120;
  const fScale = interpolate(fly, [0, 1], [1, 0.12]);
  const fOpacity = frame >= FWD_T.fly ? interpolate(fly, [0.9, 1], [1, 0], clamp) : 0;

  const buddyIn = pop(frame, fps, 12, springs.bouncy);
  const gulp = interpolate(frame, [FWD_T.gulp - 2, FWD_T.gulp + 2, FWD_T.gulp + 7, FWD_T.gulp + 12], [1, 0.8, 1.12, 1], clamp);
  const idle = frame > FWD_T.gulp + 14 ? Math.sin((frame - FWD_T.gulp) / 8) * 4 : 0;
  const blink = blinkScale(frame, [FWD_T.gulp - 1, FWD_T.rows + 30]);
  const look = { x: interpolate(frame, [0, FWD_T.gulp], [-0.7, -0.4], clamp), y: -0.3 };

  return (
    <SceneBg color={p.light}>
      <DHeadline text={props.headline} color={p.blue} delay={2} stagger={3} />

      <Stage offsetY={20}>
        <Phone
          bezel={p.ink}
          screen={p.white}
          style={{ left: PHONE.x, top: PHONE.y, opacity: phone, transform: `translateY(${(1 - phone) * 70}px)` }}
        >
          {/* Open mail */}
          <div style={{ position: "absolute", inset: 0, opacity: 1 - sw, transform: `translateX(${-sw * 60}px)`, fontFamily: fonts.ui }}>
            <div style={{ position: "absolute", left: 28, right: 28, top: 84, display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: p.grey,
                  color: p.blueMid,
                  fontWeight: 600,
                  fontSize: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {props.mailFrom[0]}
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 600, color: p.ink }}>{props.mailFrom}</div>
                <div style={{ fontSize: 24, color: p.greyText }}>{props.mailSubject}</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 28, right: 28, top: 214, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ height: 18, borderRadius: 9, background: p.grey, width: "88%" }} />
              <div style={{ height: 18, borderRadius: 9, background: p.grey, width: "64%" }} />
              <div style={{ fontSize: 30, fontWeight: 600, color: p.ink, marginTop: 14 }}>{props.mailLine1}</div>
              <div style={{ fontSize: 26, color: p.blue, textDecoration: "underline" }}>{props.mailLine2}</div>
              <div style={{ height: 18, borderRadius: 9, background: p.grey, width: "78%", marginTop: 10 }} />
              <div style={{ height: 18, borderRadius: 9, background: p.grey, width: "52%" }} />
            </div>
            <div style={{ position: "absolute", left: 28, right: 28, bottom: 44, transform: `scale(${press})` }}>
              <div
                style={{
                  height: 84,
                  borderRadius: 42,
                  background: p.blue,
                  color: p.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  fontSize: 32,
                  fontWeight: 500,
                }}
              >
                <Arrow size={34} />
                {props.button}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 170,
                  height: 170,
                  marginLeft: -85,
                  marginTop: -85,
                  borderRadius: "50%",
                  border: `5px solid ${p.blue}`,
                  opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0,
                  transform: `scale(${0.3 + ripple * 1.2})`,
                }}
              />
            </div>
          </div>

          {/* Agenda: net zo netjes als het boek */}
          <div style={{ position: "absolute", inset: 0, opacity: sw, transform: `translateX(${(1 - sw) * 60}px)`, fontFamily: decFonts.ui }}>
            <div style={{ position: "absolute", left: 30, top: 84, fontFamily: decFonts.display, fontWeight: 500, fontSize: 56, lineHeight: 1, letterSpacing: decTracking, color: p.blue }}>
              {props.agendaTitle}
            </div>
            {props.agenda.map((a, i) => {
              const t0 = FWD_T.rows + i * FWD_T.rowStagger;
              const s = pop(frame, fps, t0, springs.pop);
              const flagColor = a.kind === 7 ? p.blue : p.ink;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 22,
                    right: 22,
                    top: 172 + i * 138,
                    height: 118,
                    borderRadius: 28,
                    background: p.light,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "0 20px 0 18px",
                    opacity: Math.min(1, s * 1.5),
                    transform: `translateX(${(1 - s) * 50}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 78,
                      height: 86,
                      borderRadius: 18,
                      background: p.blue,
                      color: p.white,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 42, lineHeight: 1, letterSpacing: decTracking }}>{a.day}</div>
                    <div style={{ fontWeight: 600, fontSize: 21, marginTop: 2 }}>{a.month}</div>
                  </div>
                  <div style={{ flex: 1, fontWeight: 600, fontSize: 28, lineHeight: 1.15, color: p.ink }}>{a.title}</div>
                  {a.kind > 0 ? <Flag size={40} color={flagColor} /> : <Tick progress={pop(frame, fps, t0 + 6, springs.pop)} color={p.blue} />}
                </div>
              );
            })}
          </div>
        </Phone>

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

        <div
          style={{
            position: "absolute",
            left: fx - 110,
            top: fy - 40,
            width: 220,
            height: 80,
            borderRadius: 24,
            background: p.white,
            boxShadow: "0 18px 40px rgba(1, 30, 140, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 16px",
            fontFamily: fonts.ui,
            fontSize: 22,
            fontWeight: 600,
            color: p.ink,
            opacity: fOpacity,
            transform: `scale(${fScale}) rotate(${fly * 20}deg)`,
            zIndex: 9,
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: p.grey, color: p.blueMid, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {props.mailFrom[0]}
          </div>
          {props.mailFrom}
        </div>
      </Stage>

      <DSubline text={props.subline} color={p.blue} delay={FWD_T.subline} />
    </SceneBg>
  );
};
