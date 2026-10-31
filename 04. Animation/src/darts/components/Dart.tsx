import React from "react";
import { Easing, interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A dart seen at a slight angle. Drawn along +x with the tip at (0,0);
// `angle` rotates it around the tip (deg). Default: tail to the lower right.
export const DART_LEN = 230;

export const Dart: React.FC<{
  x: number;
  y: number;
  angle?: number;
  scale?: number;
  barrel?: string;
  flight?: string;
  opacity?: number;
  /** 0..1, little impact lines around the tip. */
  thud?: number;
  /** Optional tag hanging from the tail. */
  tag?: string;
  tagBg?: string;
  tagFg?: string;
  tagIn?: number;
  zIndex?: number;
}> = ({ x, y, angle = 35, scale = 1, barrel, flight, opacity = 1, thud = 0, tag, tagBg, tagFg, tagIn = 1, zIndex }) => {
  const p = usePalette();
  const b = barrel ?? p.blue;
  const f = flight ?? p.blueSoft;
  const L = DART_LEN;
  const a = (angle * Math.PI) / 180;
  const tail = { x: Math.cos(a) * L * scale, y: Math.sin(a) * L * scale };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 0,
          height: 0,
          opacity,
          zIndex,
        }}
      >
        {thud > 0 && thud < 1 ? (
          <svg width={160} height={160} viewBox="-80 -80 160 160" style={{ position: "absolute", left: -80, top: -80, overflow: "visible" }}>
            {[200, 250, 300].map((deg, i) => {
              const r = (deg * Math.PI) / 180;
              const r0 = 22 + thud * 20;
              const r1 = r0 + 26 * (1 - thud);
              return (
                <line
                  key={i}
                  x1={Math.cos(r) * r0}
                  y1={Math.sin(r) * r0}
                  x2={Math.cos(r) * r1}
                  y2={Math.sin(r) * r1}
                  stroke={b}
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={1 - thud}
                />
              );
            })}
          </svg>
        ) : null}
        <svg
          width={L + 20}
          height={80}
          viewBox={`0 -40 ${L + 20} 80`}
          style={{
            position: "absolute",
            left: 0,
            top: -40,
            overflow: "visible",
            transformOrigin: "0px 40px",
            transform: `rotate(${angle}deg) scale(${scale})`,
          }}
        >
          {/* tip */}
          <path d="M0 0 L46 -4 L46 4 Z" fill="#8a8fa3" />
          {/* barrel */}
          <rect x={44} y={-11} width={74} height={22} rx={10} fill={b} />
          <rect x={58} y={-11} width={6} height={22} fill="rgba(255,255,255,0.35)" />
          <rect x={74} y={-11} width={6} height={22} fill="rgba(255,255,255,0.35)" />
          <rect x={90} y={-11} width={6} height={22} fill="rgba(255,255,255,0.35)" />
          {/* shaft */}
          <rect x={116} y={-4} width={64} height={8} rx={4} fill={b} />
          {/* flights */}
          <path d={`M160 -3 L${L} -34 L${L + 10} -30 L${L - 6} -3 Z`} fill={f} />
          <path d={`M160 3 L${L} 34 L${L + 10} 30 L${L - 6} 3 Z`} fill={f} />
        </svg>
      </div>
      {tag ? (
        <div
          style={{
            position: "absolute",
            left: x + tail.x,
            top: y + tail.y + 18 * scale,
            transform: `translate(-50%, 0) scale(${interpolate(tagIn, [0, 1], [0.6, 1]) * scale})`,
            transformOrigin: "50% 0%",
            opacity: interpolate(tagIn, [0, 0.4], [0, 1], clamp),
            padding: "12px 26px",
            borderRadius: 999,
            background: tagBg ?? p.white,
            color: tagFg ?? p.ink,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 34,
            whiteSpace: "nowrap",
            boxShadow: "0 14px 34px rgba(1, 40, 160, 0.16)",
            zIndex,
          }}
        >
          {tag}
        </div>
      ) : null}
    </>
  );
};

/**
 * Where a thrown dart is at `frame`. Before `throwAt` it is hidden (unless
 * throwAt <= 0, then it is already stuck). It flies from `from` to `to` in
 * an arc and wobbles a little after the hit.
 */
export const dartFlight = (
  frame: number,
  throwAt: number,
  hitAt: number,
  from: { x: number; y: number },
  to: { x: number; y: number },
  baseAngle: number,
  arc = 120,
) => {
  const t = interpolate(frame, [throwAt, hitAt], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const visible = frame >= throwAt;
  const x = interpolate(t, [0, 1], [from.x, to.x]);
  const y = interpolate(t, [0, 1], [from.y, to.y]) - Math.sin(Math.PI * t) * arc;
  const since = frame - hitAt;
  const wobble = since >= 0 ? Math.sin(since * 1.7) * 9 * Math.exp(-since / 6) : 0;
  const flightTilt = since < 0 ? interpolate(t, [0, 1], [-18, 0]) : 0;
  return {
    x,
    y,
    angle: baseAngle + wobble + flightTilt,
    scale: interpolate(t, [0, 1], [1.7, 1]),
    opacity: visible ? interpolate(t, [0, 0.12], [0, 1], clamp) : 0,
    landed: since >= 0,
    thud: since >= 0 ? interpolate(since, [0, 10], [0, 1], clamp) : 0,
    since,
  };
};
