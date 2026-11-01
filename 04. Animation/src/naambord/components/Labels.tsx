import React from "react";
import { fonts } from "../../theme";

/**
 * A strip of label-maker tape: coloured tape, slightly raised letters,
 * square ends with a tiny notch. Used for the name on the plate, "op jouw
 * naam" on the bills and "doorgestuurd" when you forward them.
 */
export const LabelTape: React.FC<{
  text: string;
  tape: string;
  ink: string;
  fontSize: number;
  /** Extra width on both sides of the text, in em. */
  padX?: number;
  arrow?: boolean;
  style?: React.CSSProperties;
}> = ({ text, tape, ink, fontSize, padX = 0.7, arrow = false, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: fontSize * 0.35,
      height: fontSize * 1.75,
      padding: `0 ${padX}em`,
      fontSize,
      boxSizing: "border-box",
      background: `linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.09) 100%), ${tape}`,
      borderRadius: fontSize * 0.12,
      boxShadow: `0 ${fontSize * 0.12}px ${fontSize * 0.4}px rgba(0, 20, 90, 0.18)`,
      fontFamily: fonts.ui,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: ink,
      textShadow: "0 1px 0 rgba(255,255,255,0.35), 0 -1px 0 rgba(0,0,0,0.12)",
      whiteSpace: "nowrap",
      lineHeight: 1,
      ...style,
    }}
  >
    <span>{text}</span>
    {arrow ? (
      <svg width={fontSize * 0.9} height={fontSize * 0.9} viewBox="0 0 40 40" style={{ display: "block" }}>
        <path d="M6 20h26M21 9l11 11-11 11" fill="none" stroke={ink} strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : null}
  </div>
);

/** Envelope icon (mail), drawn as SVG. */
export const MailIcon: React.FC<{ size: number; color: string; bg?: string }> = ({ size, color, bg }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", flexShrink: 0 }}>
    {bg ? <circle cx="20" cy="20" r="20" fill={bg} /> : null}
    <rect x="9" y="12.5" width="22" height="15" rx="2.6" fill="none" stroke={color} strokeWidth="2.6" />
    <path d="M10 14l10 7.5L30 14" fill="none" stroke={color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

/**
 * Buddy's marker: tip at the left end (0, h/2), body to the right.
 * `cap` 1 = cap on, 0 = cap off (the cap is drawn separately when off).
 */
export const MARKER_W = 230;
export const MARKER_H = 46;

export const Marker: React.FC<{
  body: string;
  ink: string;
  capOn?: boolean;
  style?: React.CSSProperties;
}> = ({ body, ink, capOn = true, style }) => (
  <svg
    width={MARKER_W}
    height={MARKER_H}
    viewBox={`0 0 ${MARKER_W} ${MARKER_H}`}
    style={{ display: "block", overflow: "visible", ...style }}
  >
    {/* felt tip + cone */}
    <path d="M0 23 L14 15 L14 31 Z" fill={ink} />
    <path d="M14 12 L44 6 L44 40 L14 34 Z" fill="#e9edf7" />
    {/* body */}
    <rect x="42" y="4" width="160" height="38" rx="9" fill={body} />
    <rect x="42" y="8" width="160" height="7" rx="3.5" fill="rgba(255,255,255,0.45)" />
    <rect x="186" y="4" width="16" height="38" rx="4" fill={ink} />
    {/* cap over the tip */}
    {capOn ? <MarkerCapShape ink={ink} /> : null}
  </svg>
);

export const MarkerCapShape: React.FC<{ ink: string }> = ({ ink }) => (
  <g>
    <rect x="-8" y="2" width="62" height="42" rx="10" fill={ink} />
    <rect x="-4" y="8" width="54" height="6" rx="3" fill="rgba(255,255,255,0.22)" />
  </g>
);

/** The cap on its own (for the moment it pops off). */
export const MarkerCap: React.FC<{ ink: string; style?: React.CSSProperties }> = ({ ink, style }) => (
  <svg width={62} height={46} viewBox="-8 0 62 46" style={{ display: "block", overflow: "visible", ...style }}>
    <MarkerCapShape ink={ink} />
  </svg>
);
