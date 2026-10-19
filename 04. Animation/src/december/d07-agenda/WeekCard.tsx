import React from "react";
import { usePalette } from "../../lib/palette";
import { Flag } from "../d01-pakketjes/Parcel";
import { decFonts, decTracking } from "../theme";
import type { AgendaProps } from "./schema";

// Ontwerpmaten in Stage-coördinaten (1080 × 900).
export const CARD = { x: 40, y: 30, w: 1000, pad: 20, headerH: 100, allDayH: 74, slotH: 96, slots: 6 } as const;
export const CARD_H = CARD.headerH + CARD.allDayH + CARD.slots * CARD.slotH + 30;
export const COL_W = (CARD.w - CARD.pad * 2) / 7;

export const colLeft = (day: number) => CARD.x + CARD.pad + day * COL_W + 4; // Stage-coördinaten
export const slotTop = (slot: number) => CARD.y + CARD.headerH + CARD.allDayH + slot * CARD.slotH + 3;
export const allDayTop = CARD.y + CARD.headerH + 8;
export const BLOCK_W = COL_W - 8;
export const BLOCK_H = CARD.slotH - 6;

export const useTone = () => {
  const p = usePalette();
  return (tone: number): { bg: string; fg: string; border?: string } => {
    if (tone === 1) return { bg: p.red, fg: p.white };
    if (tone === 2) return { bg: p.blueSoft, fg: p.ink };
    if (tone === 3) return { bg: p.light, fg: p.blue, border: p.blueSoft };
    if (tone === 4) return { bg: p.ink, fg: p.white };
    return { bg: p.blue, fg: p.white };
  };
};

/** Eén blok in de weekweergave. */
export const Block: React.FC<{
  label: string;
  tone: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
}> = ({ label, tone, w = BLOCK_W, h = BLOCK_H, style }) => {
  const t = useTone()(tone);
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 16,
        background: t.bg,
        color: t.fg,
        border: t.border ? `3px solid ${t.border}` : undefined,
        boxSizing: "border-box",
        padding: "10px 10px",
        fontFamily: decFonts.ui,
        fontWeight: 600,
        fontSize: 21,
        lineHeight: 1.1,
        overflow: "hidden",
        hyphens: "manual",
        wordBreak: "normal",
        ...style,
      }}
      lang="nl"
    >
      {label}
    </div>
  );
};

/**
 * Weekweergave als witte kaart. `eventOn(i)` geeft per gebeurtenis 0..1 (pop-in).
 * `hideLate` slaat de gebeurtenis over die later pas komt (die tekent de scène zelf).
 */
export const WeekCard: React.FC<{
  week: AgendaProps["week"];
  eventOn: (i: number) => number;
  /** Teken de gebeurtenis die het blokje wegduwt als gewoon blok. */
  showPusher: boolean;
  /** Teken het hele-dag-item van de zorgpremie als vast onderdeel van de kaart (0..1 voor de vlaggen). */
  allDay?: { flag7: number; flag2: number } | null;
  style?: React.CSSProperties;
}> = ({ week, eventOn, showPusher, allDay, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD_H,
        borderRadius: 44,
        background: "#fff",
        boxShadow: "0 30px 80px rgba(1, 30, 140, 0.22)",
        overflow: "hidden",
        fontFamily: decFonts.ui,
        ...style,
      }}
    >
      {week.days.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: CARD.pad + i * COL_W,
            width: COL_W,
            top: 14,
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 500, fontSize: 22, color: "#9aa3b2" }}>{d.name}</div>
          <div style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 44, lineHeight: 1.05, letterSpacing: decTracking, color: p.blue }}>{d.num}</div>
        </div>
      ))}
      {/* hele-dag-rij */}
      <div
        style={{
          position: "absolute",
          left: CARD.pad - 6,
          right: CARD.pad - 6,
          top: CARD.headerH,
          height: CARD.allDayH - 6,
          borderRadius: 18,
          background: p.light,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: CARD.pad + 8,
          top: CARD.headerH + 8,
          fontWeight: 600,
          fontSize: 16,
          color: "#9aa3b2",
          letterSpacing: "0.02em",
        }}
      >
        {week.allDayLabel}
      </div>
      {/* gebeurtenissen */}
      {week.events.map((e, i) => {
        const on = eventOn(i);
        if (on <= 0) return null;
        return (
          <Block
            key={i}
            label={e.label}
            tone={e.tone}
            w={BLOCK_W}
            h={e.len * CARD.slotH - 6}
            style={{
              position: "absolute",
              left: CARD.pad + e.day * COL_W + 4,
              top: CARD.headerH + CARD.allDayH + e.slot * CARD.slotH + 3,
              opacity: Math.min(1, on * 1.6),
              transform: `scale(${0.85 + 0.15 * on})`,
            }}
          />
        );
      })}
      {showPusher ? (
        <Block
          label={week.pusher.label}
          tone={week.pusher.tone}
          h={2 * CARD.slotH - 6}
          style={{
            position: "absolute",
            left: CARD.pad + week.premium.day * COL_W + 4,
            top: CARD.headerH + CARD.allDayH + week.premium.slot * CARD.slotH + 3,
          }}
        />
      ) : null}
      {allDay ? <AllDayItem week={week} flag7={allDay.flag7} flag2={allDay.flag2} inCard /> : null}
    </div>
  );
};

/** Het hele-dag-item van de zorgpremie met twee vlaggetjes (7 en 2 dagen vooraf). */
export const AllDayItem: React.FC<{
  week: AgendaProps["week"];
  flag7: number;
  flag2: number;
  inCard?: boolean;
  style?: React.CSSProperties;
}> = ({ week, flag7, flag2, inCard, style }) => {
  const p = usePalette();
  const left = inCard ? CARD.pad + week.premium.day * COL_W + 4 : colLeft(week.premium.day);
  const top = inCard ? CARD.headerH + 8 : allDayTop;
  const w = BLOCK_W;
  const h = CARD.allDayH - 22;
  const badge = (s: number, x: number, c: string) => (
    <div
      style={{
        position: "absolute",
        left: x - 24,
        top: h - 20,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 8px 20px rgba(1, 30, 140, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${s})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      <Flag size={30} color={c} style={{ marginLeft: 3 }} />
    </div>
  );
  return (
    <div style={{ position: "absolute", left, top, width: w, height: h, zIndex: 6, ...style }}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 14,
          background: p.ink,
          color: "#fff",
          fontFamily: decFonts.ui,
          fontWeight: 600,
          fontSize: 19,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {week.premium.label.replace(/­/g, "")}
      </div>
      {badge(flag7, 28, p.blue)}
      {badge(flag2, w - 28, p.ink)}
    </div>
  );
};
