import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { Arrow } from "../components/CtaPill";
import { SceneBg, Stage } from "../components/Stage";
import { Headline, Subline } from "../components/Text";
import { blinkScale, clamp, pop, springs } from "../lib/anim";
import { usePalette } from "../lib/palette";
import type { AdProps } from "../schema";
import { fonts, headlineTracking } from "../theme";

const T_PRESS = 30;
const T_FLY = 38;
const T_GULP = 54;
const T_CHIPS = 62;

const CARD = { x: 110, y: 40, w: 860, h: 320 };
const BUDDY_SIZE = 240;
const BUDDY_FEET = 880;
const BUDDY_CENTER = { x: 540, y: BUDDY_FEET - (BUDDY_SIZE * BUDDY_RATIO) / 2 };

// Where each info chip lands, relative to the stage.
const CHIP_SLOTS = [
  { x: 330, y: 150, r: -4 },
  { x: 700, y: 300, r: 3 },
  { x: 400, y: 450, r: -2 },
];

const ChipIcon: React.FC<{ index: number }> = ({ index }) => {
  const stroke = { fill: "none", stroke: "#fff", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (index === 0) {
    return (
      <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 36, color: "#fff", lineHeight: 1 }}>€</span>
    );
  }
  if (index === 1) {
    return (
      <svg width={34} height={34} viewBox="0 0 32 32">
        <rect x="4" y="6" width="24" height="22" rx="4" {...stroke} />
        <path d="M4 13h24M11 3v6M21 3v6" {...stroke} />
      </svg>
    );
  }
  return (
    <svg width={34} height={34} viewBox="0 0 32 32">
      <path d="M13.5 18.5a6 6 0 0 0 8.5 0l4-4a6 6 0 0 0-8.5-8.5l-1.5 1.5" {...stroke} />
      <path d="M18.5 13.5a6 6 0 0 0-8.5 0l-4 4a6 6 0 0 0 8.5 8.5l1.5-1.5" {...stroke} />
    </svg>
  );
};

export const ForwardScene: React.FC<{ props: AdProps["forward"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Mail card: enter, button press, then fly into Buddy.
  const cardIn = pop(frame, fps, 6, springs.smooth);
  const press = interpolate(frame, [T_PRESS, T_PRESS + 3, T_PRESS + 8], [1, 0.88, 1], clamp);
  const ripple = interpolate(frame, [T_PRESS + 1, T_PRESS + 14], [0, 1], clamp);
  const fly = interpolate(frame, [T_FLY, T_GULP], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const cardCx = CARD.x + CARD.w / 2;
  const cardCy = CARD.y + CARD.h / 2;
  const fx = interpolate(fly, [0, 1], [cardCx, BUDDY_CENTER.x]) + Math.sin(fly * Math.PI) * 220;
  const fy = interpolate(fly, [0, 1], [cardCy, BUDDY_CENTER.y]);
  const fScale = interpolate(fly, [0, 1], [1, 0.06]);
  const fRot = interpolate(fly, [0, 1], [0, 28]);
  const fOpacity = interpolate(fly, [0.85, 1], [1, 0], clamp);

  // Buddy: pops in, watches the card, gulps it, then looks at the chips.
  const buddyIn = pop(frame, fps, 10, springs.bouncy);
  const gulp = interpolate(frame, [T_GULP - 2, T_GULP + 2, T_GULP + 7, T_GULP + 12], [1, 0.78, 1.12, 1], clamp);
  const idle = frame > T_GULP + 14 ? Math.sin((frame - T_GULP) / 8) * 6 : 0;
  const look = {
    x: interpolate(fly, [0, 0.5, 1], [0, 0.7, 0]) + interpolate(frame, [T_CHIPS, T_CHIPS + 10, T_CHIPS + 30], [0, -0.4, 0.4], clamp),
    y: frame < T_GULP ? -1 : interpolate(frame, [T_GULP + 4, T_GULP + 10], [0.2, -1], clamp),
  };
  const blink = blinkScale(frame, [T_GULP - 1, T_CHIPS + 34]);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} />

      <Stage>
        {/* Mail card */}
        <div
          style={{
            position: "absolute",
            left: fx - CARD.w / 2,
            top: fy - CARD.h / 2,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 44,
            background: p.white,
            boxShadow: "0 30px 80px rgba(0, 20, 120, 0.35)",
            padding: "34px 40px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            opacity: cardIn * fOpacity,
            transform: `translateY(${(1 - cardIn) * 80}px) scale(${fScale}) rotate(${fRot}deg)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: p.grey,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
                fontWeight: 600,
                color: p.blueMid,
              }}
            >
              {props.sender[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 36, fontWeight: 600, color: p.ink }}>{props.sender}</span>
                <span style={{ fontSize: 28, color: p.greyText }}>09:41</span>
              </div>
              <div style={{ fontSize: 31, color: "#4a4a55", marginTop: 4 }}>{props.subject}</div>
            </div>
          </div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ width: 600, height: 18, borderRadius: 9, background: p.grey }} />
            <div style={{ width: 430, height: 18, borderRadius: 9, background: p.grey }} />
          </div>
          {/* Forward button */}
          <div
            style={{
              position: "absolute",
              right: 36,
              bottom: 32,
              height: 72,
              padding: "0 22px 0 30px",
              borderRadius: 36,
              background: p.blue,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 32,
              fontWeight: 500,
              transform: `scale(${press})`,
            }}
          >
            {props.button}
            <Arrow size={34} />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 260,
                height: 260,
                marginLeft: -130,
                marginTop: -130,
                borderRadius: "50%",
                border: `6px solid ${p.blueSoft}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
                transform: `scale(${0.2 + ripple})`,
              }}
            />
          </div>
        </div>

        {/* Info chips pop out of Buddy */}
        {props.chips.map((chip, i) => {
          const t = pop(frame, fps, T_CHIPS + i * 6, { damping: 14, stiffness: 150, mass: 0.8 });
          if (frame < T_CHIPS + i * 6) return null;
          const slot = CHIP_SLOTS[i];
          const x = interpolate(t, [0, 1], [BUDDY_CENTER.x, slot.x]);
          const y = interpolate(t, [0, 1], [BUDDY_CENTER.y, slot.y]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${0.2 + 0.8 * t}) rotate(${slot.r * t}deg)`,
                height: 108,
                padding: "0 42px 0 18px",
                borderRadius: 54,
                background: p.white,
                display: "flex",
                alignItems: "center",
                gap: 22,
                boxShadow: "0 20px 50px rgba(0, 20, 120, 0.3)",
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: "50%",
                  background: p.blueMid,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChipIcon index={i} />
              </div>
              <span
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 500,
                  fontSize: 54,
                  letterSpacing: headlineTracking,
                  color: p.blue,
                  paddingBottom: 4,
                }}
              >
                {chip}
              </span>
            </div>
          );
        })}

        <Buddy
          size={BUDDY_SIZE}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          look={look}
          squash={gulp}
          style={{
            position: "absolute",
            left: BUDDY_CENTER.x - BUDDY_SIZE / 2,
            top: BUDDY_FEET - BUDDY_SIZE * BUDDY_RATIO + idle + (1 - buddyIn) * 300,
            opacity: Math.min(1, buddyIn * 2),
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={T_CHIPS + 8} />
    </SceneBg>
  );
};
