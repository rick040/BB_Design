import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg } from "../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Avatar, EnvelopeIcon, ForwardIcon, PlaneIcon, Tap } from "../components/ui";
import { DetailText, VisualBox } from "../layout";
import type { HeroVslProps } from "../schema";

// Step 1 in detail: forward the bill to your own Buddy address, or let a
// filter rule do it automatically.
export const SEND_T = {
  card: 4, // compose window pops in
  type: 12, // address types itself
  send: 46, // tap on "Verstuur"
  fly: 48, // envelope flies to Buddy
  flyLen: 16,
  catch: 64, // Buddy catches it
  auto: 66, // "Automatisch doorsturen" card
  toggle: 78, // switch flips on
};

const CARD = { left: 90, top: 24, w: 820, h: 470 };
const BUDDY = 180;
const BUDDY_H = BUDDY * BUDDY_RATIO;
const FEET = 846;
const BX = 812; // Buddy centre x
const BUDDY_TOP = FEET - BUDDY_H;

export const SendScene: React.FC<{
  props: HeroVslProps["send"];
  bill: HeroVslProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, SEND_T.card, springs.pop);
  const chars = Math.max(0, Math.min(props.address.length, Math.floor((frame - SEND_T.type) / 0.8)));
  const typing = frame >= SEND_T.type && chars < props.address.length;
  const caret = typing || Math.floor(frame / 8) % 2 === 0;
  const press = interpolate(frame, [SEND_T.send - 2, SEND_T.send, SEND_T.send + 5], [0, 1, 0], clamp);

  // Envelope from the send button into Buddy.
  const fly = interpolate(frame, [SEND_T.fly, SEND_T.fly + SEND_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const from = { x: CARD.left + 690, y: CARD.top + 412 };
  const to = { x: BX, y: BUDDY_TOP + BUDDY_H * 0.45 };
  const envX = interpolate(fly, [0, 1], [from.x, to.x]);
  const envY = interpolate(fly, [0, 1], [from.y, to.y]) - Math.sin(fly * Math.PI) * 110;
  const envScale = interpolate(fly, [0, 0.15, 1], [0.3, 1, 0.35], clamp);
  const envOpacity = frame >= SEND_T.fly && fly < 1 ? interpolate(fly, [0.8, 1], [1, 0], clamp) : 0;

  const enter = pop(frame, fps, 2, springs.bouncy);
  let squash = interpolate(enter, [0, 0.6, 1], [0.7, 1.08, 1]);
  if (frame >= SEND_T.catch - 1) {
    squash = interpolate(
      frame,
      [SEND_T.catch - 1, SEND_T.catch + 3, SEND_T.catch + 9, SEND_T.catch + 15],
      [1, 0.8, 1.07, 1],
      clamp,
    );
  }
  const lookX = interpolate(frame, [0, SEND_T.fly, SEND_T.catch, SEND_T.toggle - 6], [-0.7, -0.4, 0, -0.9], clamp);
  const lookY = interpolate(frame, [0, SEND_T.fly, SEND_T.catch, SEND_T.toggle - 6], [-0.8, -0.9, 0.2, 0.3], clamp);
  const blink = blinkScale(frame, [SEND_T.catch + 6, 92]);
  const idle = Math.sin(frame / 9) * 3;

  const autoIn = pop(frame, fps, SEND_T.auto, springs.pop);
  const toggle = interpolate(frame, [SEND_T.toggle, SEND_T.toggle + 6], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  const label: React.CSSProperties = { fontSize: 27, color: p.greyText, width: 150, flexShrink: 0 };

  return (
    <SceneBg color={p.blue}>
      <DetailText title={props.title} body={props.body} />

      <VisualBox>
        {/* Compose window */}
        <div
          style={{
            position: "absolute",
            left: CARD.left,
            top: CARD.top,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 46,
            background: p.white,
            boxShadow: "0 30px 80px rgba(0, 10, 90, 0.28)",
            padding: "30px 40px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            opacity: Math.min(1, cardIn * 1.6),
            transform: `translateY(${(1 - cardIn) * 40}px) scale(${0.92 + 0.08 * cardIn})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, height: 50 }}>
            <ForwardIcon size={36} color={p.blue} />
            <span style={{ fontSize: 34, fontWeight: 600, color: p.ink }}>{props.composeTitle}</span>
          </div>
          <div style={{ height: 2, background: p.grey, margin: "18px -40px 0" }} />

          <div style={{ display: "flex", alignItems: "center", height: 74, marginTop: 6 }}>
            <span style={label}>{props.toLabel}</span>
            <span
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: p.blue,
                background: `${p.blueSoft}66`,
                borderRadius: 14,
                padding: "6px 14px",
                whiteSpace: "nowrap",
                minWidth: 20,
                minHeight: 38,
              }}
            >
              {props.address.slice(0, chars)}
              <span style={{ opacity: caret ? 1 : 0, color: p.blue, marginLeft: 1 }}>|</span>
            </span>
          </div>
          <div style={{ height: 2, background: p.grey }} />
          <div style={{ display: "flex", alignItems: "center", height: 74 }}>
            <span style={label}>{props.subjectLabel}</span>
            <span style={{ fontSize: 29, color: p.ink, whiteSpace: "nowrap" }}>{props.subjectLine}</span>
          </div>
          <div style={{ height: 2, background: p.grey }} />

          {/* Quoted bill */}
          <div
            style={{
              marginTop: 22,
              height: 88,
              borderRadius: 24,
              background: "#f1f4f8",
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "0 22px",
            }}
          >
            <Avatar letter={bill.sender[0] ?? "R"} size={54} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 600, color: p.ink }}>{bill.sender}</div>
              <div style={{ fontSize: 23, color: p.greyText }}>
                {bill.amount} · {bill.dueLabel}
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              right: 40,
              bottom: 26,
              height: 66,
              padding: "0 28px 0 22px",
              borderRadius: 33,
              background: p.blue,
              color: p.white,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 28,
              fontWeight: 600,
              transform: `scale(${1 - press * 0.08})`,
            }}
          >
            <PlaneIcon size={30} color={p.white} />
            {props.sendButton}
          </div>
        </div>

        {/* Automatic forwarding */}
        <div
          style={{
            position: "absolute",
            left: CARD.left,
            top: 560,
            width: 600,
            height: 128,
            borderRadius: 36,
            background: p.white,
            boxShadow: "0 20px 50px rgba(0, 10, 90, 0.25)",
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 30px 0 24px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            opacity: Math.min(1, autoIn * 1.6),
            transform: `translateY(${(1 - autoIn) * 30}px) scale(${0.9 + 0.1 * autoIn})`,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: p.grey,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ForwardIcon size={36} color={p.blueMid} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{props.autoLabel}</div>
            <div style={{ fontSize: 23, color: p.greyText, marginTop: 2, whiteSpace: "nowrap" }}>{props.autoNote}</div>
          </div>
          <div
            style={{
              width: 92,
              height: 54,
              borderRadius: 27,
              background: toggle > 0.5 ? p.blue : "#cfd6e0",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 5,
                left: 5 + toggle * 38,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: p.white,
                boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: lookX, y: lookY }}
          style={{
            position: "absolute",
            left: BX - BUDDY / 2,
            top: BUDDY_TOP + idle,
            opacity: Math.min(1, enter * 3),
          }}
        />

        <div
          style={{
            position: "absolute",
            left: envX - 45,
            top: envY - 32,
            opacity: envOpacity,
            transform: `scale(${envScale}) rotate(${-14 * Math.sin(fly * Math.PI)}deg)`,
          }}
        >
          <EnvelopeIcon size={90} color={p.white} flap={p.blue} />
        </div>

        <Tap frame={frame} at={SEND_T.send} x={CARD.left + 690} y={CARD.top + 412} />
        <Tap frame={frame} at={SEND_T.toggle} x={CARD.left + 600 - 30 - 46} y={560 + 64} />
      </VisualBox>
    </SceneBg>
  );
};
