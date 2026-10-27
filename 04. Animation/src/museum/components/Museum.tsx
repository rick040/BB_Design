import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Museum pieces for concept 25: picture frame, wall plaque, the bill inside a
// frame, a ceiling spotlight cone and the velvet rope. All flat shapes in
// brand colours, text stays editable.

/** Black picture frame with a white mat; children are drawn on the mat. */
export const MuseumFrame: React.FC<{
  w: number;
  h: number;
  border?: number;
  mat?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, border = 16, mat = 26, children, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        boxSizing: "border-box",
        border: `${border}px solid ${p.ink}`,
        background: p.white,
        boxShadow: "0 22px 40px rgba(17,17,20,0.22)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: mat,
          background: "#f3f5f9",
          boxShadow: "inset 0 2px 6px rgba(17,17,20,0.18)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** The bill that hangs in a frame: sender, title, a few skeleton lines. */
export const ExhibitBill: React.FC<{
  sender: string;
  title: string;
  amount?: string;
  badge?: string;
  /** Red title + badge (the aanmaning). */
  urgent?: boolean;
  scale?: number;
}> = ({ sender, title, amount, badge, urgent = false, scale = 1 }) => {
  const p = usePalette();
  const s = scale;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: `${26 * s}px ${24 * s}px`,
        fontFamily: fonts.ui,
        display: "flex",
        flexDirection: "column",
        gap: 10 * s,
        background: p.white,
      }}
    >
      <div style={{ fontSize: 20 * s, color: p.greyText, fontWeight: 500 }}>{sender}</div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 40 * s,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: urgent ? p.red : p.ink,
        }}
      >
        {title}
      </div>
      {[0.9, 0.7, 0.8, 0.5].map((wf, i) => (
        <div key={i} style={{ height: 10 * s, width: `${wf * 100}%`, borderRadius: 5 * s, background: p.grey }} />
      ))}
      {amount ? (
        <div style={{ fontSize: 34 * s, fontWeight: 600, color: p.ink, marginTop: 6 * s }}>{amount}</div>
      ) : null}
      {badge ? (
        <div
          style={{
            alignSelf: "flex-start",
            marginTop: 6 * s,
            padding: `${6 * s}px ${14 * s}px`,
            borderRadius: 999,
            background: p.red,
            color: p.white,
            fontSize: 22 * s,
            fontWeight: 600,
          }}
        >
          {badge}
        </div>
      ) : null}
    </div>
  );
};

/** Small museum label: two lines, first one bold. */
export const Plaque: React.FC<{
  text: string;
  width: number;
  size?: number;
  /** Colour of the second line (e.g. red for the €40 line). */
  accent?: string;
  style?: React.CSSProperties;
}> = ({ text, width, size = 24, accent, style }) => {
  const p = usePalette();
  const [first, ...rest] = text.split("\n");
  return (
    <div
      style={{
        position: "absolute",
        width,
        boxSizing: "border-box",
        padding: `${size * 0.55}px ${size * 0.7}px`,
        background: p.white,
        borderRadius: 6,
        boxShadow: "0 6px 14px rgba(17,17,20,0.14)",
        fontFamily: fonts.ui,
        fontSize: size,
        lineHeight: 1.25,
        color: p.ink,
        textAlign: "left",
        ...style,
      }}
    >
      <div style={{ fontWeight: 600 }}>{first}</div>
      {rest.length ? <div style={{ color: accent ?? "#55555c" }}>{rest.join("\n")}</div> : null}
    </div>
  );
};

/** Ceiling spotlight: a soft cone from a lamp at (x, y) down to a width at depth h. */
export const SpotCone: React.FC<{
  x: number;
  y: number;
  h: number;
  spread: number;
  intensity: number;
  color?: string;
}> = ({ x, y, h, spread, intensity, color = "255,236,170" }) => {
  const p = usePalette();
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - spread,
          top: y,
          width: spread * 2,
          height: h,
          clipPath: "polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)",
          background: `linear-gradient(to bottom, rgba(${color},${0.55 * intensity}), rgba(${color},${0.08 * intensity}))`,
        }}
      />
      {/* lamp housing */}
      <div
        style={{
          position: "absolute",
          left: x - 34,
          top: y - 26,
          width: 68,
          height: 30,
          borderRadius: "10px 10px 22px 22px",
          background: p.ink,
        }}
      />
    </>
  );
};

/** Two brass posts with a sagging velvet rope; `sagExtra` lets it bounce. */
export const VelvetRope: React.FC<{
  x1: number;
  x2: number;
  top: number;
  postH: number;
  sag: number;
  post?: string;
  rope?: string;
}> = ({ x1, x2, top, postH, sag, post, rope }) => {
  const p = usePalette();
  const postColor = post ?? p.ink;
  const ropeColor = rope ?? p.red;
  const mid = (x1 + x2) / 2;
  const minX = x1 - 30;
  const w = x2 - x1 + 60;
  const h = postH + 40;
  return (
    <svg
      width={w}
      height={h + sag}
      viewBox={`${minX} ${top - 20} ${w} ${h + sag}`}
      style={{ position: "absolute", left: minX, top: top - 20, overflow: "visible" }}
    >
      <path
        d={`M ${x1} ${top + 14} Q ${mid} ${top + 14 + sag * 2} ${x2} ${top + 14}`}
        fill="none"
        stroke={ropeColor}
        strokeWidth={16}
        strokeLinecap="round"
      />
      {[x1, x2].map((x) => (
        <g key={x}>
          <rect x={x - 7} y={top} width={14} height={postH} rx={7} fill={postColor} />
          <circle cx={x} cy={top} r={15} fill={postColor} />
          <rect x={x - 32} y={top + postH - 8} width={64} height={14} rx={7} fill={postColor} />
        </g>
      ))}
    </svg>
  );
};

/** Point on the rope curve at fraction t (0..1), for hanging a sign on it. */
export const ropePoint = (x1: number, x2: number, top: number, sag: number, t: number) => {
  const mid = (x1 + x2) / 2;
  const y0 = top + 14;
  const cy = y0 + sag * 2;
  const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mid + t * t * x2;
  const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y0;
  return { x, y };
};

/** Buddy's torch: a small cylinder; rotate it via style. */
export const Torch: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const p = usePalette();
  return (
    <div style={{ position: "absolute", width: 86, height: 30, ...style }}>
      <div style={{ position: "absolute", left: 0, top: 4, width: 58, height: 22, borderRadius: 8, background: p.ink }} />
      <div style={{ position: "absolute", left: 54, top: 0, width: 32, height: 30, borderRadius: "4px 10px 10px 4px", background: p.yellow }} />
    </div>
  );
};
