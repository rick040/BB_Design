import React from "react";
import { fonts } from "../../theme";

export const RADIO_W = 960;
export const SCALE_H = 130;

const FREQS = [88, 92, 96, 100, 104, 108];

/**
 * A tuner: frequency scale with a needle on top, a "screen" below it where
 * the content (mail in static, or a clean signal) lives. `needle` 0..1 is
 * the position over the scale. `station` marks the Buddy frequency.
 */
export const Radio: React.FC<{
  height: number;
  needle: number;
  station?: { at: number; label: string; glow: number };
  body: string;
  scaleBg: string;
  ink: string;
  needleColor: string;
  screenBg: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ height, needle, station, body, scaleBg, ink, needleColor, screenBg, children, style }) => {
  const pad = 26;
  const scaleW = RADIO_W - pad * 2;
  const x = (t: number) => 50 + t * (scaleW - 100);
  return (
    <div
      style={{
        position: "absolute",
        width: RADIO_W,
        height,
        borderRadius: 56,
        background: body,
        boxShadow: "0 30px 70px rgba(1,30,140,0.22)",
        ...style,
      }}
    >
      {/* Frequency scale */}
      <div
        style={{
          position: "absolute",
          left: pad,
          top: pad,
          width: scaleW,
          height: SCALE_H - 10,
          borderRadius: 34,
          background: scaleBg,
          overflow: "hidden",
        }}
      >
        <svg width={scaleW} height={SCALE_H - 10} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 41 }).map((_, i) => {
            const tx = x(i / 40);
            const major = i % 8 === 0;
            return (
              <line
                key={i}
                x1={tx}
                x2={tx}
                y1={major ? 18 : 26}
                y2={major ? 58 : 46}
                stroke={ink}
                strokeWidth={major ? 4 : 2.5}
                opacity={major ? 0.85 : 0.45}
              />
            );
          })}
        </svg>
        {FREQS.map((f, i) => (
          <div
            key={f}
            style={{
              position: "absolute",
              left: x(i / 5) - 40,
              width: 80,
              top: 66,
              textAlign: "center",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 30,
              color: ink,
              opacity: 0.75,
            }}
          >
            {f}
          </div>
        ))}
        {station ? (
          <div
            style={{
              position: "absolute",
              left: x(station.at) - 70,
              width: 140,
              top: 62,
              height: 44,
              borderRadius: 22,
              background: needleColor,
              color: "#fff",
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 28,
              lineHeight: "44px",
              textAlign: "center",
              opacity: station.glow,
              transform: `scale(${0.7 + 0.3 * station.glow})`,
              boxShadow: `0 0 ${30 * station.glow}px ${needleColor}`,
            }}
          >
            {station.label}
          </div>
        ) : null}
        {/* Needle */}
        <div
          style={{
            position: "absolute",
            left: x(needle) - 4,
            top: 6,
            width: 8,
            height: SCALE_H - 22,
            borderRadius: 4,
            background: needleColor,
          }}
        />
      </div>

      {/* Screen */}
      <div
        style={{
          position: "absolute",
          left: pad,
          top: SCALE_H + pad,
          width: scaleW,
          height: height - SCALE_H - pad * 2,
          borderRadius: 34,
          background: screenBg,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const screenSize = (height: number) => ({ w: RADIO_W - 52, h: height - SCALE_H - 52 });
