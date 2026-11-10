import React from "react";
import { random } from "remotion";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A retro radio, drawn in CSS/SVG so every label stays editable.
// Left: dial window (stations + needle) and an oscilloscope window (wave).
// Right: the big tuning knob. 860 × 400 at scale 1.
export const RADIO_W = 860;
export const RADIO_H = 400;
const DIAL = { x: 44, y: 60, w: 520, h: 130 };
const WAVE = { x: 44, y: 212, w: 520, h: 140 };
export const KNOB = { cx: 718, cy: 220, r: 112 };

/** Noisy-to-clean wave. clarity 0 = static, 1 = a clean sine. */
export const Wave: React.FC<{
  frame: number;
  clarity: number;
  width: number;
  height: number;
  color: string;
  seed?: string;
}> = ({ frame, clarity, width, height, color, seed = "w" }) => {
  const n = 90;
  const pts: string[] = [];
  const amp = height * 0.38;
  // Static changes every 2 frames so it flickers like real noise.
  const t = Math.floor(frame / 2);
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * width;
    const sine = Math.sin(i / 5.5 - frame / 4) * amp * 0.8;
    const noise = (random(`${seed}-${t}-${i}`) * 2 - 1) * amp;
    const y = height / 2 + sine * clarity + noise * (1 - clarity);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Radio: React.FC<{
  frame: number;
  /** 0..1 needle position on the dial. */
  needle: number;
  /** 0 = static, 1 = clear signal. */
  clarity: number;
  /** Knob rotation in degrees. */
  knob: number;
  stations: string[];
  /** Extra label on the dial that only reads when the needle is on it. */
  hidden?: { label: string; at: number };
  /** Text shown big in the dial once the signal is clear (scene 3). */
  display?: string;
  displayIn?: number;
  style?: React.CSSProperties;
}> = ({ frame, needle, clarity, knob, stations, hidden, display, displayIn = 0, style }) => {
  const p = usePalette();
  const nx = DIAL.x + 24 + needle * (DIAL.w - 48);
  const dots: React.ReactNode[] = [];
  // Speaker grille around the knob.
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 2; c++) {
      dots.push(
        <circle key={`${r}-${c}`} cx={606 + c * 224} cy={86 + r * 66} r={9} fill={p.blueSoft} opacity={0.35} />,
      );
    }
  }
  const hiddenDist = hidden ? Math.abs(needle - hidden.at) : 1;
  const hiddenVis = Math.max(0, 1 - hiddenDist / 0.09);

  return (
    <div style={{ position: "relative", width: RADIO_W, height: RADIO_H + 70, ...style }}>
      {/* Handle */}
      <svg width={RADIO_W} height={80} style={{ position: "absolute", top: 0, left: 0 }}>
        <path
          d={`M 220 78 L 250 18 Q 256 8 268 8 L ${RADIO_W - 268} 8 Q ${RADIO_W - 256} 8 ${RADIO_W - 250} 18 L ${RADIO_W - 220} 78`}
          fill="none"
          stroke={p.blueMascot}
          strokeWidth={18}
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          width: RADIO_W,
          height: RADIO_H,
          borderRadius: 56,
          background: p.blue,
          boxShadow: "0 30px 70px rgba(1, 30, 140, 0.28)",
          overflow: "hidden",
        }}
      >
        <svg width={RADIO_W} height={RADIO_H} style={{ position: "absolute", inset: 0 }}>
          {dots}
        </svg>

        {/* Dial window */}
        <div
          style={{
            position: "absolute",
            left: DIAL.x,
            top: DIAL.y,
            width: DIAL.w,
            height: DIAL.h,
            borderRadius: 24,
            background: p.light,
            overflow: "hidden",
          }}
        >
          {/* scale ticks */}
          <svg width={DIAL.w} height={DIAL.h} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 27 }).map((_, i) => (
              <line
                key={i}
                x1={24 + i * ((DIAL.w - 48) / 26)}
                x2={24 + i * ((DIAL.w - 48) / 26)}
                y1={DIAL.h - 14}
                y2={DIAL.h - (i % 2 === 0 ? 40 : 28)}
                stroke={p.blue}
                strokeWidth={3}
                opacity={0.5}
              />
            ))}
          </svg>
          <div style={{ opacity: 1 - displayIn }}>
            {stations.map((s, i) => {
              const at = (i + 0.5) / stations.length;
              return (
                <div
                  key={s}
                  style={{
                    position: "absolute",
                    left: 24 + at * (DIAL.w - 48),
                    top: 18,
                    transform: "translateX(-50%)",
                    fontFamily: fonts.ui,
                    fontWeight: 600,
                    fontSize: 28,
                    color: p.blue,
                    opacity: 0.55,
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                </div>
              );
            })}
            {hidden ? (
              <div
                style={{
                  position: "absolute",
                  left: 24 + hidden.at * (DIAL.w - 48),
                  top: 52,
                  transform: `translateX(-50%) scale(${0.9 + 0.2 * hiddenVis})`,
                  fontFamily: fonts.ui,
                  fontWeight: 700,
                  fontSize: 28,
                  color: p.red,
                  opacity: hiddenVis,
                  filter: `blur(${(1 - hiddenVis) * 6}px)`,
                  whiteSpace: "nowrap",
                }}
              >
                {hidden.label}
              </div>
            ) : null}
          </div>
          {display ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 20,
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 66,
                letterSpacing: "-0.04em",
                color: p.blue,
                opacity: displayIn,
                filter: `blur(${(1 - displayIn) * 10}px)`,
                transform: `translateX(${(1 - displayIn) * (random(`d${Math.floor(frame / 2)}`) - 0.5) * 30}px)`,
                whiteSpace: "nowrap",
              }}
            >
              {display}
            </div>
          ) : null}
          {/* needle */}
          <div
            style={{
              position: "absolute",
              left: nx - 4,
              top: 8,
              width: 8,
              height: DIAL.h - 16,
              borderRadius: 4,
              background: p.red,
              opacity: display ? 1 - displayIn : 1,
            }}
          />
        </div>

        {/* Oscilloscope window */}
        <div
          style={{
            position: "absolute",
            left: WAVE.x,
            top: WAVE.y,
            width: WAVE.w,
            height: WAVE.h,
            borderRadius: 24,
            background: p.blueMascot,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.12)",
          }}
        >
          <div style={{ position: "absolute", left: 20, top: 10 }}>
            <Wave
              frame={frame}
              clarity={clarity}
              width={WAVE.w - 40}
              height={WAVE.h - 20}
              color={clarity > 0.85 ? p.white : p.blueSoft}
            />
          </div>
        </div>

        {/* Tuning knob */}
        <div
          style={{
            position: "absolute",
            left: KNOB.cx - KNOB.r,
            top: KNOB.cy - KNOB.r,
            width: KNOB.r * 2,
            height: KNOB.r * 2,
            borderRadius: "50%",
            background: p.light,
            boxShadow: "0 10px 0 rgba(0, 20, 120, 0.35)",
            transform: `rotate(${knob}deg)`,
          }}
        >
          <svg width={KNOB.r * 2} height={KNOB.r * 2} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 18 }).map((_, i) => {
              const a = (i / 18) * Math.PI * 2;
              const r1 = KNOB.r - 6;
              const r2 = KNOB.r - 20;
              return (
                <line
                  key={i}
                  x1={KNOB.r + Math.cos(a) * r1}
                  y1={KNOB.r + Math.sin(a) * r1}
                  x2={KNOB.r + Math.cos(a) * r2}
                  y2={KNOB.r + Math.sin(a) * r2}
                  stroke={p.blueSoft}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx={KNOB.r} cy={KNOB.r} r={KNOB.r - 34} fill={p.white} />
            <line
              x1={KNOB.r}
              y1={KNOB.r - 18}
              x2={KNOB.r}
              y2={44}
              stroke={p.blue}
              strokeWidth={14}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
