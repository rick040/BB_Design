import React from "react";
import { interpolate } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { blinkScale, clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { lin, sp } from "./Card";
import type { VP } from "./CardVisuals";

// ---------------------------------------------------------------- chips (Buddy + extracted fields)
export const ChipsVisual: React.FC<VP<"chips">> = ({ v, t, onBlue }) => {
  const p = usePalette();
  const B = 240;
  const bIn = sp(t, 0, 9, 160);
  const gulp = interpolate(t, [4, 9, 14, 20], [1, 0.82, 1.08, 1], clamp);
  return (
    <>
      {v.buddy ? (
        <Buddy
          size={B}
          body={onBlue ? p.white : p.blueMascot}
          eye={onBlue ? p.blueMascot : p.white}
          squash={gulp}
          blink={blinkScale(t, [30])}
          look={{ x: 0, y: 0.5 }}
          style={{
            position: "absolute",
            left: 540 - B / 2,
            top: 330 - B * BUDDY_RATIO,
            opacity: Math.min(1, bIn * 3),
            transform: `scale(${0.5 + 0.5 * bIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: v.buddy ? 400 : 300,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 26,
        }}
      >
        {v.items.map((c, i) => {
          const s = sp(t, 12 + i * 6, 11, 210);
          return (
            <div
              key={i}
              style={{
                height: 112,
                padding: "0 44px",
                borderRadius: 56,
                background: p.white,
                color: p.blue,
                display: "flex",
                alignItems: "center",
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 54,
                letterSpacing: "-0.03em",
                boxShadow: "0 18px 44px rgba(1, 30, 140, 0.2)",
                border: onBlue ? "none" : `3px solid ${p.blueSoft}`,
                opacity: Math.min(1, s * 1.6),
                transform: `translateY(${(1 - s) * -60}px) scale(${0.6 + 0.4 * s})`,
                whiteSpace: "nowrap",
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- clock (night thought)
export const ClockVisual: React.FC<VP<"clock">> = ({ v, t, onBlue }) => {
  const p = usePalette();
  const B = 280;
  const colon = Math.floor(t / 15) % 2 === 0 ? 1 : 0.25;
  const [hh, mm] = v.time.split(":");
  const fg = onBlue ? p.white : p.blue;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 110,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 300,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          color: fg,
        }}
      >
        {hh}
        <span style={{ opacity: colon }}>:</span>
        {mm}
      </div>
      <Buddy
        size={B}
        body={onBlue ? p.white : p.blueMascot}
        eye={onBlue ? p.blueMascot : p.white}
        blink={blinkScale(t, [20, 70])}
        look={{ x: Math.sin(t / 20) * 0.7, y: -0.6 }}
        style={{ position: "absolute", left: 540 - B / 2, top: 860 - B * BUDDY_RATIO }}
      />
      {v.caption ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 700,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 40,
            color: onBlue ? p.blueText : p.blueDim,
            opacity: lin(t, 14, 26),
          }}
        >
          {v.caption}
        </div>
      ) : null}
    </>
  );
};

// ---------------------------------------------------------------- Buddy with a speech bubble
export const BuddyVisual: React.FC<VP<"buddy">> = ({ v, t, onBlue }) => {
  const p = usePalette();
  const B = 300;
  const bIn = sp(t, 0, 9, 160);
  const hop = v.mood === "happy" ? Math.abs(Math.sin(Math.max(0, t - 16) / 6)) * (t > 16 && t < 52 ? 70 : 0) : 0;
  const bubble = sp(t, 8, 12, 190);
  return (
    <>
      {v.text ? (
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 30,
            display: "flex",
            justifyContent: "center",
            opacity: bubble,
            transform: `scale(${0.7 + 0.3 * bubble})`,
            transformOrigin: "50% 100%",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "34px 46px",
              borderRadius: 48,
              background: onBlue ? p.white : p.blue,
              color: onBlue ? p.blue : p.white,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 54,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            {v.text}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: -26,
                marginLeft: -26,
                width: 52,
                height: 52,
                background: onBlue ? p.white : p.blue,
                transform: "rotate(45deg)",
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      ) : null}
      <Buddy
        size={B}
        body={onBlue ? p.white : p.blueMascot}
        eye={onBlue ? p.blueMascot : p.white}
        blink={v.mood === "happy" && t > 16 && t < 52 ? 0.15 : blinkScale(t, [40])}
        squash={interpolate(bIn, [0, 0.6, 1], [0.6, 1.1, 1])}
        look={{ x: 0, y: -0.4 }}
        style={{
          position: "absolute",
          left: 540 - B / 2,
          top: 860 - B * BUDDY_RATIO - hop,
          opacity: Math.min(1, bIn * 3),
        }}
      />
    </>
  );
};

// ---------------------------------------------------------------- big type
export const BigVisual: React.FC<VP<"big">> = ({ v, t, onBlue }) => {
  const p = usePalette();
  const fg = onBlue ? p.white : p.blue;
  const s = sp(t, 0, 12, 170);
  const check = lin(t, 6, 22);
  const sub = lin(t, 14, 28);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 0,
        height: 900,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        textAlign: "center",
      }}
    >
      {v.check ? <Checkmark size={200} color={fg} progress={check} strokeWidth={13} /> : null}
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: v.text.length > 12 ? 150 : 200,
          lineHeight: 0.95,
          letterSpacing: headlineTracking,
          color: fg,
          opacity: Math.min(1, s * 1.4),
          transform: `scale(${0.8 + 0.2 * s})`,
          whiteSpace: "pre-line",
        }}
      >
        {v.text}
      </div>
      {v.sub ? (
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 46,
            lineHeight: 1.2,
            color: onBlue ? p.blueText : p.blueDim,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 20}px)`,
            whiteSpace: "pre-line",
            textWrap: "balance",
          }}
        >
          {v.sub}
        </div>
      ) : null}
    </div>
  );
};
