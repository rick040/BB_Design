import React from "react";

// A generic folding pocket knife, drawn in stage coordinates.
// Two tools fold out of the handle: tool A pivots on the left rivet,
// tool B on the right rivet. 0 = folded behind the handle, 1 = open.

export const KNIFE = {
  handleW: 720,
  handleH: 190,
  len: 440,
  thick: 146,
  openAngle: 128,
} as const;

export const MailIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block" }}>
    <rect x="5" y="11" width="38" height="27" rx="5" fill="none" stroke={color} strokeWidth="4" />
    <path d="M7 14l17 13 17-13" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

export const CalendarIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block" }}>
    <rect x="6" y="10" width="36" height="32" rx="5" fill="none" stroke={color} strokeWidth="4" />
    <path d="M6 19h36M16 5v9M32 5v9" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <rect x="25" y="26" width="9" height="8" rx="2" fill={color} />
  </svg>
);

const Blade: React.FC<{ len: number; thick: number; id: string; mirror?: boolean }> = ({ len, thick, id, mirror }) => {
  const r = thick / 2;
  const d = `M ${r} 0 H ${len * 0.8} L ${len} ${thick * 0.42} Q ${len * 0.9} ${thick} ${len * 0.72} ${thick} H ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  return (
    <svg
      width={len}
      height={thick}
      viewBox={`0 0 ${len} ${thick}`}
      style={{ display: "block", overflow: "visible", transform: mirror ? "scaleX(-1)" : undefined }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f7fb" />
          <stop offset="0.55" stopColor="#dfe5ee" />
          <stop offset="1" stopColor="#c3ccd9" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} stroke="#aeb8c7" strokeWidth={3} />
      <path d={`M ${r} ${thick * 0.2} H ${len * 0.76}`} stroke="#ffffff" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
    </svg>
  );
};

export const Knife: React.FC<{
  cx: number;
  cy: number;
  handleColor: string;
  rivetColor: string;
  openA: number;
  openB: number;
  iconColor: string;
  /** Extra transform on the whole knife (e.g. a click-shut squash). */
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ cx, cy, handleColor, rivetColor, openA, openB, iconColor, style, children }) => {
  const { handleW, handleH, len, thick, openAngle } = KNIFE;
  const pivotInset = handleH / 2;
  const pa = { x: cx - handleW / 2 + pivotInset, y: cy };
  const pb = { x: cx + handleW / 2 - pivotInset, y: cy };
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const aRot = -openAngle * openA;
  const bRot = openAngle * openB;

  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {/* tool A (left rivet) */}
      <div
        style={{
          position: "absolute",
          left: pa.x - thick / 2,
          top: pa.y - thick / 2,
          width: len,
          height: thick,
          transformOrigin: `${thick / 2}px 50%`,
          transform: `rotate(${aRot}deg)`,
          opacity: openA > 0.01 ? 1 : 0,
        }}
      >
        <Blade len={len} thick={thick} id={`a${id}`} />
        <div
          style={{
            position: "absolute",
            left: len * 0.6 - 40,
            top: thick / 2 - 40,
            transform: `rotate(${-aRot}deg)`,
          }}
        >
          <MailIcon size={80} color={iconColor} />
        </div>
      </div>
      {/* tool B (right rivet) */}
      <div
        style={{
          position: "absolute",
          left: pb.x + thick / 2 - len,
          top: pb.y - thick / 2,
          width: len,
          height: thick,
          transformOrigin: `${len - thick / 2}px 50%`,
          transform: `rotate(${bRot}deg)`,
          opacity: openB > 0.01 ? 1 : 0,
        }}
      >
        <Blade len={len} thick={thick} id={`b${id}`} mirror />
        <div
          style={{
            position: "absolute",
            left: len * 0.4 - 40,
            top: thick / 2 - 40,
            transform: `rotate(${-bRot}deg)`,
          }}
        >
          <CalendarIcon size={80} color={iconColor} />
        </div>
      </div>
      {/* handle */}
      <div
        style={{
          position: "absolute",
          left: cx - handleW / 2,
          top: cy - handleH / 2,
          width: handleW,
          height: handleH,
          borderRadius: handleH / 2,
          background: handleColor,
          boxShadow: "0 24px 60px rgba(0, 20, 120, 0.25), inset 0 -10px 0 rgba(0,0,0,0.06)",
        }}
      />
      {[pa, pb].map((pt, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pt.x - 18,
            top: pt.y - 18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: rivetColor,
            boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.12)",
          }}
        />
      ))}
      {children}
    </div>
  );
};

/** Where a tool's icon sits (stage coords) when open, for things that fly to it. */
export const toolTip = (cx: number, cy: number, tool: "A" | "B", along = 0.6) => {
  const { handleW, handleH, len, thick, openAngle } = KNIFE;
  const r = (openAngle * Math.PI) / 180;
  const d = len * along - thick / 2 + 0;
  if (tool === "A") {
    const p = { x: cx - handleW / 2 + handleH / 2, y: cy };
    return { x: p.x + Math.cos(-r) * (d + 0), y: p.y + Math.sin(-r) * d };
  }
  const p = { x: cx + handleW / 2 - handleH / 2, y: cy };
  return { x: p.x - Math.cos(-r) * d, y: p.y + Math.sin(-r) * d };
};
