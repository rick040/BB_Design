import React from "react";
import { AppIcon } from "../../components/AppIcon";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Cake } from "./BirthdayCalendar";

// A generic calendar app day view: one day, two all-day items.
export const AGENDA_W = 860;
export const AGENDA_H = 430;
export const AGENDA_ITEM2 = { x: 40, y: 280 }; // where the bill item lands

const Item: React.FC<{
  icon: React.ReactNode;
  title: string;
  meta: string;
  accent: string;
  top: number;
  style?: React.CSSProperties;
}> = ({ icon, title, meta, accent, top, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top,
        height: 118,
        borderRadius: 26,
        background: p.light,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 30px 0 0",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ width: 14, alignSelf: "stretch", background: accent }} />
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 38, color: p.ink, fontWeight: 550, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: 28, color: p.greyText, marginTop: 2 }}>{meta}</div>
      </div>
    </div>
  );
};

export const AgendaCard: React.FC<{
  label: string;
  dayLabel: string;
  birthdayItem: string;
  birthdayMeta: string;
  billItem: string;
  billMeta: string;
  /** 0..1 pop of the bill item. */
  billIn: number;
  style?: React.CSSProperties;
}> = ({ label, dayLabel, birthdayItem, birthdayMeta, billItem, billMeta, billIn, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: AGENDA_W,
        height: AGENDA_H,
        borderRadius: 48,
        background: p.white,
        boxShadow: "0 30px 80px rgba(1, 40, 160, 0.14)",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 44, right: 44, top: 34, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 60, letterSpacing: headlineTracking, color: p.ink }}>
          {dayLabel}
        </div>
        <div style={{ fontSize: 30, color: p.blueMid, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
      </div>
      <Item icon={<Cake size={60} />} title={birthdayItem} meta={birthdayMeta} accent={p.yellow} top={140} />
      {billIn > 0 ? (
        <Item
          icon={<AppIcon size={64} circle={false} />}
          title={billItem}
          meta={billMeta}
          accent={p.blue}
          top={AGENDA_ITEM2.y}
          style={{
            opacity: Math.min(1, billIn * 2),
            transform: `scale(${0.8 + 0.2 * billIn})`,
            boxShadow: `0 0 0 ${Math.max(0, 1 - billIn) * 10}px ${p.blueSoft}`,
          }}
        />
      ) : null}
    </div>
  );
};
