import React from "react";
import { fonts } from "../../theme";

// A classic balance scale drawn in the 1080 × 900 stage. `angle` in degrees,
// positive = right pan down. Pans hang level from the beam ends; whatever
// sits on a pan is passed as left/right and placed bottom-centre on the pan.

export const BEAM = 320;
export const HANG = 290;
export const PAN_W = 320;

export const panPos = (side: "left" | "right", angle: number, pivotY: number, pivotX = 540) => {
  const a = (angle * Math.PI) / 180;
  const s = side === "right" ? 1 : -1;
  const x = pivotX + s * BEAM * Math.cos(a);
  const y = pivotY + s * BEAM * Math.sin(a);
  return { x, y: y + HANG };
};

export const Scale: React.FC<{
  angle: number;
  pivotY?: number;
  line: string;
  pan: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  baseY?: number;
}> = ({ angle, pivotY = 200, line, pan, left, right, baseY = 880 }) => {
  const L = panPos("left", angle, pivotY);
  const R = panPos("right", angle, pivotY);
  const a = (angle * Math.PI) / 180;
  const ends = [
    { x: 540 - BEAM * Math.cos(a), y: pivotY - BEAM * Math.sin(a) },
    { x: 540 + BEAM * Math.cos(a), y: pivotY + BEAM * Math.sin(a) },
  ];
  const panPath = (x: number, y: number) =>
    `M${x - PAN_W / 2},${y} Q${x},${y + 70} ${x + PAN_W / 2},${y} Z`;

  return (
    <>
      <svg width={1080} height={900} viewBox="0 0 1080 900" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* pillar and foot */}
        <rect x={530} y={pivotY} width={20} height={baseY - pivotY} rx={10} fill={line} />
        <rect x={400} y={baseY - 8} width={280} height={30} rx={15} fill={line} />
        {/* strings */}
        {[L, R].map((p, i) => (
          <g key={i} stroke={line} strokeWidth={5} strokeLinecap="round">
            <line x1={ends[i].x} y1={ends[i].y} x2={p.x - PAN_W / 2 + 10} y2={p.y} />
            <line x1={ends[i].x} y1={ends[i].y} x2={p.x + PAN_W / 2 - 10} y2={p.y} />
          </g>
        ))}
        {/* beam */}
        <g transform={`rotate(${angle} 540 ${pivotY})`}>
          <rect x={540 - BEAM - 14} y={pivotY - 11} width={BEAM * 2 + 28} height={22} rx={11} fill={line} />
        </g>
        <circle cx={540} cy={pivotY} r={22} fill={pan} stroke={line} strokeWidth={8} />
        {/* pans */}
        {[L, R].map((p, i) => (
          <path key={i} d={panPath(p.x, p.y)} fill={pan} stroke={line} strokeWidth={6} strokeLinejoin="round" />
        ))}
      </svg>
      {[{ p: L, n: left }, { p: R, n: right }].map(({ p, n }, i) =>
        n ? (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y + 4, width: 0, height: 0 }}>
            <div style={{ position: "absolute", left: 0, bottom: 0, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {n}
            </div>
          </div>
        ) : null,
      )}
    </>
  );
};

/** Small bill card that fits on a pan. */
export const MiniBill: React.FC<{
  sender: string;
  amount: string;
  stamp?: string;
  stampIn?: number;
  alert: string;
  faded?: number;
  style?: React.CSSProperties;
}> = ({ sender, amount, stamp, stampIn = 0, alert, faded = 0, style }) => (
  <div
    style={{
      position: "relative",
      width: 300,
      height: 178,
      borderRadius: 26,
      background: "#ffffff",
      boxShadow: "0 14px 40px rgba(0,20,120,0.18)",
      padding: "22px 24px",
      boxSizing: "border-box",
      fontFamily: fonts.ui,
      ...style,
    }}
  >
    <div style={{ fontSize: 29, color: "#8a8a96", fontWeight: 500, opacity: 1 - faded * 0.5 }}>{sender}</div>
    <div style={{ fontFamily: fonts.display, fontSize: 70, fontWeight: 600, letterSpacing: "-0.04em", color: "#111114", marginTop: 10, opacity: 1 - faded * 0.6 }}>
      {amount}
    </div>
    {stamp && stampIn > 0 ? (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%,-50%) rotate(-12deg) scale(${2.2 - 1.2 * Math.min(1, stampIn)})`,
          opacity: Math.min(1, stampIn * 2),
          border: `5px solid ${alert}`,
          color: alert,
          borderRadius: 14,
          padding: "4px 16px",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 46,
          letterSpacing: "-0.03em",
          background: "rgba(255,255,255,0.9)",
          whiteSpace: "nowrap",
        }}
      >
        {stamp}
      </div>
    ) : null}
  </div>
);

/** Heavy weight with a handle, label on the front. */
export const Weight: React.FC<{ label: string; fill: string; text: string; style?: React.CSSProperties }> = ({ label, fill, text, style }) => (
  <div style={{ position: "relative", width: 276, height: 228, ...style }}>
    <svg width={276} height={228} viewBox="0 0 230 190" style={{ position: "absolute", inset: 0 }}>
      <path d="M85,48 C85,8 145,8 145,48" fill="none" stroke={fill} strokeWidth={18} strokeLinecap="round" />
      <path d="M40,48 L190,48 L226,182 Q228,190 218,190 L12,190 Q2,190 4,182 Z" fill={fill} />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 92,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: 90,
        letterSpacing: "-0.05em",
        color: text,
      }}
    >
      {label}
    </div>
  </div>
);

/** Price tag on a string, as worn by Buddy. */
export const PriceTag: React.FC<{ price: string; per: string; fill: string; text: string; style?: React.CSSProperties }> = ({ price, per, fill, text, style }) => (
  <div
    style={{
      position: "relative",
      padding: "12px 26px 12px 44px",
      background: fill,
      color: text,
      borderRadius: "14px 20px 20px 14px",
      clipPath: "polygon(22px 0, 100% 0, 100% 100%, 22px 100%, 0 50%)",
      fontFamily: fonts.display,
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      ...style,
    }}
  >
    <div style={{ position: "absolute", left: 16, top: "50%", width: 14, height: 14, marginTop: -7, borderRadius: 7, background: "rgba(0,0,0,0.25)" }} />
    <div style={{ fontSize: 74, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>{price}</div>
    <div style={{ fontSize: 30, fontWeight: 500, marginTop: 4 }}>{per}</div>
  </div>
);
