import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Concept-own parts for the waiting room (concept 70).

const LED = "#ff5a3c";
const LED_BG = "#15161c";

/** Waiting-room ticket display: dark box with a red LED label and value. */
export const LedDisplay: React.FC<{
  label: string;
  value: string;
  width?: number;
  height?: number;
  valueIn?: number;
  style?: React.CSSProperties;
}> = ({ label, value, width = 520, height = 140, valueIn = 1, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 26,
      background: LED_BG,
      border: "8px solid #2b2d36",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 28,
      padding: "0 36px",
      boxShadow: "0 24px 50px rgba(0, 10, 60, 0.25)",
      fontFamily: fonts.ui,
      color: LED,
      textShadow: `0 0 18px ${LED}aa`,
      overflow: "hidden",
      ...style,
    }}
  >
    <span style={{ fontSize: height * 0.2, fontWeight: 600, letterSpacing: "0.12em", opacity: 0.8 }}>{label}</span>
    <span
      style={{
        fontSize: height * 0.4,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "0.04em",
        display: "inline-block",
        transform: `translateY(${(1 - valueIn) * 60}%)`,
        opacity: valueIn,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  </div>
);

/** Simple waiting-room chair seen from the front. */
export const Chair: React.FC<{ x: number; seatY: number; width?: number; color: string; dark: string }> = ({
  x,
  seatY,
  width = 320,
  color,
  dark,
}) => (
  <>
    {/* backrest */}
    <div
      style={{
        position: "absolute",
        left: x - width / 2 + 20,
        top: seatY - 300,
        width: width - 40,
        height: 300,
        borderRadius: "36px 36px 0 0",
        background: color,
      }}
    />
    {/* legs */}
    {[-1, 1].map((s) => (
      <div
        key={s}
        style={{
          position: "absolute",
          left: x + s * (width / 2 - 40) - 9,
          top: seatY + 30,
          width: 18,
          height: 140,
          borderRadius: 9,
          background: dark,
        }}
      />
    ))}
    {/* seat */}
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: seatY,
        width,
        height: 44,
        borderRadius: 22,
        background: dark,
      }}
    />
  </>
);

export const NOTA_W = 270;
export const NOTA_H = 330;

/** Portrait care bill ("nota") with sender, subject, amount and due chip. */
export const NotaCard: React.FC<{
  sender: string;
  subject: string;
  amount: string;
  due: string;
  urgent?: boolean;
  stamp?: string;
  stampIn?: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, amount, due, urgent = false, stamp, stampIn = 0, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "relative",
        width: NOTA_W,
        height: NOTA_H,
        borderRadius: 28,
        background: p.white,
        boxShadow: "0 22px 50px rgba(1, 30, 120, 0.16)",
        padding: "30px 26px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: p.blueSoft }} />
        <span style={{ fontSize: 26, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{sender}</span>
      </div>
      <div style={{ fontSize: 22, color: p.greyText, marginTop: 10 }}>{subject}</div>
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ height: 12, width: "90%", borderRadius: 6, background: p.grey }} />
        <div style={{ height: 12, width: "70%", borderRadius: 6, background: p.grey }} />
      </div>
      <div
        style={{
          marginTop: "auto",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 58,
          letterSpacing: "-0.04em",
          color: urgent ? p.red : p.blue,
          lineHeight: 1,
        }}
      >
        {amount}
      </div>
      <div
        style={{
          marginTop: 14,
          alignSelf: "flex-start",
          fontSize: 21,
          fontWeight: 600,
          padding: "8px 14px",
          borderRadius: 20,
          background: urgent ? p.red : p.grey,
          color: urgent ? p.white : p.ink,
          whiteSpace: "nowrap",
        }}
      >
        {due}
      </div>
      {stamp && stampIn > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 104,
            padding: "6px 14px",
            border: `5px solid ${p.red}`,
            borderRadius: 12,
            color: p.red,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.02em",
            background: "rgba(255,255,255,0.88)",
            transform: `rotate(-12deg) scale(${2.2 - 1.2 * stampIn})`,
            opacity: Math.min(1, stampIn * 1.6),
          }}
        >
          {stamp}
        </div>
      ) : null}
    </div>
  );
};

/** Yellow waiting-number tag. */
export const NumberTag: React.FC<{ n: string; size?: number; style?: React.CSSProperties }> = ({
  n,
  size = 84,
  style,
}) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: p.yellow,
        color: p.ink,
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: size * 0.55,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      {n}
    </div>
  );
};

/** Ticket dispenser ("nummertjesautomaat"). The slot sits at (w/2, h*0.72). */
export const Dispenser: React.FC<{ width?: number; height?: number; press?: number; style?: React.CSSProperties }> = ({
  width = 220,
  height = 260,
  press = 0,
  style,
}) => {
  const p = usePalette();
  return (
    <div style={{ position: "relative", width, height, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 40,
          background: p.red,
          boxShadow: "0 24px 50px rgba(0, 10, 60, 0.3)",
        }}
      />
      {/* button */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - 34,
          top: height * 0.2,
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: p.yellow,
          border: "6px solid rgba(0,0,0,0.12)",
          transform: `scale(${1 - 0.15 * press})`,
        }}
      />
      {/* slot */}
      <div
        style={{
          position: "absolute",
          left: width * 0.18,
          top: height * 0.7,
          width: width * 0.64,
          height: 16,
          borderRadius: 8,
          background: "#5a1020",
        }}
      />
    </div>
  );
};
