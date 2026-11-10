import React from "react";
import { interpolateColors } from "remotion";
import { fonts } from "../../theme";

// A mug of tea with a teabag in it. Everything is drawn in the mug's own
// box (w × h, origin top-left of the cup body). The tea colour goes from
// `fresh` to `bitter` with `steep` (0..1), and a darker cloud spreads out of
// the bag while it steeps. Coordinates outside the box (tag, string, steam)
// overflow visibly.
export const MUG_W = 420;
export const MUG_H = 360;

export const Mug: React.FC<{
  steep: number;
  fresh: string;
  bitter: string;
  cup: string;
  outline: string;
  /** Show the teabag in the tea. */
  bag?: boolean;
  /** Tag text (two lines) hanging over the right rim; omit for none. */
  tag?: { line1: string; line2: string; red?: boolean; redColor?: string };
  /** 0..1 steam opacity; steamPhase drives the wobble. */
  steam?: number;
  steamPhase?: number;
  steamColor?: string;
  scale?: number;
  style?: React.CSSProperties;
}> = ({
  steep,
  fresh,
  bitter,
  cup,
  outline,
  bag = true,
  tag,
  steam = 0,
  steamPhase = 0,
  steamColor = "#b9c6dd",
  scale = 1,
  style,
}) => {
  const tea = interpolateColors(steep, [0, 1], [fresh, bitter]);
  const cloud = interpolateColors(Math.min(1, steep + 0.35), [0, 1], [fresh, bitter]);
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const W = MUG_W;
  const H = MUG_H;
  const surfaceY = 58;
  const bagX = W * 0.56;
  const bagY = 120;
  const cloudR = 60 + steep * 200;
  const steamPath = (x: number, k: number) => {
    const w = Math.sin(steamPhase / 6 + k) * 14;
    return `M ${x} -20 C ${x + 26 + w} -60, ${x - 26 - w} -100, ${x + w * 0.5} -150`;
  };
  return (
    <div style={{ position: "absolute", width: W, height: H, transform: `scale(${scale})`, transformOrigin: "50% 100%", ...style }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", display: "block" }}>
        <defs>
          <clipPath id={`tea-${id}`}>
            <path d={`M 22 ${surfaceY} L ${W - 22} ${surfaceY} L ${W - 40} ${H - 60} Q ${W - 46} ${H - 22} ${W - 90} ${H - 22} L 90 ${H - 22} Q 46 ${H - 22} 40 ${H - 60} Z`} />
          </clipPath>
          <radialGradient id={`cloud-${id}`}>
            <stop offset="0%" stopColor={cloud} stopOpacity={0.95} />
            <stop offset="70%" stopColor={cloud} stopOpacity={0.45} />
            <stop offset="100%" stopColor={cloud} stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* steam */}
        {steam > 0
          ? [0.32, 0.5, 0.68].map((fx, k) => (
              <path
                key={k}
                d={steamPath(W * fx, k * 2)}
                fill="none"
                stroke={steamColor}
                strokeWidth={14}
                strokeLinecap="round"
                opacity={steam * (0.55 + 0.25 * Math.sin(steamPhase / 9 + k))}
                transform={`translate(0 ${-((steamPhase * 1.2 + k * 20) % 30)})`}
              />
            ))
          : null}
        {/* handle */}
        <path
          d={`M ${W - 30} 110 C ${W + 70} 100, ${W + 80} 250, ${W - 52} 250`}
          fill="none"
          stroke={outline}
          strokeWidth={30}
          strokeLinecap="round"
        />
        <path
          d={`M ${W - 30} 110 C ${W + 70} 100, ${W + 80} 250, ${W - 52} 250`}
          fill="none"
          stroke={cup}
          strokeWidth={14}
          strokeLinecap="round"
        />
        {/* cup body */}
        <path
          d={`M 10 30 L ${W - 10} 30 L ${W - 36} ${H - 54} Q ${W - 44} ${H - 6} ${W - 96} ${H - 6} L 96 ${H - 6} Q 44 ${H - 6} 36 ${H - 54} Z`}
          fill={cup}
          stroke={outline}
          strokeWidth={12}
          strokeLinejoin="round"
        />
        {/* tea */}
        <g clipPath={`url(#tea-${id})`}>
          <rect x={0} y={surfaceY} width={W} height={H} fill={tea} />
          {bag ? <circle cx={bagX} cy={bagY + 40} r={cloudR} fill={`url(#cloud-${id})`} /> : null}
          {bag ? (
            <g>
              <rect x={bagX - 48} y={bagY - 10} width={96} height={118} rx={14} fill="#f4ead8" opacity={0.55} />
              <rect x={bagX - 48} y={bagY - 10} width={96} height={118} rx={14} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={4} strokeDasharray="8 8" />
            </g>
          ) : null}
        </g>
        <ellipse cx={W / 2} cy={surfaceY} rx={W / 2 - 22} ry={14} fill={tea} />
        <ellipse cx={W / 2} cy={surfaceY} rx={W / 2 - 22} ry={14} fill="#ffffff" opacity={0.12} />
        <path d={`M 10 30 L ${W - 10} 30`} stroke={outline} strokeWidth={12} strokeLinecap="round" />
        {/* string over the rim to the tag */}
        {bag && tag ? (
          <path
            d={`M ${bagX} ${bagY - 6} C ${bagX + 20} 20, ${W - 70} -10, ${W - 44} 30 L ${W - 10} 130`}
            fill="none"
            stroke="#c9b89a"
            strokeWidth={4}
          />
        ) : null}
      </svg>
      {bag && tag ? (
        <div
          style={{
            position: "absolute",
            left: W - 92,
            top: 130,
            width: 190,
            padding: "16px 14px",
            background: tag.red ? (tag.redColor ?? "#ff5a79") : "#ffffff",
            border: `5px solid ${tag.red ? (tag.redColor ?? "#ff5a79") : outline}`,
            borderRadius: 16,
            textAlign: "center",
            fontFamily: fonts.ui,
            color: tag.red ? "#ffffff" : outline,
            boxShadow: "0 12px 30px rgba(1,30,120,0.18)",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.1 }}>{tag.line1}</div>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6, lineHeight: 1.05 }}>{tag.line2}</div>
        </div>
      ) : null}
    </div>
  );
};

/** A loose teabag with its paper tag; used when Buddy lifts it out. */
export const TeaBag: React.FC<{ color: string; wet: string; size?: number; style?: React.CSSProperties }> = ({
  color,
  wet,
  size = 96,
  style,
}) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 96 120" style={{ overflow: "visible", display: "block", ...style }}>
    <rect x={2} y={2} width={92} height={116} rx={14} fill={color} />
    <rect x={2} y={60} width={92} height={58} rx={14} fill={wet} opacity={0.55} />
    <rect x={2} y={2} width={92} height={116} rx={14} fill="none" stroke="#c9b89a" strokeWidth={4} strokeDasharray="8 8" />
  </svg>
);
