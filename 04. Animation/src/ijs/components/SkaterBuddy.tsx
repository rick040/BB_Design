import React from "react";
import { Buddy, BUDDY_RATIO, BUDDY_VIEWBOX } from "../../components/Buddy";

// Buddy on ice skates with a knitted beanie (concept 61).
// The beanie is an `accessory` (clipped to his outline, follows squash);
// the blades are drawn under his feet, outside the mascot SVG.

const Beanie: React.FC<{ color: string; rib: string }> = ({ color, rib }) => {
  const { width } = BUDDY_VIEWBOX;
  return (
    <g>
      <rect x={-20} y={-20} width={width + 40} height={66} fill={color} />
      {/* turned-up rim */}
      <rect x={-20} y={30} width={width + 40} height={18} fill={rib} opacity={0.28} />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={i * 30 + 6} y={-20} width={8} height={50} fill={rib} opacity={0.16} />
      ))}
    </g>
  );
};

export const SkaterBuddy: React.FC<{
  size: number;
  /** feet position (left/bottom centre) in parent coordinates */
  x: number;
  feetY: number;
  body: string;
  eye: string;
  beanie: string;
  blade: string;
  blink?: number;
  look?: { x: number; y: number };
  squash?: number;
  /** lean in degrees (skating stroke / stop) */
  lean?: number;
  /** mirror horizontally (skating to the left) */
  flip?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ size, x, feetY, body, eye, beanie, blade, blink = 1, look, squash = 1, lean = 0, flip = false, opacity = 1, style }) => {
  const bladeH = size * 0.16;
  const h = size * BUDDY_RATIO;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: feetY - h - bladeH,
        width: size,
        height: h + bladeH,
        transform: `rotate(${lean}deg) scaleX(${flip ? -1 : 1})`,
        transformOrigin: "50% 100%",
        opacity,
        ...style,
      }}
    >
      <Buddy
        size={size}
        body={body}
        eye={eye}
        blink={blink}
        look={look}
        squash={squash}
        accessory={<Beanie color={beanie} rib={eye} />}
      />
      <svg
        width={size}
        height={bladeH}
        viewBox="0 0 100 16"
        style={{ position: "absolute", left: 0, top: h - 2, overflow: "visible" }}
      >
        {[18, 58].map((bx) => (
          <g key={bx}>
            <rect x={bx + 6} y={0} width={4} height={9} fill={blade} />
            <rect x={bx + 20} y={0} width={4} height={9} fill={blade} />
            <path
              d={`M ${bx} 10 L ${bx + 30} 10 Q ${bx + 36} 10 ${bx + 35} 5`}
              fill="none"
              stroke={blade}
              strokeWidth={3.2}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

/** Little burst of ice spray from a hockey stop. progress 0..1 */
export const IceSpray: React.FC<{ x: number; y: number; progress: number; color: string; dir?: 1 | -1 }> = ({
  x,
  y,
  progress,
  color,
  dir = 1,
}) => {
  if (progress <= 0 || progress >= 1) return null;
  const parts = [
    [-0.9, 0.6, 14], [-0.6, 1.0, 10], [-0.3, 0.8, 16], [0.0, 1.1, 9],
    [0.3, 0.7, 12], [-1.1, 0.4, 8], [-0.45, 1.25, 7], [0.15, 0.95, 11],
  ];
  return (
    <>
      {parts.map(([ang, dist, r], i) => {
        const a = (ang as number) * Math.PI * 0.5;
        const d = (dist as number) * 150 * progress;
        const px = x + dir * Math.cos(a) * d * -1;
        const py = y - Math.abs(Math.sin(a + 1.2)) * d * 0.6 + progress * progress * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - (r as number),
              top: py - (r as number),
              width: (r as number) * 2,
              height: (r as number) * 2,
              borderRadius: "50%",
              background: color,
              opacity: (1 - progress) * 0.95,
            }}
          />
        );
      })}
    </>
  );
};
