import React from "react";
import { AppIcon } from "../../../components/AppIcon";
import { Checkmark } from "../../../components/Checkmark";
import { dec, decFonts } from "../../theme";

export const MAIL_W = 900;
export const MAIL_H = 150;

/** Doorgestuurde rekening als rij in een inbox. */
export const MailRow: React.FC<{
  from: string;
  subject: string;
  amount: string;
  forwardLabel: string;
  /** 0..1: de "Doorsturen"-knop wordt ingedrukt. */
  press?: number;
  style?: React.CSSProperties;
}> = ({ from, subject, amount, forwardLabel, press = 0, style }) => (
  <div
    style={{
      width: MAIL_W,
      height: MAIL_H,
      borderRadius: 40,
      background: dec.white,
      boxShadow: "0 22px 60px rgba(1, 40, 160, 0.14)",
      display: "flex",
      alignItems: "center",
      gap: 24,
      padding: "0 32px 0 28px",
      boxSizing: "border-box",
      fontFamily: decFonts.text,
      ...style,
    }}
  >
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: "50%",
        background: dec.ice,
        color: dec.blue,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: decFonts.display,
        fontSize: 40,
        flexShrink: 0,
      }}
    >
      {from[0]}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 34, fontWeight: 600, color: dec.ink, lineHeight: 1.15 }}>{from}</div>
      <div style={{ fontSize: 27, fontWeight: 400, color: dec.greyText, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {subject} · {amount}
      </div>
    </div>
    <div
      style={{
        height: 62,
        borderRadius: 31,
        padding: "0 26px",
        display: "flex",
        alignItems: "center",
        background: press > 0.5 ? dec.deep : dec.blue,
        color: dec.white,
        fontWeight: 600,
        fontSize: 27,
        whiteSpace: "nowrap",
        transform: `scale(${1 - press * 0.08})`,
      }}
    >
      {forwardLabel}
    </div>
  </div>
);

/** Pil met het eigen Buddy-adres. */
export const AddressChip: React.FC<{ text: string; pulse?: number; style?: React.CSSProperties }> = ({
  text,
  pulse = 0,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 18,
      height: 92,
      padding: "0 38px 0 10px",
      borderRadius: 46,
      background: dec.white,
      color: dec.blue,
      fontFamily: decFonts.text,
      fontWeight: 600,
      fontSize: 34,
      transform: `scale(${1 + pulse * 0.07})`,
      boxShadow: "0 18px 50px rgba(1, 40, 160, 0.25)",
      ...style,
    }}
  >
    <AppIcon size={72} />
    {text}
  </div>
);

export const AGENDA_W = 900;
export const AGENDA_H = 330;

/** Agenda-item voor de hele dag, met twee seintjes. */
export const AgendaCard: React.FC<{
  day: string;
  month: string;
  title: string;
  sub: string;
  chipFar: string;
  chipNear: string;
  /** 0..1 tekenen van de vinkjes */
  tickFar?: number;
  tickNear?: number;
  style?: React.CSSProperties;
}> = ({ day, month, title, sub, chipFar, chipNear, tickFar = 0, tickNear = 0, style }) => {
  const chip = (text: string, t: number) => (
    <div
      style={{
        height: 66,
        borderRadius: 33,
        padding: "0 26px 0 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: t > 0.05 ? dec.blue : dec.ice,
        color: t > 0.05 ? dec.white : dec.blue,
        fontWeight: 600,
        fontSize: 28,
        whiteSpace: "nowrap",
      }}
    >
      <Checkmark size={30} color={t > 0.05 ? dec.white : "transparent"} progress={t} strokeWidth={13} />
      {text}
    </div>
  );
  return (
    <div
      style={{
        width: AGENDA_W,
        height: AGENDA_H,
        borderRadius: 48,
        background: dec.white,
        boxShadow: "0 28px 80px rgba(1, 40, 160, 0.16)",
        padding: 36,
        boxSizing: "border-box",
        display: "flex",
        gap: 34,
        fontFamily: decFonts.text,
        ...style,
      }}
    >
      <div
        style={{
          width: 170,
          borderRadius: 32,
          background: dec.blue,
          color: dec.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: decFonts.display, fontSize: 98, lineHeight: 0.95, letterSpacing: "-0.03em" }}>{day}</span>
        <span style={{ fontWeight: 600, fontSize: 34, textTransform: "uppercase", letterSpacing: "0.06em", color: dec.softBlue }}>{month}</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
        <div style={{ fontFamily: decFonts.display, fontSize: 52, lineHeight: 1.05, letterSpacing: "-0.02em", color: dec.ink }}>{title}</div>
        <div style={{ fontSize: 27, fontWeight: 400, color: dec.greyText, marginBottom: 14 }}>{sub}</div>
        <div style={{ display: "flex", gap: 14 }}>
          {chip(chipFar, tickFar)}
          {chip(chipNear, tickNear)}
        </div>
      </div>
    </div>
  );
};
