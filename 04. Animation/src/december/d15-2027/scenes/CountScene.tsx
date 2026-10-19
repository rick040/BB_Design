import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../../components/Stage";
import { clamp, pop } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline } from "../../text";
import { dec, decFonts, decTracking } from "../../theme";
import type { AftellenProps } from "../schema";

// Timeline (frames, scene-local). 10 tot en met 0, elk getal even lang.
export const COUNT_T = {
  stepLen: 13, // duur: één getal staat zo lang in beeld
  billIn: 3, // de rekening schuift een paar frames na het getal binnen
  billLen: 11, // duur: een rekening blijft zo lang zichtbaar
};

const CARD_W = 940;

const Mini: React.FC<{ label: string; size?: number }> = ({ label, size = 62 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: dec.blue,
      color: dec.white,
      fontFamily: decFonts.display,
      fontWeight: 500,
      fontSize: size * 0.54,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {label}
  </div>
);

export const CountScene: React.FC<{ props: AftellenProps["count"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const idx = Math.min(10, Math.floor(frame / COUNT_T.stepLen)); // 0..10
  const number = 10 - idx;
  const local = frame - idx * COUNT_T.stepLen;
  // Een getal "klapt" erin en komt tot rust; bij het eerste getal staat hij er al.
  const hit = idx === 0 ? 1 : pop(frame, fps, idx * COUNT_T.stepLen, { damping: 12, stiffness: 260, mass: 0.6 });
  const flash = idx === 0 ? 0 : interpolate(local, [0, 2, 6], [1, 1, 0], clamp);
  const isZero = number === 0;

  const billLocal = local - COUNT_T.billIn;
  const billT = interpolate(billLocal, [0, 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const billOut = interpolate(billLocal, [COUNT_T.billLen - 3, COUNT_T.billLen], [0, 1], clamp);
  const showBill = !isZero;
  const bill = props.bills[idx] ?? "";

  return (
    <SceneBg color={dec.ink}>
      <DHeadline text={props.headline} color={dec.white} delay={-14} stagger={3} sizeFactor={1} />
      <Stage offsetY={50}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -60,
            textAlign: "center",
            fontFamily: decFonts.display,
            fontWeight: 500,
            fontSize: isZero ? 900 : 820,
            lineHeight: 1,
            letterSpacing: decTracking,
            color: flash > 0.5 ? dec.white : p.blueSoft,
            transform: `scale(${0.88 + 0.12 * hit + flash * 0.05})`,
            transformOrigin: "50% 55%",
            filter: `blur(${Math.max(0, 1 - hit) * 6}px)`,
          }}
        >
          {number}
        </div>

        {showBill ? (
          <div
            style={{
              position: "absolute",
              left: (1080 - CARD_W) / 2,
              top: 690,
              width: CARD_W,
              height: 172,
              borderRadius: 50,
              background: dec.white,
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "0 36px 0 24px",
              boxSizing: "border-box",
              fontFamily: decFonts.ui,
              opacity: billT * (1 - billOut),
              transform: `translateY(${(1 - billT) * 50 - billOut * 20}px)`,
            }}
          >
            <div
              style={{
                width: 106,
                height: 106,
                borderRadius: "50%",
                background: dec.ice,
                color: dec.blue,
                fontFamily: decFonts.display,
                fontWeight: 500,
                fontSize: 54,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {bill[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 48, fontWeight: 600, color: dec.ink, lineHeight: 1.1, whiteSpace: "nowrap" }}>{bill}</div>
              <div style={{ fontSize: 32, fontWeight: 400, color: dec.greyText, lineHeight: 1.25 }}>{props.cardSub}</div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Mini label={props.flagFar} />
              <Mini label={props.flagNear} />
            </div>
          </div>
        ) : null}
      </Stage>
    </SceneBg>
  );
};
