import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow } from "../../components/CtaPill";
import { Phone } from "../../components/Phone";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { PHONE, type ZoWerktProps } from "../schema";

// Timeline (frames, scene-local). `forward` is the default of timing.forwardAt
// (2,5 s); the scene reads the real value from the props. Later beats are
// relative to it in the code (forward + n).
export const PHONE_T = {
  mail: -8, // the bill mail is open on the phone (frame 0)
  amountPulse: 30, // "Te betalen €12,00" gets a yellow mark
  forward: 75, // headline "1. Doorsturen.", tap on Doorsturen
  compose: 87, // forward sheet slides up (forward + 12)
  typing: 99, // address types itself (forward + 24)
  typeLen: 30,
  send: 135, // tap on send (forward + 60)
  flyOff: 139, // mail flies away (forward + 64)
  sent: 149, // "Doorgestuurd naar Buddy" (forward + 74)
};

const SCREEN_W = PHONE.w - 32;

export const PhoneScene: React.FC<{
  mail: ZoWerktProps["mail"];
  forward: ZoWerktProps["forward"];
  bill: ZoWerktProps["bill"];
  forwardAt: number;
}> = ({ mail, forward, bill, forwardAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const F = forwardAt;
  const rel = (n: number) => F + n;

  const phoneIn = pop(frame, fps, PHONE_T.mail, springs.smooth);
  const mark = interpolate(frame, [PHONE_T.amountPulse, PHONE_T.amountPulse + 10], [0, 1], clamp);
  const tap = interpolate(frame, [rel(6), rel(9), rel(14)], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [rel(7), rel(22)], [0, 1], clamp);
  const sheet = interpolate(frame, [rel(12), rel(24)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const typed = Math.round(
    interpolate(frame, [rel(24), rel(24) + PHONE_T.typeLen], [0, forward.address.length], clamp),
  );
  const sendTap = interpolate(frame, [rel(60), rel(63), rel(68)], [1, 0.85, 1], clamp);
  const fly = interpolate(frame, [rel(64), rel(76)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const sent = pop(frame, fps, rel(74), springs.bouncy);
  const caret = Math.floor(frame / 8) % 2 === 0;

  const h1Out = interpolate(frame, [F - 2, F + 3], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <div style={{ opacity: 1 - h1Out }}>
        <Headline text={mail.headline} color={p.blue} delay={-12} stagger={3} />
      </div>
      {frame >= F ? <Headline text={forward.headline} color={p.blue} delay={F + 2} stagger={3} /> : null}

      <Stage>
        <Phone
          width={PHONE.w}
          height={PHONE.h}
          style={{
            position: "absolute",
            left: PHONE.x,
            top: PHONE.y,
            opacity: phoneIn,
            transform: `translateY(${(1 - phoneIn) * 60}px)`,
          }}
        >
          {/* Mail view */}
          <div style={{ position: "absolute", inset: 0, fontFamily: fonts.ui, padding: "64px 30px 0" }}>
            <div style={{ fontSize: 26, color: p.blueMid, fontWeight: 500 }}>‹ {mail.inbox}</div>
            <div style={{ marginTop: 30, fontSize: 38, fontWeight: 650, color: p.ink, lineHeight: 1.15 }}>
              {bill.subject} · {bill.amount}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 26 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: p.grey,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontWeight: 600,
                  color: p.blueMid,
                }}
              >
                {bill.sender[0]}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 600, color: p.ink }}>{bill.sender}</div>
                <div style={{ fontSize: 22, color: p.greyText }}>{mail.to}</div>
              </div>
            </div>
            <div style={{ marginTop: 34, fontSize: 26, color: "#4a4a55" }}>{mail.greeting}</div>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ width: 360, height: 14, borderRadius: 7, background: p.grey }} />
              <div style={{ width: 300, height: 14, borderRadius: 7, background: p.grey }} />
            </div>
            <div
              style={{
                marginTop: 28,
                borderRadius: 24,
                background: "#f3f5fb",
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
                <span style={{ color: "#4a4a55" }}>{mail.amountLabel}</span>
                <span
                  style={{
                    fontWeight: 650,
                    color: p.ink,
                    padding: "0 8px",
                    borderRadius: 8,
                    background: `linear-gradient(${p.red}, ${p.red}) no-repeat 0 85% / ${mark * 100}% 40%`,
                  }}
                >
                  {bill.amount}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
                <span style={{ color: "#4a4a55" }}>{mail.dueLabel}</span>
                <span
                  style={{
                    fontWeight: 650,
                    color: p.ink,
                    padding: "0 8px",
                    borderRadius: 8,
                    background: `linear-gradient(${p.red}, ${p.red}) no-repeat 0 85% / ${mark * 100}% 40%`,
                  }}
                >
                  {bill.dueLong}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ width: 380, height: 14, borderRadius: 7, background: p.grey }} />
              <div style={{ width: 250, height: 14, borderRadius: 7, background: p.grey }} />
            </div>
          </div>
          {/* Bottom toolbar */}
          <div
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              bottom: 34,
              display: "flex",
              gap: 16,
              fontFamily: fonts.ui,
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 74,
                borderRadius: 37,
                background: p.grey,
                color: "#4a4a55",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mail.reply}
            </div>
            <div
              style={{
                position: "relative",
                flex: 1,
                height: 74,
                borderRadius: 37,
                background: p.blue,
                color: p.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transform: `scale(${tap})`,
              }}
            >
              {mail.forward}
              <Arrow size={26} />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 200,
                  height: 200,
                  marginLeft: -100,
                  marginTop: -100,
                  borderRadius: "50%",
                  border: `5px solid ${p.blue}`,
                  opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.9 : 0,
                  transform: `scale(${0.2 + ripple})`,
                }}
              />
            </div>
          </div>

          {/* Forward sheet */}
          {sheet > 0 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: p.white,
                borderRadius: "40px 40px 0 0",
                boxShadow: "0 -10px 40px rgba(0,0,0,0.12)",
                fontFamily: fonts.ui,
                padding: "70px 28px 0",
                boxSizing: "border-box",
                transform: `translate(${fly * 380}px, ${(1 - sheet) * 820 - fly * 900}px) scale(${1 - 0.5 * fly}) rotate(${fly * 18}deg)`,
                opacity: 1 - interpolate(fly, [0.7, 1], [0, 1], clamp),
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 34, fontWeight: 650, color: p.ink }}>{forward.title}</div>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: p.blue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${sendTap}) rotate(-90deg)`,
                  }}
                >
                  <Arrow size={36} />
                </div>
              </div>
              <div
                style={{
                  marginTop: 34,
                  paddingBottom: 18,
                  borderBottom: `2px solid ${p.grey}`,
                  fontSize: 25,
                  color: p.greyText,
                }}
              >
                {forward.toLabel}
              </div>
              <div
                style={{
                  marginTop: 14,
                  minHeight: 44,
                  fontSize: 28,
                  fontWeight: 600,
                  color: p.blue,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  width: SCREEN_W - 56,
                }}
              >
                {forward.address.slice(0, typed)}
                <span style={{ opacity: caret && typed < forward.address.length ? 1 : 0, color: p.blue }}>|</span>
              </div>
              <div style={{ marginTop: 26, borderRadius: 22, border: `2px solid ${p.grey}`, padding: "18px 20px" }}>
                <div style={{ fontSize: 22, color: p.greyText }}>Doorgestuurd bericht</div>
                <div style={{ marginTop: 10, fontSize: 25, fontWeight: 600, color: p.ink }}>
                  {bill.sender} · {bill.subject} · {bill.amount}
                </div>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ width: 330, height: 12, borderRadius: 6, background: p.grey }} />
                  <div style={{ width: 260, height: 12, borderRadius: 6, background: p.grey }} />
                </div>
              </div>
            </div>
          ) : null}

          {/* Sent toast */}
          {frame >= rel(74) ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 360,
                display: "flex",
                justifyContent: "center",
                transform: `scale(${sent})`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "20px 30px",
                  borderRadius: 40,
                  background: p.blue,
                  color: p.white,
                  fontFamily: fonts.ui,
                  fontSize: 28,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                <svg width={32} height={32} viewBox="0 0 32 32">
                  <path d="M6 17l7 7L26 9" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {forward.sent}
              </div>
            </div>
          ) : null}
        </Phone>
      </Stage>
    </SceneBg>
  );
};
