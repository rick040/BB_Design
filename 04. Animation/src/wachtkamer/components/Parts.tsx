import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

export const NOTA_W = 290;
export const NOTA_H = 360;

/** A medical bill as a tall card: initial, sender, subject, amount and due chip. */
export const NotaCard: React.FC<{
  sender: string;
  subject: string;
  amount: string;
  due: string;
  urgent?: boolean;
  /** 0..1, highlights the due chip as "read" by Buddy. */
  read?: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, amount, due, urgent = false, read = 0, style }) => {
  const p = usePalette();
  const chipBg = urgent ? p.red : read > 0 ? p.yellow : p.grey;
  const chipFg = urgent ? "#fff" : read > 0 ? p.ink : "#6b6b78";
  return (
    <div
      style={{
        width: NOTA_W,
        height: NOTA_H,
        borderRadius: 40,
        background: p.white,
        boxShadow: "0 26px 70px rgba(1, 40, 160, 0.16)",
        padding: "30px 28px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        ...style,
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
          fontSize: 34,
          fontWeight: 600,
          color: p.blueMid,
        }}
      >
        {sender[0]}
      </div>
      <div style={{ fontSize: 31, fontWeight: 600, color: p.ink, marginTop: 18, whiteSpace: "nowrap" }}>{sender}</div>
      <div style={{ fontSize: 25, color: p.greyText, marginTop: 2, whiteSpace: "nowrap" }}>{subject}</div>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 54,
          letterSpacing: headlineTracking,
          color: p.ink,
          marginTop: "auto",
        }}
      >
        {amount}
      </div>
      <div
        style={{
          marginTop: 12,
          alignSelf: "flex-start",
          background: chipBg,
          color: chipFg,
          fontSize: 25,
          fontWeight: 600,
          padding: "8px 18px",
          borderRadius: 30,
          transform: `scale(${1 + 0.12 * Math.sin(Math.PI * Math.min(1, read))})`,
          transformOrigin: "0% 50%",
          whiteSpace: "nowrap",
        }}
      >
        {due}
      </div>
    </div>
  );
};

/** Waiting-room chair (seat + legs), drawn on its own top-left. */
export const Chair: React.FC<{ width: number; color: string; style?: React.CSSProperties }> = ({ width, color, style }) => (
  <svg width={width} height={width * 0.42} viewBox="0 0 100 42" style={{ display: "block", ...style }}>
    <rect x="4" y="0" width="92" height="12" rx="6" fill={color} />
    <rect x="14" y="12" width="6" height="30" rx="3" fill={color} />
    <rect x="80" y="12" width="6" height="30" rx="3" fill={color} />
  </svg>
);

/** "Now serving" board with a label and a big line of text. */
export const Board: React.FC<{
  width: number;
  label: string;
  children: React.ReactNode;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ width, label, children, glow = 0, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width,
        borderRadius: 34,
        background: "#0d1033",
        padding: "22px 30px 26px",
        boxSizing: "border-box",
        boxShadow: `0 24px 60px rgba(1, 20, 90, 0.28), 0 0 ${60 * glow}px ${18 * glow}px rgba(255, 206, 49, ${0.55 * glow})`,
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: p.blueText,
          textAlign: "center",
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
};

/** One split-flap tile with a character, mid-flip when flip in (0,1). */
export const FlapTile: React.FC<{ char: string; prev: string; flip: number; w: number; h: number }> = ({
  char,
  prev,
  flip,
  w,
  h,
}) => {
  const p = usePalette();
  const showing = flip >= 0.5 ? char : prev;
  const angle = flip > 0 && flip < 1 ? (flip < 0.5 ? flip * 180 : (flip - 1) * 180) : 0;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 8,
        background: "#1b2050",
        color: p.yellow,
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: h * 0.72,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transform: `perspective(400px) rotateX(${angle}deg)`,
        overflow: "hidden",
      }}
    >
      {showing === " " ? "" : showing}
      <div style={{ position: "absolute", left: 0, right: 0, top: h / 2 - 1, height: 2, background: "#0d1033" }} />
    </div>
  );
};

/** A row of split-flap tiles; tiles flip one after another from `start`. */
export const FlapRow: React.FC<{
  text: string;
  prev: string;
  frame: number;
  start: number;
  per?: number;
  len?: number;
  tileW: number;
  tileH: number;
}> = ({ text, prev, frame, start, per = 1.2, len = 6, tileW, tileH }) => {
  const n = Math.max(text.length, prev.length);
  const a = text.padEnd(n, " ");
  const b = prev.padEnd(n, " ");
  return (
    <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
      {a.split("").map((c, i) => {
        const f = Math.max(0, Math.min(1, (frame - start - i * per) / len));
        return <FlapTile key={i} char={c} prev={b[i]} flip={f} w={tileW} h={tileH} />;
      })}
    </div>
  );
};

/** Queue-ticket machine: a rounded box with a red dome and a slot. */
export const TicketMachine: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => {
  const p = usePalette();
  const h = width * 1.15;
  return (
    <div style={{ width, height: h, position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          left: width * 0.3,
          width: width * 0.4,
          top: 0,
          height: width * 0.22,
          borderRadius: `${width}px ${width}px 0 0`,
          background: p.red,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: width * 0.2,
          bottom: 0,
          borderRadius: width * 0.16,
          background: p.white,
          boxShadow: "0 24px 60px rgba(0, 20, 120, 0.28)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.18,
          right: width * 0.18,
          top: width * 0.42,
          height: width * 0.3,
          borderRadius: width * 0.06,
          background: "#0d1033",
          color: p.yellow,
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: width * 0.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        nr
      </div>
      <div
        style={{
          position: "absolute",
          left: width * 0.22,
          right: width * 0.22,
          bottom: width * 0.12,
          height: 12,
          borderRadius: 6,
          background: p.ink,
        }}
      />
    </div>
  );
};

/** Yellow queue ticket with a perforated top edge. */
export const Ticket: React.FC<{
  width: number;
  height: number;
  top: string;
  big: string;
  style?: React.CSSProperties;
}> = ({ width, height, top, big, style }) => {
  const p = usePalette();
  const teeth = 9;
  const pts: string[] = [];
  for (let i = 0; i <= teeth * 2; i++) pts.push(`${(i / (teeth * 2)) * 100}% ${i % 2 === 0 ? 0 : 6}%`);
  const clip = `polygon(${pts.join(", ")}, 100% 100%, 0% 100%)`;
  return (
    <div
      style={{
        width,
        height,
        background: p.yellow,
        clipPath: clip,
        borderRadius: `0 0 ${width * 0.08}px ${width * 0.08}px`,
        fontFamily: fonts.ui,
        color: p.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        paddingTop: height * 0.08,
        ...style,
      }}
    >
      <div style={{ fontSize: height * 0.2, fontWeight: 600, opacity: 0.7, whiteSpace: "nowrap" }}>{top}</div>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: height * 0.28,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {big}
      </div>
    </div>
  );
};

/** Round call button on a short pedestal ("ding"). */
export const CallButton: React.FC<{ size: number; press: number; style?: React.CSSProperties }> = ({
  size,
  press,
  style,
}) => {
  const p = usePalette();
  return (
    <div style={{ width: size, height: size * 0.8, position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          left: size * 0.2,
          right: size * 0.2,
          top: size * 0.22 + press * size * 0.08,
          height: size * 0.22,
          borderRadius: `${size}px ${size}px 0 0`,
          background: p.red,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: size * 0.42,
          bottom: 0,
          borderRadius: size * 0.12,
          background: "#0d1033",
        }}
      />
    </div>
  );
};

/** Agenda event card: date tile, bell, title and note. */
export const AgendaCard: React.FC<{
  day: string;
  month: string;
  title: string;
  note: string;
  bell: number;
  style?: React.CSSProperties;
}> = ({ day, month, title, note, bell, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: 860,
        height: 200,
        borderRadius: 44,
        background: p.white,
        boxShadow: "0 26px 70px rgba(1, 40, 160, 0.16)",
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "0 36px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          width: 130,
          height: 136,
          borderRadius: 26,
          background: p.blueMid,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 600, opacity: 0.8 }}>{month}</div>
        <div style={{ fontFamily: fonts.display, fontSize: 50, fontWeight: 600, letterSpacing: "-0.04em" }}>{day}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 36, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: 28, color: p.greyText, marginTop: 6 }}>{note}</div>
      </div>
      <svg
        width={64}
        height={64}
        viewBox="0 0 32 32"
        style={{ transform: `rotate(${Math.sin(bell * Math.PI * 6) * 18 * (1 - bell)}deg)`, flexShrink: 0 }}
      >
        <path
          d="M16 4c-5 0-8 3.6-8 8.5v6L5 22v1.5h22V22l-3-3.5v-6C24 7.6 21 4 16 4z"
          fill={p.yellow}
        />
        <circle cx="16" cy="26.5" r="3" fill={p.yellow} />
      </svg>
    </div>
  );
};
