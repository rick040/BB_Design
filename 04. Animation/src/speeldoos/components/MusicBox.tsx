import React from "react";

// The music box ("speeldoos"), front view, drawn in its own units.
// Box front is 500 × 240; the lid hinges on the back edge of the top.
// Place it with `style` (left/top = top-left of the box front).
export const BOX_W = 500;
export const BOX_H = 240;

export const MusicBox: React.FC<{
  /** 0 = closed, 1 = fully open. */
  lid: number;
  /** Crank angle in degrees. */
  crank: number;
  /** Cylinder rotation phase in px (pins slide left). */
  phase: number;
  body: string;
  face: string;
  inside: string;
  accent: string;
  /** Show the paper-strip slot on the left. */
  slot?: boolean;
  style?: React.CSSProperties;
}> = ({ lid, crank, phase, body, face, inside, accent, slot = true, style }) => {
  const lidH = 30 + 150 * lid; // visible height of the lid as it swings up
  const pins = Array.from({ length: 12 }, (_, i) => {
    const x = 70 + ((((i * 53 - phase) % 360) + 360) % 360);
    const y = -48 + (i % 3) * 14;
    return { x, y };
  });
  const a = (crank * Math.PI) / 180;
  const pivot = { x: BOX_W + 34, y: 120 };
  const knob = { x: pivot.x + 70 * Math.cos(a), y: pivot.y + 70 * Math.sin(a) };

  return (
    <svg
      width={BOX_W + 160}
      height={BOX_H + 260}
      viewBox={`-40 -220 ${BOX_W + 160} ${BOX_H + 260}`}
      style={{ position: "absolute", overflow: "visible", marginLeft: -40, marginTop: -220, ...style }}
    >
      {/* lid (behind the interior when open) */}
      <g>
        <rect x={6} y={-60 - lidH} width={BOX_W - 12} height={lidH} rx={22} fill={face} />
        <rect x={40} y={-60 - lidH + 22} width={BOX_W - 80} height={Math.max(0, lidH - 44)} rx={12} fill={body} opacity={0.18} />
      </g>
      {/* interior: cylinder with pins and the comb */}
      <rect x={0} y={-70} width={BOX_W} height={80} rx={18} fill={inside} />
      <rect x={60} y={-62} width={360} height={46} rx={23} fill="#d9e1ec" />
      <clipPath id="cyl">
        <rect x={60} y={-62} width={360} height={46} rx={23} />
      </clipPath>
      <g clipPath="url(#cyl)">
        {pins.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={5} fill="#8a94a6" />
        ))}
      </g>
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={80 + i * 24} y={-14} width={12} height={20 - (i % 4) * 3} rx={3} fill={accent} />
      ))}
      {/* front */}
      <rect x={0} y={0} width={BOX_W} height={BOX_H} rx={30} fill={body} />
      <rect x={26} y={26} width={BOX_W - 52} height={BOX_H - 52} rx={20} fill="none" stroke={face} strokeWidth={6} opacity={0.55} />
      {/* keyhole */}
      <circle cx={BOX_W / 2} cy={104} r={16} fill={face} />
      <path d={`M${BOX_W / 2 - 9} 112 L${BOX_W / 2 + 9} 112 L${BOX_W / 2 + 5} 146 L${BOX_W / 2 - 5} 146 Z`} fill={face} />
      {/* paper slot */}
      {slot ? <rect x={-6} y={150} width={46} height={64} rx={8} fill={inside} /> : null}
      {/* crank */}
      <rect x={BOX_W - 4} y={pivot.y - 8} width={pivot.x - BOX_W + 8} height={16} rx={6} fill={face} />
      <line x1={pivot.x} y1={pivot.y} x2={knob.x} y2={knob.y} stroke={face} strokeWidth={16} strokeLinecap="round" />
      <circle cx={pivot.x} cy={pivot.y} r={14} fill={face} />
      <circle cx={knob.x} cy={knob.y} r={20} fill={accent} />
    </svg>
  );
};

/** Crank knob position (box units) for a given crank angle, so Buddy can hold it. */
export const crankKnob = (crank: number) => {
  const a = (crank * Math.PI) / 180;
  return { x: BOX_W + 34 + 70 * Math.cos(a), y: 120 + 70 * Math.sin(a) };
};

/** An eighth note. */
export const Note: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ position: "absolute", overflow: "visible", ...style }}>
    <ellipse cx={13} cy={31} rx={9} ry={7} fill={color} transform="rotate(-20 13 31)" />
    <rect x={19} y={4} width={4} height={28} fill={color} />
    <path d="M21 4 C30 8 34 12 32 22 C30 16 27 13 21 12 Z" fill={color} />
  </svg>
);

/** The bill as a punched paper strip (like a music-box roll). */
export const PunchStrip: React.FC<{ width: number; color: string; hole: string; offset: number; style?: React.CSSProperties }> = ({
  width,
  color,
  hole,
  offset,
  style,
}) => {
  const holes = Array.from({ length: Math.ceil(width / 46) + 2 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", width, height: 56, background: color, borderRadius: 6, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,20,120,0.12)", ...style }}>
      {holes.map((i) => {
        const x = ((i * 46 + offset) % (holes.length * 46)) - 46;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x, top: (i * 7) % 3 === 0 ? 10 : 30, width: 16, height: 16, borderRadius: 4, background: hole }} />
            {i % 2 === 0 ? <div style={{ position: "absolute", left: x + 22, top: (i * 5) % 2 === 0 ? 30 : 10, width: 16, height: 16, borderRadius: 4, background: hole }} /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
