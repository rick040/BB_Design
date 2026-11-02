import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

// The classic Dutch birthday calendar ("verjaardagskalender") that hangs on
// the toilet door: a paper sheet on a string, month on top, one line per day
// with names written in.
export const CAL_W = 600;
export const CAL_HEADER = 158;
export const CAL_ROW = 84;
export const calHeight = (rows: number) => CAL_HEADER + rows * CAL_ROW + 34;

export const Cake: React.FC<{ size: number }> = ({ size }) => {
  const p = usePalette();
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", flexShrink: 0 }}>
      <rect x={19} y={4} width={3} height={10} rx={1.5} fill={p.blueMid} />
      <path d="M20.5 0 C 23 3, 23 5, 20.5 6 C 18 5, 18 3, 20.5 0 Z" fill={p.yellow} />
      <rect x={6} y={14} width={29} height={10} rx={4} fill={p.blueSoft} />
      <rect x={3} y={22} width={35} height={15} rx={4} fill={p.red} />
      <path d="M3 27 q4.4 4 8.8 0 t8.8 0 t8.8 0 t8.8 0" fill="none" stroke={p.white} strokeWidth={2.4} />
    </svg>
  );
};

export const BirthdayCalendar: React.FC<{
  title: string;
  month: string;
  rows: { day: string; name: string }[];
  matchDay: string;
  /** 0..1: yellow ring drawn around the matching day. */
  ring?: number;
  style?: React.CSSProperties;
}> = ({ title, month, rows, matchDay, ring = 0, style }) => {
  const p = usePalette();
  const H = calHeight(rows.length);
  const ringLen = 330;
  return (
    <div style={{ position: "absolute", width: CAL_W, height: H, ...style }}>
      {/* string + nail */}
      <svg
        width={CAL_W}
        height={90}
        viewBox={`0 0 ${CAL_W} 90`}
        style={{ position: "absolute", left: 0, top: -84, overflow: "visible" }}
      >
        <path d={`M ${CAL_W * 0.28} 88 L ${CAL_W / 2} 12 L ${CAL_W * 0.72} 88`} fill="none" stroke={p.greyText} strokeWidth={4} />
        <circle cx={CAL_W / 2} cy={12} r={11} fill={p.greyText} />
        <circle cx={CAL_W / 2 - 3} cy={9} r={4} fill={p.white} opacity={0.7} />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          background: p.white,
          boxShadow: "0 30px 70px rgba(1, 40, 160, 0.16)",
          overflow: "hidden",
          fontFamily: fonts.ui,
        }}
      >
        <div
          style={{
            height: CAL_HEADER,
            background: p.blueSoft,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 28, color: p.blue, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
            {title}
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 78,
              letterSpacing: headlineTracking,
              color: p.blue,
              lineHeight: 1,
              marginTop: 6,
            }}
          >
            {month}
          </div>
        </div>

        {rows.map((r, i) => {
          const match = r.day === matchDay;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: CAL_HEADER + 14 + i * CAL_ROW,
                height: CAL_ROW,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 120,
                  textAlign: "center",
                  fontFamily: fonts.display,
                  fontWeight: 500,
                  fontSize: 52,
                  letterSpacing: "-0.04em",
                  color: p.blue,
                  position: "relative",
                }}
              >
                {r.day}
                {match && ring > 0 ? (
                  <svg
                    width={120}
                    height={90}
                    viewBox="0 0 120 90"
                    style={{ position: "absolute", left: 0, top: -14, overflow: "visible" }}
                  >
                    <path
                      d="M 92 18 C 70 2, 18 6, 14 42 C 10 76, 92 84, 106 50 C 114 30, 96 12, 70 10"
                      fill="none"
                      stroke={p.yellow}
                      strokeWidth={9}
                      strokeLinecap="round"
                      strokeDasharray={ringLen}
                      strokeDashoffset={ringLen * (1 - ring)}
                    />
                  </svg>
                ) : null}
              </div>
              <div
                style={{
                  flex: 1,
                  height: "100%",
                  marginRight: 40,
                  borderBottom: `3px dotted ${p.grey}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingLeft: 10,
                }}
              >
                {r.name ? (
                  <>
                    <span
                      style={{
                        fontSize: 44,
                        color: p.ink,
                        fontWeight: 450,
                        fontStyle: "italic",
                        transform: "rotate(-2deg)",
                        display: "inline-block",
                      }}
                    >
                      {r.name}
                    </span>
                    {match ? <Cake size={46} /> : null}
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Yellow marker ring around a chip-sized area (for the bill's due chip). */
export const MarkerRing: React.FC<{ width: number; height: number; progress: number; color: string; style?: React.CSSProperties }> = ({
  width,
  height,
  progress,
  color,
  style,
}) => {
  const len = 2.2 * (width + height);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", overflow: "visible", ...style }}>
      <ellipse
        cx={width / 2}
        cy={height / 2}
        rx={width / 2}
        ry={height / 2}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - interpolate(progress, [0, 1], [0, 1], clamp))}
        transform={`rotate(-4 ${width / 2} ${height / 2})`}
      />
    </svg>
  );
};
