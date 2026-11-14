import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Parcel } from "../components/Parcel";
import { StickerBill } from "../components/StickerBill";
import { type LaterProps, SCENE_STARTS, wordAt } from "../schema";

// Absolute frames; beats hang on the spoken words.
export const HOOK_T = {
  parcel: -20,
  later: wordAt("later", 1),
  later2: wordAt("later", 2),
  badge: wordAt("datum", 1),
  sink: wordAt("datum", 1) + 4,
  end: SCENE_STARTS[1],
};

const CARD_SCALE = 0.6;

export const HookScene: React.FC<{ props: LaterProps["hook"]; bill: LaterProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const parcelIn = pop(frame, fps, HOOK_T.parcel, springs.bouncy);
  const nowGlow = interpolate(frame, [HOOK_T.later - 6, HOOK_T.later + 4], [1, 0.35], clamp);
  const laterHi = pop(frame, fps, HOOK_T.later, springs.pop);
  const wiggle = frame >= HOOK_T.later2 ? Math.sin((frame - HOOK_T.later2) / 2) * 5 * Math.max(0, 1 - (frame - HOOK_T.later2) / 26) : 0;
  const badge = pop(frame, fps, HOOK_T.badge, springs.bouncy);
  // After "geen datum" the bill drifts down and fades: forgotten.
  const sink = interpolate(frame, [HOOK_T.sink, HOOK_T.end + 6], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });

  const label = (text: string, x: number, active: number) => (
    <div
      style={{
        position: "absolute",
        left: x,
        width: 540,
        top: 10,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: 92,
        letterSpacing: headlineTracking,
        color: p.blue,
        opacity: 0.3 + 0.7 * active,
      }}
    >
      {text}
    </div>
  );

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-12} stagger={2} />
      <Stage offsetY={70}>
        {/* the split */}
        <div style={{ position: "absolute", left: 538, top: 0, width: 4, height: 880, background: p.grey, borderRadius: 2 }} />
        {label(props.nowLabel, 0, nowGlow)}
        {label(props.laterLabel, 540, Math.max(0.35, laterHi))}

        {/* Now: the parcel has arrived */}
        <div
          style={{
            position: "absolute",
            left: 270 - 180,
            top: 300,
            transform: `scale(${0.6 + 0.4 * parcelIn}) translateY(${(1 - parcelIn) * -80}px)`,
            transformOrigin: "50% 100%",
            opacity: Math.min(1, parcelIn * 2) * (0.45 + 0.55 * nowGlow),
          }}
        >
          <Parcel w={360} h={290} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 540,
            top: 620,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, parcelIn * 2) * (0.45 + 0.55 * nowGlow),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: p.blue,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 40,
              padding: "16px 34px 16px 22px",
              borderRadius: 40,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill={p.white} />
              <path d="M9 16.5l4.5 4.5L23 11.5" fill="none" stroke={p.blue} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {props.delivered}
          </div>
        </div>

        {/* Later: the payment mail with its sticker */}
        <div
          style={{
            position: "absolute",
            left: 810 - (BILL_W * CARD_SCALE) / 2,
            top: 380 + sink * 260,
            width: BILL_W * CARD_SCALE,
            height: BILL_H * CARD_SCALE,
            opacity: 1 - sink * 0.85,
            transform: `rotate(${wiggle - sink * 14}deg) scale(${1 + 0.06 * Math.sin(Math.PI * Math.min(1, laterHi))})`,
            filter: `grayscale(${sink})`,
          }}
        >
          <div style={{ transform: `scale(${CARD_SCALE})`, transformOrigin: "0 0" }}>
            <StickerBill bill={bill} badge={badge} />
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
