import React from "react";
import { dec, decFonts } from "../../theme";

/** Envelop met klep en postzegel. */
export const ENV_W = 200;
export const ENV_H = 140;

export const Envelope: React.FC<{
  width?: number;
  paper?: string;
  line?: string;
  stamp?: string;
  style?: React.CSSProperties;
}> = ({ width = ENV_W, paper = dec.white, line = dec.blue, stamp = dec.blue, style }) => (
  <svg
    width={width}
    height={(width * ENV_H) / ENV_W}
    viewBox={`0 0 ${ENV_W} ${ENV_H}`}
    style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 8px 14px rgba(1, 30, 140, 0.22))", ...style }}
  >
    <rect x="2" y="2" width="196" height="136" rx="14" fill={paper} stroke={line} strokeWidth="4" />
    <path d="M6 10 L100 84 L194 10" fill="none" stroke={line} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="152" y="18" width="30" height="36" rx="5" fill={stamp} opacity="0.9" />
  </svg>
);

/** Mok warme chocomel met stoom. `steam` 0..1 is de fase van de stoom. */
export const Mug: React.FC<{
  size: number;
  body?: string;
  liquid?: string;
  steam?: number;
  steamColor?: string;
  style?: React.CSSProperties;
}> = ({ size, body = dec.white, liquid = dec.ink, steam = 0, steamColor = dec.softBlue, style }) => {
  const wob = (k: number) => Math.sin(steam * Math.PI * 2 + k) * 6;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 120 156" style={{ overflow: "visible", ...style }}>
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={`M${40 + k * 22} 44 q${wob(k)} -14 0 -26 q${-wob(k + 1)} -12 0 -24`}
          fill="none"
          stroke={steamColor}
          strokeWidth="5"
          strokeLinecap="round"
          opacity={0.55 + 0.35 * Math.sin(steam * Math.PI * 2 + k * 2)}
        />
      ))}
      <path d="M96 76 h8 a16 16 0 0 1 0 36 h-12" fill="none" stroke={body} strokeWidth="9" strokeLinecap="round" />
      <path d="M16 62 h84 v52 a30 30 0 0 1 -30 30 h-24 a30 30 0 0 1 -30 -30z" fill={body} />
      <ellipse cx="58" cy="62" rx="42" ry="9" fill={liquid} />
      <path d="M28 96 h60" stroke={dec.blue} strokeWidth="6" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
};

/** Chatbubbel met tekst en een linkregel. */
export const LinkBubble: React.FC<{
  message: string;
  linkText: string;
  style?: React.CSSProperties;
}> = ({ message, linkText, style }) => (
  <div
    style={{
      width: 560,
      borderRadius: "46px 46px 46px 12px",
      background: dec.white,
      padding: "28px 36px 30px",
      boxSizing: "border-box",
      boxShadow: "0 22px 60px rgba(0, 20, 120, 0.28)",
      fontFamily: decFonts.ui,
      ...style,
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 500, color: dec.ink, lineHeight: 1.2 }}>{message}</div>
    <div
      style={{
        display: "inline-block",
        marginTop: 14,
        background: dec.ice,
        color: dec.blue,
        fontWeight: 600,
        fontSize: 34,
        borderRadius: 999,
        padding: "10px 26px",
      }}
    >
      {linkText}
    </div>
  </div>
);

/** Kleine tekstbel naast een personage. */
export const SpeechBubble: React.FC<{
  text: string;
  tail?: "left" | "right";
  background?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, tail = "left", background = dec.white, color = dec.ink, style }) => (
  <div
    style={{
      position: "relative",
      display: "inline-block",
      background,
      color,
      borderRadius: 40,
      padding: "20px 34px",
      fontFamily: decFonts.ui,
      fontWeight: 600,
      fontSize: 34,
      lineHeight: 1.1,
      whiteSpace: "nowrap",
      boxShadow: "0 16px 40px rgba(1, 40, 160, 0.18)",
      ...style,
    }}
  >
    {text}
    <div
      style={{
        position: "absolute",
        bottom: -14,
        [tail]: 40,
        width: 28,
        height: 28,
        background,
        transform: "rotate(45deg)",
        borderRadius: 4,
      }}
    />
  </div>
);

/** Vergroot de inhoud van een Stage-vak rond het midden (de Stage zelf blijft 1080 × 900). */
export const Zoom: React.FC<{ k: number; dy?: number; children: React.ReactNode }> = ({ k, dy = 0, children }) => (
  <div style={{ position: "absolute", inset: 0, transform: `translateY(${dy}px) scale(${k})`, transformOrigin: "540px 450px" }}>
    {children}
  </div>
);

/** Kleur van de vriend op een lichte achtergrond (iets dieper dan zachtblauw, voor contrast). */
export const FRIEND_BODY = "#8da6ff";
