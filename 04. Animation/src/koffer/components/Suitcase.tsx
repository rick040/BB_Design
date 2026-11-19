import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const TILE = 150;
export const TILE_GAP = 26;

export type Glyph = "circle" | "square" | "triangle" | "wave" | "play" | "star" | "mail" | "agenda" | "question";

const GlyphSvg: React.FC<{ g: Glyph; color: string; size: number; date?: string }> = ({ g, color, size, date }) => {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
      {g === "circle" ? <circle cx="50" cy="50" r="26" fill={color} /> : null}
      {g === "square" ? <rect x="26" y="26" width="48" height="48" rx="10" fill={color} /> : null}
      {g === "triangle" ? <path d="M50 22 L78 74 L22 74 Z" fill={color} strokeLinejoin="round" /> : null}
      {g === "wave" ? (
        <path d="M18 56 C30 34 40 34 50 50 C60 66 70 66 82 44" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
      ) : null}
      {g === "play" ? <path d="M36 26 L76 50 L36 74 Z" fill={color} /> : null}
      {g === "star" ? (
        <path d="M50 20 L58 41 L80 42 L63 56 L69 78 L50 65 L31 78 L37 56 L20 42 L42 41 Z" fill={color} />
      ) : null}
      {g === "mail" ? (
        <g>
          <rect x="18" y="28" width="64" height="46" rx="8" fill={color} />
          <path d="M22 34 L50 56 L78 34" fill="none" stroke="#fff" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      ) : null}
      {g === "agenda" ? (
        <g>
          <rect x="20" y="24" width="60" height="56" rx="10" fill="#fff" stroke={color} strokeWidth="6" />
          <rect x="20" y="24" width="60" height="16" rx="6" fill={color} />
          <text x="50" y="72" textAnchor="middle" fontFamily={fonts.ui} fontWeight="700" fontSize="30" fill={color}>
            {date ?? "17"}
          </text>
        </g>
      ) : null}
      {g === "question" ? (
        <text x="50" y="70" textAnchor="middle" fontFamily={fonts.display} fontWeight="700" fontSize="58" fill={color}>
          ?
        </text>
      ) : null}
    </svg>
  );
};

/** A rounded app tile with a simple generic glyph (no real brands). */
export const AppTile: React.FC<{
  glyph: Glyph;
  color: string;
  bg?: string;
  label?: string;
  labelColor?: string;
  size?: number;
  date?: string;
  style?: React.CSSProperties;
}> = ({ glyph, color, bg = "#ffffff", label, labelColor = "#111827", size = TILE, date, style }) => (
  <div style={{ position: "absolute", width: size, height: size, ...style }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: bg,
        boxShadow: "0 10px 26px rgba(1, 40, 160, 0.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GlyphSvg g={glyph} color={color} size={size * 0.78} date={date} />
    </div>
    {label ? (
      <div
        style={{
          position: "absolute",
          top: size + 8,
          left: -40,
          right: -40,
          textAlign: "center",
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: 26,
          color: labelColor,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    ) : null}
  </div>
);

/** Geometry of the open suitcase, top-down, in stage coordinates. */
export const OPEN = {
  x: 160,
  w: 760,
  lidY: 110,
  lidH: 270,
  bodyY: 400,
  bodyH: 452,
  inset: 22,
};

/** Tile slot (top-left) in the body of the open suitcase, 4 × 2. */
export const slot = (i: number) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const gridW = 4 * TILE + 3 * TILE_GAP;
  const left = OPEN.x + (OPEN.w - gridW) / 2;
  const top = OPEN.bodyY + 30;
  return { x: left + col * (TILE + TILE_GAP), y: top + row * (TILE + TILE_GAP + 20) };
};

/** Open suitcase seen from above: lid at the top, body with the tiles below. */
export const OpenSuitcase: React.FC<{ children?: React.ReactNode; tag: string; tagSwing?: number }> = ({
  children,
  tag,
  tagSwing = 0,
}) => {
  const p = usePalette();
  const { x, w, lidY, lidH, bodyY, bodyH, inset } = OPEN;
  return (
    <>
      {/* lid */}
      <div style={{ position: "absolute", left: x, top: lidY, width: w, height: lidH, borderRadius: 40, background: p.blue }}>
        <div
          style={{
            position: "absolute",
            inset,
            borderRadius: 24,
            background: p.blueSoft,
            backgroundImage: `repeating-linear-gradient(135deg, transparent 0 22px, rgba(1,59,255,0.08) 22px 44px)`,
          }}
        />
        {[0.28, 0.72].map((f) => (
          <div
            key={f}
            style={{ position: "absolute", left: w * f - 14, top: inset, width: 28, height: lidH - inset * 2, background: p.blueMid, opacity: 0.9 }}
          />
        ))}
      </div>
      {/* hinge */}
      <div style={{ position: "absolute", left: x + 30, top: lidY + lidH, width: w - 60, height: bodyY - lidY - lidH, background: p.blueMascot, borderRadius: 6 }} />
      {/* body */}
      <div style={{ position: "absolute", left: x, top: bodyY, width: w, height: bodyH, borderRadius: 40, background: p.blue }}>
        <div style={{ position: "absolute", inset, borderRadius: 24, background: p.grey }} />
      </div>
      {/* handle on the front edge */}
      <div
        style={{
          position: "absolute",
          left: x + w / 2 - 90,
          top: bodyY + bodyH - 6,
          width: 180,
          height: 46,
          borderRadius: "0 0 26px 26px",
          border: `16px solid ${p.blueMascot}`,
          borderTop: "none",
          boxSizing: "border-box",
        }}
      />
      {/* luggage tag */}
      <div
        style={{
          position: "absolute",
          left: x + w / 2 + 70,
          top: bodyY + bodyH + 24,
          transformOrigin: "0% 0%",
          transform: `rotate(${-8 + tagSwing}deg)`,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: -18, width: 4, height: 30, background: p.blueMascot, transform: "rotate(-30deg)" }} />
        <div
          style={{
            marginLeft: 10,
            marginTop: 8,
            padding: "10px 22px",
            background: p.yellow,
            borderRadius: 14,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 30,
            color: "#111827",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 20px rgba(1, 40, 160, 0.15)",
          }}
        >
          {tag}
        </div>
      </div>
      {children}
    </>
  );
};
