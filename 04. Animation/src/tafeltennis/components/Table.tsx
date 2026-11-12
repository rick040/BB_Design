import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

// Table-tennis set pieces, drawn on the 1080 × 900 stage.
export const TABLE = { x: 60, w: 960, top: 600, h: 26, netX: 540 };
export const PANEL = { left: 70, top: 196, w: 450, h: 394, rowsTop: 84, rowH: 72 };
/** Stage y of the centre of mailbox row i. */
export const rowCenterY = (i: number) => PANEL.top + PANEL.rowsTop + i * PANEL.rowH + (PANEL.rowH - 8) / 2;

export const Table: React.FC<{ color: string; line: string; legs?: boolean }> = ({ color, line, legs = true }) => (
  <>
    {legs ? (
      <div
        style={{ position: "absolute", left: 120, width: 840, top: TABLE.top + TABLE.h + 138, height: 34, borderRadius: "50%", background: color, opacity: 0.12 }}
      />
    ) : null}
    {legs
      ? [170, 870].map((x) => (
          <div
            key={x}
            style={{ position: "absolute", left: x, top: TABLE.top + TABLE.h, width: 26, height: 150, background: color, opacity: 0.55, borderRadius: 6 }}
          />
        ))
      : null}
    <div
      style={{
        position: "absolute",
        left: TABLE.x,
        top: TABLE.top,
        width: TABLE.w,
        height: TABLE.h,
        background: color,
        borderRadius: 8,
        boxShadow: `inset 0 6px 0 ${line}`,
      }}
    />
  </>
);

/** The net; `height` grows it into a tall mesh wall. */
export const Net: React.FC<{ height: number; width?: number; color: string; cell?: number }> = ({
  height,
  width = 34,
  color,
  cell = 22,
}) => (
  <div
    style={{
      position: "absolute",
      left: TABLE.netX - width / 2,
      width,
      top: TABLE.top - height,
      height,
      backgroundImage: `repeating-linear-gradient(0deg, ${color} 0 3px, transparent 3px ${cell}px), repeating-linear-gradient(90deg, ${color} 0 3px, transparent 3px ${cell}px)`,
      borderTop: `8px solid ${color}`,
      boxSizing: "border-box",
    }}
  />
);

export const Paddle: React.FC<{ size: number; rubber: string; handle: string; style?: React.CSSProperties }> = ({
  size,
  rubber,
  handle,
  style,
}) => (
  <svg width={size} height={size * 1.45} viewBox="0 0 100 145" style={{ position: "absolute", overflow: "visible", ...style }}>
    <rect x={40} y={86} width={20} height={56} rx={9} fill={handle} />
    <circle cx={50} cy={48} r={46} fill={rubber} />
    <circle cx={50} cy={48} r={46} fill="none" stroke={handle} strokeWidth={4} opacity={0.35} />
  </svg>
);

/** Small "inbox" panel standing on your half of the table. */
export const MailPanel: React.FC<{
  title: string;
  senders: string[];
  highlight?: number;
  highlightIn?: number;
  hideRow?: number;
  style?: React.CSSProperties;
}> = ({ title, senders, highlight = -1, highlightIn = 0, hideRow = -1, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: PANEL.left,
        top: PANEL.top,
        width: PANEL.w,
        height: PANEL.h,
        background: p.white,
        borderRadius: 28,
        boxShadow: "0 18px 50px rgba(0, 30, 140, 0.16)",
        padding: "24px 24px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 40, color: p.blue, letterSpacing: "-0.03em", height: PANEL.rowsTop - 24, lineHeight: "48px" }}>
        {title}
      </div>
      {senders.map((s, i) => {
        const h = i === highlight ? highlightIn : 0;
        return (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              height: PANEL.rowH - 8,
              marginBottom: 8,
              borderRadius: 14,
              padding: "0 10px",
              background: `rgba(255, 206, 49, ${0.85 * h})`,
              opacity: i === hideRow ? 0.25 : 1,
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: p.grey, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 29, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{s}</div>
              <div style={{ height: 9, width: `${60 + ((i * 17) % 30)}%`, background: p.grey, borderRadius: 4, marginTop: 5 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Headline whose words pop on given (spoken) frames. First line in `first`, rest in `rest`. */
export const SpokenHeadline: React.FC<{
  text: string;
  at: number[];
  first: string;
  rest: string;
  sizeFactor?: number;
  top: number;
  left: number;
  size: number;
}> = ({ text, at, first, rest, sizeFactor = 1, top, left, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right: left,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: size * sizeFactor,
        lineHeight: 1.0,
        letterSpacing: headlineTracking,
      }}
    >
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, i) => {
            const t = at[wi] ?? at[at.length - 1];
            wi++;
            const s = pop(frame, fps, t - 3, springs.pop);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    color: li === 0 ? first : rest,
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
