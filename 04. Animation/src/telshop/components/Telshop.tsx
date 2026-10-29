import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Building blocks of the TV-shop parody (concept 28).

/** Star outline in a box of `size` px. */
const starPoints = (size: number, points: number, spike: number) => {
  const c = size / 2;
  const outer = c;
  const inner = c / spike;
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${(c + Math.cos(a) * r).toFixed(1)},${(c + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(" ");
};

/** Yellow price-sticker starburst with text. `t` 0..1 pops it in. */
export const Starburst: React.FC<{
  text: string;
  size: number;
  t: number;
  rotate?: number;
  fill?: string;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ text, size, t, rotate = -10, fill, color, fontSize, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        transform: `rotate(${rotate + (1 - t) * -40}deg) scale(${t})`,
        opacity: Math.min(1, t * 3),
        ...style,
      }}
    >
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <polygon
          points={starPoints(size, 16, 1.22)}
          fill={fill ?? p.yellow}
          stroke={p.ink}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          whiteSpace: "pre-line",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: fontSize ?? size * 0.15,
          lineHeight: 1.0,
          letterSpacing: "-0.04em",
          color: color ?? p.ink,
          padding: size * 0.14,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const ENVELOPE_W = 360;
export const ENVELOPE_H = 220;

/** Envelope with a label. Grey by default (the black-and-white "before"). */
export const Envelope: React.FC<{
  label: string;
  fill?: string;
  line?: string;
  ink?: string;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
}> = ({ label, fill = "#d9d9de", line = "#9a9aa3", ink = "#3a3a40", w = ENVELOPE_W, h = ENVELOPE_H, style }) => (
  <div style={{ position: "absolute", width: w, height: h, ...style }}>
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <rect x={3} y={3} width={w - 6} height={h - 6} rx={18} fill={fill} stroke={line} strokeWidth={5} />
      <path d={`M10 14 L${w / 2} ${h * 0.55} L${w - 10} 14`} fill="none" stroke={line} strokeWidth={5} strokeLinejoin="round" />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: h * 0.1,
        textAlign: "center",
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: h * 0.2,
        letterSpacing: "0.02em",
        color: ink,
      }}
    >
      {label}
    </div>
  </div>
);

/** Black-and-white TV look: scanlines + vignette + a bit of grain. */
export const TvOverlay: React.FC<{ frame: number; strength?: number }> = ({ frame, strength = 1 }) => {
  const jitter = (frame * 37) % 5;
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 2px, transparent 2px, transparent 6px)",
          backgroundPosition: `0 ${jitter}px`,
          opacity: strength,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)",
          opacity: strength,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

/** Little "● NAGESPEELD" chip, like the small print in a commercial. */
export const ReenactedChip: React.FC<{ text: string; frame: number; style?: React.CSSProperties }> = ({ text, frame, style }) => (
  <div
    style={{
      position: "absolute",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 22px",
      borderRadius: 30,
      background: "rgba(40,40,46,0.85)",
      color: "#f2f2f4",
      fontFamily: fonts.ui,
      fontWeight: 600,
      fontSize: 28,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      ...style,
    }}
  >
    <div style={{ width: 16, height: 16, borderRadius: 8, background: "#f2f2f4", opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0.25 }} />
    {text}
  </div>
);

/** Four-point "ting" sparkle. */
export const Sparkle: React.FC<{ size: number; t: number; color: string; style?: React.CSSProperties }> = ({ size, t, color, style }) => {
  // t 0..1: grows and fades out.
  const s = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
  const c = size / 2;
  const k = size * 0.12;
  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", transform: `scale(${s}) rotate(${t * 60}deg)`, opacity: s, ...style }}
    >
      <path d={`M${c} 0 Q${c + k} ${c - k} ${size} ${c} Q${c + k} ${c + k} ${c} ${size} Q${c - k} ${c + k} 0 ${c} Q${c - k} ${c - k} ${c} 0Z`} fill={color} />
    </svg>
  );
};

/** Display turntable (ellipse disc on a foot) seen at an angle. */
export const Turntable: React.FC<{ w: number; spin: number; style?: React.CSSProperties }> = ({ w, spin, style }) => {
  const p = usePalette();
  const h = w * 0.26;
  const marks = 10;
  return (
    <div style={{ position: "absolute", width: w, height: h + 60, ...style }}>
      <svg width={w} height={h + 60} style={{ overflow: "visible" }}>
        <rect x={w * 0.32} y={h * 0.5} width={w * 0.36} height={60 + h * 0.3} rx={14} fill={p.blueMid} />
        <ellipse cx={w / 2} cy={h / 2 + 16} rx={w / 2} ry={h / 2} fill={p.blueMascot} />
        <ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill={p.white} />
        {Array.from({ length: marks }).map((_, i) => {
          const a = (i / marks) * Math.PI * 2 + spin;
          const x = w / 2 + Math.cos(a) * w * 0.42;
          const y = h / 2 + Math.sin(a) * h * 0.42;
          return <circle key={i} cx={x} cy={y} r={7} fill={p.blueSoft} opacity={Math.sin(a) > 0 ? 1 : 0.5} />;
        })}
      </svg>
    </div>
  );
};

export const MAILCARD_W = 760;
export const MAILCARD_H = 390;

/** The bill mail in the demo, with a forward button that turns into "Doorgestuurd". */
export const DemoMail: React.FC<{
  sender: string;
  subject: string;
  forward: string;
  forwarded: string;
  toLabel: string;
  address: string;
  /** 0 = button, 1 = forwarded */
  done: number;
  press: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, forward, forwarded, toLabel, address, done, press, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: MAILCARD_W,
        height: MAILCARD_H,
        borderRadius: 40,
        background: p.white,
        boxShadow: "0 30px 70px rgba(0, 20, 120, 0.35)",
        fontFamily: fonts.ui,
        padding: "34px 40px",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: p.grey, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 30, color: p.blue }}>
          {sender.slice(0, 1)}
        </div>
        <div>
          <div style={{ fontSize: 42, fontWeight: 600, color: p.ink }}>{sender}</div>
          <div style={{ fontSize: 34, color: p.greyText, marginTop: 2 }}>{subject}</div>
        </div>
      </div>
      <div style={{ marginTop: 24, height: 14, width: "86%", borderRadius: 7, background: p.grey }} />
      <div style={{ marginTop: 12, height: 14, width: "64%", borderRadius: 7, background: p.grey }} />
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 34, height: 104 }}>
        {/* Forward button */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 42,
            background: p.blue,
            color: p.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            fontSize: 40,
            fontWeight: 600,
            opacity: 1 - done,
            transform: `scale(${press})`,
          }}
        >
          {forward}
          <svg width={34} height={34} viewBox="0 0 32 32">
            <path d="M18 7l9 8-9 8M27 15H13a8 8 0 0 0-8 8v2" fill="none" stroke={p.white} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Forwarded state */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 42,
            background: p.grey,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: done,
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 600, color: p.blue }}>{forwarded} ✓</div>
          <div style={{ fontSize: 30, color: p.ink, marginTop: 2 }}>
            {toLabel}: {address}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Small value chip on blue. */
export const Chip: React.FC<{ text: string; t: number; style?: React.CSSProperties }> = ({ text, t, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        padding: "16px 30px",
        borderRadius: 40,
        background: p.blueSoft,
        color: p.blue,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: 38,
        whiteSpace: "nowrap",
        transform: `scale(${t})`,
        opacity: Math.min(1, t * 2),
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const CAL_W = 660;
export const CAL_H = 590;

/** Month calendar card; marks two mail days and circles the due day. */
export const CalendarCard: React.FC<{
  month: string;
  mailDays: number[];
  dueDay: number;
  /** pop progress per mark: [mail1, mail2, due] */
  marks: number[];
  /** First weekday offset (0 = Monday). */
  offset?: number;
  style?: React.CSSProperties;
}> = ({ month, mailDays, dueDay, marks, offset = 6, style }) => {
  const p = usePalette();
  const days = 30;
  const cell = (CAL_W - 60) / 7;
  const rowH = 72;
  const top = 146;
  const pos = (d: number) => {
    const i = d - 1 + offset;
    return { x: 30 + (i % 7) * cell, y: top + Math.floor(i / 7) * rowH };
  };
  return (
    <div
      style={{
        position: "absolute",
        width: CAL_W,
        height: CAL_H,
        borderRadius: 40,
        background: p.white,
        boxShadow: "0 24px 60px rgba(1, 30, 140, 0.16)",
        fontFamily: fonts.ui,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ height: 80, background: p.blue, color: p.white, display: "flex", alignItems: "center", paddingLeft: 36, fontSize: 36, fontWeight: 600, letterSpacing: "0.02em" }}>
        {month}
      </div>
      <div style={{ position: "absolute", top: 92, left: 30, right: 30, display: "flex" }}>
        {["ma", "di", "wo", "do", "vr", "za", "zo"].map((d) => (
          <div key={d} style={{ width: cell, textAlign: "center", fontSize: 22, color: p.greyText, letterSpacing: "0.06em" }}>
            {d}
          </div>
        ))}
      </div>
      {Array.from({ length: days }).map((_, k) => {
        const d = k + 1;
        const { x, y } = pos(d);
        const mi = mailDays.indexOf(d);
        const isDue = d === dueDay;
        const m = mi >= 0 ? marks[mi] : isDue ? marks[2] : 0;
        return (
          <div key={d} style={{ position: "absolute", left: x, top: y, width: cell, height: rowH, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isDue ? (
              <div style={{ position: "absolute", width: 64, height: 64, borderRadius: 32, background: p.blue, transform: `scale(${m})` }} />
            ) : null}
            {mi >= 0 ? (
              <div style={{ position: "absolute", width: 64, height: 64, borderRadius: 32, border: `4px solid ${p.yellow}`, background: "rgba(255,206,49,0.25)", transform: `scale(${m})`, boxSizing: "border-box" }} />
            ) : null}
            <span style={{ position: "relative", fontSize: 32, fontWeight: isDue || mi >= 0 ? 700 : 450, color: isDue && m > 0.5 ? p.white : p.ink }}>{d}</span>
          </div>
        );
      })}
    </div>
  );
};

/** Yellow infomercial bar "BEL NU!" with phone icon; `strike` 0..1 draws a red line through it. */
export const CallBar: React.FC<{ text: string; strike: number; w: number; style?: React.CSSProperties }> = ({ text, strike, w, style }) => {
  const p = usePalette();
  const h = 120;
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          background: p.yellow,
          border: `5px solid ${p.ink}`,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 66,
          letterSpacing: "-0.03em",
          color: p.ink,
          textTransform: "uppercase",
          filter: strike > 0.99 ? "saturate(0.55)" : undefined,
        }}
      >
        <svg width={62} height={62} viewBox="0 0 24 24">
          <path
            d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
            fill={p.ink}
          />
        </svg>
        {text}
      </div>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line
          x1={-20}
          y1={h * 0.78}
          x2={-20 + (w + 40) * strike}
          y2={h * 0.78 - (h * 0.56) * strike}
          stroke={p.red}
          strokeWidth={16}
          strokeLinecap="round"
          opacity={strike > 0 ? 1 : 0}
        />
      </svg>
    </div>
  );
};
