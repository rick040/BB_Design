import React from "react";
import { ChevronLeft } from "../components/Icons";
import { STATUS_H } from "../layout";
import { bb, wfonts } from "../tokens";

// A neutral calendar app: the subscribe prompt, then a list with the due dates.

// Stays mounted while hidden, so a <Tap> on it can still find it.
export const SubscribeAlert: React.FC<{ url: string; show: number; press?: number }> = ({ url, show, press = 0 }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.32)", opacity: show, zIndex: 30 }} />
    <div
      style={{
        position: "absolute",
        left: 35,
        right: 35,
        top: 270,
        borderRadius: 16,
        background: "rgba(246,246,249,.98)",
        overflow: "hidden",
        fontFamily: wfonts.body,
        color: bb.ink,
        textAlign: "center",
        transform: `scale(${1.12 - 0.12 * show})`,
        opacity: show,
        zIndex: 31,
        boxShadow: "0 20px 50px rgba(0,0,0,.2)",
      }}
    >
      <div style={{ padding: "18px 16px 16px" }}>
        <div style={{ fontWeight: 650, fontSize: 16.5 }}>Agenda-abonnement</div>
        <div style={{ fontSize: 13.5, marginTop: 5, lineHeight: 1.4 }}>Wil je je abonneren op deze agenda?</div>
        <div style={{ fontFamily: wfonts.mono, fontSize: 11.5, color: bb.muted, marginTop: 6, overflowWrap: "anywhere" }}>
          {url}
        </div>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #DADBE0", fontSize: 16, color: bb.app }}
      >
        <div style={{ padding: "12px 0", borderRight: "1px solid #DADBE0" }}>Annuleer</div>
        <div data-tap="subscribe" style={{ padding: "12px 0", fontWeight: 650, background: press > 0.3 ? "#E3E5EA" : undefined }}>
          Abonneer
        </div>
      </div>
    </div>
  </>
);

export type AgendaEvent = { day: string; title: string; sub: string };

export const AgendaList: React.FC<{
  events: AgendaEvent[];
  /** 0..1 per event: pops into the list. */
  show: number[];
  style?: React.CSSProperties;
}> = ({ events, show, style }) => {
  const week = [
    ["ma", 19],
    ["di", 20],
    ["wo", 21],
    ["do", 22],
    ["vr", 23],
    ["za", 24],
    ["zo", 25],
  ] as const;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: wfonts.body, color: bb.ink, ...style }}>
      <div style={{ paddingTop: STATUS_H }}>
        <div style={{ display: "flex", alignItems: "center", padding: "6px 8px 0", color: bb.app, fontSize: 16 }}>
          <ChevronLeft size={24} />
          2026
        </div>
        <div style={{ fontWeight: 700, fontSize: 29, padding: "2px 16px 10px" }}>Oktober</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            padding: "0 10px 10px",
            borderBottom: `1px solid ${bb.appLine}`,
            textAlign: "center",
          }}
        >
          {week.map(([d, n]) => (
            <div key={d}>
              <div style={{ fontSize: 11.5, color: bb.appGrey, textTransform: "uppercase" }}>{d}</div>
              <div
                style={{
                  margin: "4px auto 0",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  lineHeight: "32px",
                  fontSize: 16,
                  fontWeight: n === 19 ? 650 : 450,
                  background: n === 19 ? "#E5484D" : undefined,
                  color: n === 19 ? "#fff" : bb.ink,
                }}
              >
                {n}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "8px 16px" }}>
          {events.map((e, i) => {
            const s = show[i] ?? 1;
            return (
              <div
                key={i}
                style={{
                  marginTop: 10,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 14}px) scale(${0.94 + 0.06 * s})`,
                  transformOrigin: "0 50%",
                }}
              >
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: bb.appGrey,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  {e.day}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: bb.tint2,
                    boxShadow: `inset 4px 0 0 ${bb.blue}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 650, fontSize: 15 }}>{e.title}</div>
                    <div style={{ fontSize: 12.5, color: bb.muted, marginTop: 1 }}>{e.sub}</div>
                  </div>
                  <span style={{ fontSize: 12, color: bb.muted }}>hele dag</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
