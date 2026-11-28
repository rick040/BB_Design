import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { type SpeeldoosProps, wordAt } from "../schema";

// Absolute frames. The bill is already on screen at frame 0 (cover).
export const HOOK_T = {
  guess1: wordAt("ai") + 4, // AI starts guessing the amount
  guess2: wordAt("over") + 6, // ...and the due date
  guess3: wordAt("rekening") + 4, // ...and the link
  myth: wordAt("gaat"), // MYTHE label slams in
};

const CARD_X = (1080 - BILL_W) / 2;
const CARD_Y = 330;

const Sparkle: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", ...style }}>
    <path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z" fill={color} />
  </svg>
);

export const AiBadge: React.FC<{ text: string; frame: number; ink: string; yellow: string }> = ({ text, frame, ink, yellow }) => {
  const tw = (k: number) => 0.6 + 0.4 * Math.abs(Math.sin(frame / 7 + k));
  return (
    <div style={{ position: "relative", width: 150, height: 150 }}>
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: yellow,
          color: ink,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 66,
          letterSpacing: "-0.04em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 50px rgba(255, 206, 49, 0.45)",
        }}
      >
        {text}
      </div>
      <Sparkle size={54 * tw(0)} color={yellow} style={{ left: -40, top: -26 }} />
      <Sparkle size={36 * tw(1.7)} color={yellow} style={{ left: 150, top: 110 }} />
      <Sparkle size={28 * tw(3.1)} color={yellow} style={{ left: 140, top: -30 }} />
    </div>
  );
};

const Guess: React.FC<{ text: string; s: number; x: number; y: number; rot: number; ink: string; yellow: string }> = ({ text, s, x, y, rot, ink, yellow }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `rotate(${rot}deg) scale(${0.5 + 0.5 * s})`,
      opacity: Math.min(1, s * 2),
      background: "#fff7d6",
      border: `4px dashed ${yellow}`,
      color: ink,
      fontFamily: fonts.ui,
      fontWeight: 600,
      fontSize: 48,
      padding: "14px 30px",
      borderRadius: 20,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

export const HookScene: React.FC<{ props: SpeeldoosProps["hook"]; bill: SpeeldoosProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const g = [HOOK_T.guess1, HOOK_T.guess2, HOOK_T.guess3].map((t) => pop(frame, fps, t, springs.pop));
  const myth = pop(frame, fps, HOOK_T.myth, springs.pop);
  const hover = Math.sin(frame / 9) * 10;
  // Shimmer band sweeping across the bill ("AI magic").
  const sweep = ((frame * 22) % 1500) - 300;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-20} stagger={2} />
      <Stage>
        <div style={{ position: "absolute", left: CARD_X, top: CARD_Y, width: BILL_W, height: BILL_H, transform: `rotate(-2deg) scale(1.08)` }}>
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 48, overflow: "hidden", pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                top: -100,
                left: sweep,
                width: 160,
                height: 600,
                transform: "rotate(20deg)",
                background: "linear-gradient(90deg, rgba(255,206,49,0), rgba(255,206,49,0.35), rgba(255,206,49,0))",
              }}
            />
          </div>
        </div>
        <div style={{ position: "absolute", left: CARD_X + BILL_W - 110, top: CARD_Y - 110 + hover }}>
          <AiBadge text={props.badge} frame={frame} ink={p.ink} yellow={p.yellow} />
        </div>
        <Guess text={props.guesses[0]} s={g[0]} x={610} y={CARD_Y + BILL_H + 40} rot={-6} ink={p.ink} yellow={p.yellow} />
        <Guess text={props.guesses[1]} s={g[1]} x={90} y={CARD_Y + BILL_H + 70} rot={4} ink={p.ink} yellow={p.yellow} />
        <Guess text={props.guesses[2]} s={g[2]} x={400} y={CARD_Y + BILL_H + 175} rot={-3} ink={p.ink} yellow={p.yellow} />
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 170,
            transform: `rotate(-8deg) scale(${interpolate(myth, [0, 1], [2.2, 1])})`,
            opacity: Math.min(1, myth * 3),
            border: `7px solid ${p.ink}`,
            color: p.ink,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 64,
            letterSpacing: "0.08em",
            padding: "4px 28px",
            borderRadius: 16,
            background: p.light,
          }}
        >
          {props.mythLabel}
        </div>
      </Stage>
    </SceneBg>
  );
};


