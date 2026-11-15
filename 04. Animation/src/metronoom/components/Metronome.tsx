import React from "react";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { usePalette } from "../../lib/palette";

// Metronome drawn in absolute frame coordinates. The arm pivots near the
// bottom of the body (like a real metronome) and Buddy rides the weight.
export const PIVOT = { x: 540, y: 1010 };
export const ARM_LEN = 400;
const WEIGHT_D = 240; // pivot → weight centre
const WEIGHT_H = 56;

export const Metronome: React.FC<{
  angle: number; // degrees, + = tip to the right
  rise: number; // 0..1, slides in from below
  buddy: number; // 0..1, Buddy dropped onto the weight
  buddyDrop: number; // px still to fall
  squash: number;
  blink: number;
  look: { x: number; y: number };
  tickFlash: number; // 0..1 ring at the tip after a tick
  tickSide: number; // -1 | 1
  swing: number; // degrees at a full tick
}> = ({ angle, rise, buddy, buddyDrop, squash, blink, look, tickFlash, tickSide, swing }) => {
  const p = usePalette();
  const dy = (1 - rise) * 1300;
  if (rise < 0.005) return null;
  const BUDDY = 128;
  const top = PIVOT.y - 420;
  const tipX = PIVOT.x + Math.sin((tickSide * swing * Math.PI) / 180) * ARM_LEN;
  const tipY = PIVOT.y - Math.cos((swing * Math.PI) / 180) * ARM_LEN;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${dy}px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* body */}
        <path
          d={`M ${PIVOT.x - 95} ${top} L ${PIVOT.x + 95} ${top} L ${PIVOT.x + 220} ${PIVOT.y + 30} L ${PIVOT.x - 220} ${PIVOT.y + 30} Z`}
          fill={p.blueMid}
          stroke={p.blueSoft}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <rect x={PIVOT.x - 250} y={PIVOT.y + 24} width={500} height={34} rx={17} fill={p.blueSoft} />
        {/* scale on the face */}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = top + 60 + i * 34;
          const w = 22 + (i % 2) * 14;
          return <rect key={i} x={PIVOT.x - w / 2} y={y} width={w} height={5} rx={2.5} fill={p.blueSoft} opacity={0.7} />;
        })}
        {/* tick ring at the tip */}
        {tickFlash > 0 && tickFlash < 1 ? (
          <circle
            cx={tipX}
            cy={tipY}
            r={20 + tickFlash * 70}
            fill="none"
            stroke={p.white}
            strokeWidth={6}
            opacity={(1 - tickFlash) * 0.9}
          />
        ) : null}
      </svg>
      {/* arm + weight + Buddy rotate together around the pivot */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transform: `rotate(${angle}deg)`,
          transformOrigin: `${PIVOT.x}px ${PIVOT.y}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: PIVOT.x - 7,
            top: PIVOT.y - ARM_LEN,
            width: 14,
            height: ARM_LEN,
            borderRadius: 7,
            background: p.white,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: PIVOT.x - 52,
            top: PIVOT.y - WEIGHT_D - WEIGHT_H / 2,
            width: 104,
            height: WEIGHT_H,
            borderRadius: 14,
            background: p.yellow,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: PIVOT.x - 24,
            top: PIVOT.y - 24,
            width: 48,
            height: 48,
            borderRadius: 24,
            background: p.white,
            border: `8px solid ${p.blueSoft}`,
          }}
        />
        {buddy > 0 ? (
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={blink}
            squash={squash}
            look={look}
            style={{
              position: "absolute",
              left: PIVOT.x - BUDDY / 2,
              top: PIVOT.y - WEIGHT_D - WEIGHT_H / 2 - BUDDY * BUDDY_RATIO + 4 - buddyDrop,
              opacity: Math.min(1, buddy * 3),
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
