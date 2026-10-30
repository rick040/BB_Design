import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { DRAPE, Drapes, Envelope, ENVELOPE_H, ENVELOPE_W, Sparkle } from "../components/Magic";
import type { GoochelProps } from "../schema";

// Timeline (frames, scene-local).
export const PREDICT_T = {
  hop: 16, // Buddy hops up and taps the sealed envelope
  open: 24, // the flap folds open
  openLen: 12,
  card: 34, // the prediction card slides out
  cardLen: 16,
  row1: 48, // 17 nov · mail: nog 7 dagen
  row2: 58, // 22 nov · mail: nog 2 dagen
  row3: 68, // 24 nov · in je agenda
  sparkle: 74,
  subline: 82,
};

const ENV = { x: 540 - ENVELOPE_W / 2 + 100, y: 350 };
const CARD = { w: 620, h: 370 };
const BUDDY = 170;
const BUDDY_X = 90;
const FEET = ENV.y + ENVELOPE_H;

const CalIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={34} height={34} viewBox="0 0 24 24" style={{ display: "block" }}>
    <rect x={3} y={5} width={18} height={16} rx={3} fill="none" stroke={color} strokeWidth={2.2} />
    <path d="M3 10h18M8 3v4M16 3v4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);
const MailIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={34} height={34} viewBox="0 0 24 24" style={{ display: "block" }}>
    <rect x={3} y={5} width={18} height={14} rx={3} fill="none" stroke={color} strokeWidth={2.2} />
    <path d="M4 7l8 6 8-6" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
  </svg>
);

export const PredictScene: React.FC<{ props: GoochelProps["predict"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Buddy hops and taps.
  const hopY = interpolate(frame, [PREDICT_T.hop, PREDICT_T.hop + 5, PREDICT_T.hop + 10], [0, -90, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const squash = interpolate(
    frame,
    [PREDICT_T.hop - 3, PREDICT_T.hop, PREDICT_T.hop + 5, PREDICT_T.hop + 10, PREDICT_T.hop + 13, PREDICT_T.hop + 17],
    [1, 0.85, 1.1, 1, 0.86, 1],
    clamp,
  );
  const lookX = interpolate(frame, [PREDICT_T.card, PREDICT_T.card + 8], [0.4, 1], clamp);
  const lookY = interpolate(frame, [PREDICT_T.card, PREDICT_T.card + 8], [0, -0.7], clamp);
  const blink = blinkScale(frame, [6, PREDICT_T.subline + 4]);
  const happy = frame >= PREDICT_T.sparkle ? interpolate(frame, [PREDICT_T.sparkle, PREDICT_T.sparkle + 4], [1, 0.2], clamp) : 1;

  const tapShake = interpolate(frame, [PREDICT_T.hop + 9, PREDICT_T.hop + 11, PREDICT_T.hop + 13, PREDICT_T.hop + 16], [0, 4, -3, 0], clamp);
  const open = interpolate(frame, [PREDICT_T.open, PREDICT_T.open + PREDICT_T.openLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const cardT = interpolate(frame, [PREDICT_T.card, PREDICT_T.card + PREDICT_T.cardLen], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  // Card-local top inside the envelope: starts tucked in, ends above it.
  const cardTop = interpolate(cardT, [0, 1], [40, -CARD.h + 40]);

  const rows = [PREDICT_T.row1, PREDICT_T.row2, PREDICT_T.row3].map((r) => pop(frame, fps, r, springs.pop));

  return (
    <SceneBg color={p.light}>
      <Drapes close={0} edge={46} color={DRAPE.color} dark={DRAPE.dark} />
      <Headline text={props.headline} color={p.blue} delay={2} stagger={3} />

      <Stage offsetY={70}>
        <div
          style={{
            position: "absolute",
            left: 60,
            width: 960,
            top: FEET - 70,
            height: 150,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(182,199,255,0.6), rgba(182,199,255,0))",
          }}
        />

        <Envelope
          label={props.envelopeLabel}
          open={open}
          style={{ left: ENV.x, top: ENV.y, transform: `rotate(${tapShake}deg)` }}
        >
          {frame >= PREDICT_T.card ? (
            <div
              style={{
                position: "absolute",
                left: (ENVELOPE_W - CARD.w) / 2,
                top: cardTop,
                width: CARD.w,
                height: CARD.h,
                borderRadius: 26,
                background: p.white,
                boxShadow: "0 18px 50px rgba(1,59,255,0.18)",
                padding: "30px 28px",
                boxSizing: "border-box",
                fontFamily: fonts.ui,
              }}
            >
              {props.rows.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    height: 96,
                    borderBottom: i < 2 ? `2px solid ${p.grey}` : "none",
                    opacity: Math.min(1, rows[i] * 1.5),
                    transform: `translateX(${(1 - rows[i]) * 40}px)`,
                  }}
                >
                  <div
                    style={{
                      minWidth: 132,
                      textAlign: "center",
                      padding: "10px 0",
                      borderRadius: 16,
                      background: i === 2 ? p.blue : p.grey,
                      color: i === 2 ? p.white : p.blue,
                      fontFamily: fonts.display,
                      fontWeight: 500,
                      fontSize: 34,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {r.date}
                  </div>
                  {i === 2 ? <CalIcon color={p.blue} /> : <MailIcon color={p.blue} />}
                  <div style={{ fontSize: 33, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{r.text}</div>
                </div>
              ))}
            </div>
          ) : null}
        </Envelope>

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={Math.min(blink, happy)}
          squash={squash}
          look={{ x: lookX, y: lookY }}
          style={{ position: "absolute", left: BUDDY_X, top: FEET - BUDDY * BUDDY_RATIO + hopY }}
        />

        {frame >= PREDICT_T.sparkle && frame < PREDICT_T.sparkle + 24
          ? [
              { x: ENV.x + 20, y: 60, s: 50 },
              { x: ENV.x + ENVELOPE_W - 40, y: 30, s: 40 },
              { x: ENV.x + ENVELOPE_W - 10, y: 300, s: 34 },
            ].map((s, i) => {
              const t = (frame - PREDICT_T.sparkle) / 24;
              return (
                <Sparkle
                  key={i}
                  size={s.s}
                  color={p.yellow}
                  style={{ left: s.x, top: s.y - t * 40, opacity: Math.sin(t * Math.PI), transform: `scale(${0.5 + t})` }}
                />
              );
            })
          : null}
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={PREDICT_T.subline} />
    </SceneBg>
  );
};
