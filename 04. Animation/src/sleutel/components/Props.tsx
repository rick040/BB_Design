import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

/** A big cartoon key (bow ring, shaft, teeth). Origin = centre of the bow. */
export const Key: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({
  size,
  color,
  style,
}) => (
  <svg width={size} height={size * 0.42} viewBox="0 0 240 100" style={{ overflow: "visible", ...style }}>
    <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="22" />
    <rect x="84" y="40" width="148" height="20" rx="6" fill={color} />
    <rect x="180" y="58" width="16" height="26" rx="3" fill={color} />
    <rect x="208" y="58" width="16" height="34" rx="3" fill={color} />
    <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="4" />
  </svg>
);

/** Padlock; `closed` 0 = shackle up and open, 1 = shut. */
export const Padlock: React.FC<{ size: number; color: string; closed: number; style?: React.CSSProperties }> = ({
  size,
  color,
  closed,
  style,
}) => {
  const lift = (1 - closed) * 26;
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 100 125" style={{ overflow: "visible", ...style }}>
      <g transform={`translate(0 ${-lift}) rotate(${(1 - closed) * -18} 72 52)`}>
        <path d="M28 58V38a22 22 0 0 1 44 0v20" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
      </g>
      <rect x="10" y="52" width="80" height="68" rx="16" fill={color} />
      <circle cx="50" cy="80" r="8" fill="rgba(0,0,0,0.25)" />
      <rect x="46" y="84" width="8" height="18" rx="3" fill="rgba(0,0,0,0.25)" />
    </svg>
  );
};

const MailIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 40 30">
    <rect x="2" y="2" width="36" height="26" rx="5" fill="none" stroke={color} strokeWidth="3.2" />
    <path d="M4 5l16 12L36 5" fill="none" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
  </svg>
);

const BankIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 40 36">
    <path d="M3 13L20 3l17 10z" fill={color} />
    {[8, 16, 24, 32].map((x) => (
      <rect key={x} x={x - 2} y="15" width="4" height="13" fill={color} />
    ))}
    <rect x="3" y="30" width="34" height="4" rx="1" fill={color} />
  </svg>
);

/** A front door with a label plate on top and a padlock at the handle. */
export const Door: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  icon: "mail" | "bank";
  door: string;
  ink: string;
  lockColor: string;
  locked: number;
  lockScale?: number;
}> = ({ x, y, w, h, label, icon, door, ink, lockColor, locked, lockScale = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: door,
        borderRadius: "28px 28px 10px 10px",
        boxShadow: "0 30px 70px rgba(0, 20, 120, 0.18)",
      }}
    />
    {/* panels */}
    {[0.2, 0.58].map((t) => (
      <div
        key={t}
        style={{
          position: "absolute",
          left: w * 0.14,
          right: w * 0.14,
          top: h * t,
          height: h * 0.3,
          borderRadius: 14,
          border: `5px solid ${ink}`,
          opacity: 0.18,
        }}
      />
    ))}
    {/* label plate */}
    <div
      style={{
        position: "absolute",
        left: w * 0.1,
        right: w * 0.1,
        top: h * 0.05,
        height: 70,
        borderRadius: 18,
        background: ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        color: door,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: 36,
      }}
    >
      {icon === "mail" ? <MailIcon color={door} size={40} /> : <BankIcon color={door} size={38} />}
      {label}
    </div>
    <Padlock
      size={86 * lockScale}
      color={lockColor}
      closed={locked}
      style={{ position: "absolute", left: w * 0.72 - 43 * lockScale, top: h * 0.5 }}
    />
  </div>
);

/** Brass-free letterbox plate with a dark slot; Buddy's eyes can peek through it. */
export const SlotPlate: React.FC<{
  cx: number;
  cy: number;
  w: number;
  plate: string;
  slot: string;
  label?: string;
  labelColor?: string;
  eyes?: number;
  look?: number;
  blink?: number;
  eyeColor?: string;
}> = ({ cx, cy, w, plate, slot, label, labelColor, eyes = 0, look = 0, blink = 1, eyeColor = "#fff" }) => {
  const sw = w * 0.84;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - 75, width: w, height: 150 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: plate,
          borderRadius: 40,
          boxShadow: "0 24px 60px rgba(0, 20, 120, 0.22)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: (w - sw) / 2,
          top: 50,
          width: sw,
          height: 50,
          borderRadius: 25,
          background: slot,
          overflow: "hidden",
        }}
      >
        {[-1, 1].map((s) => (
          <div
            key={s}
            style={{
              position: "absolute",
              left: sw / 2 + s * 34 - 13 + look * 60,
              top: 25 - 18 + (1 - eyes) * 40,
              width: 26,
              height: 36,
              borderRadius: "50%",
              background: eyeColor,
              transform: `scaleY(${blink})`,
            }}
          />
        ))}
      </div>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 112,
            textAlign: "center",
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: "0.04em",
            color: labelColor,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Headline whose words pop in on given frames (the spoken words). */
export const SpokenHeadline: React.FC<{
  text: string;
  at: number[];
  color: string;
  secondColor?: string;
  sizeFactor?: number;
}> = ({ text, at, color, secondColor, sizeFactor = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const p = usePalette();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: L.safeTop,
        left: L.sidePadding,
        right: L.sidePadding,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: L.headlineSize * sizeFactor,
        lineHeight: 1.0,
        letterSpacing: headlineTracking,
      }}
    >
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, i) => {
            const t = at[wi] ?? at[at.length - 1] ?? 0;
            wi++;
            const s = pop(frame, fps, t - 3, springs.pop);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    color: li > 0 && secondColor ? secondColor : color ?? p.white,
                    opacity: Math.min(1, s * 1.4),
                    transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                    filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                  }}
                >
                  {w}
                </span>{" "}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};
