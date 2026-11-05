import React from "react";
import { interpolate } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { CTA_H } from "../../components/CtaPill";
import { Notification, NOTIFICATION_H, NOTIFICATION_W } from "../../components/Notification";
import { clamp, pushedSlots } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { FPS, sec } from "../common";
import { Avatar, Bar, Card, CheckIcon, CrossIcon, lin, sp } from "./Card";
import type { Visual, VisualOf } from "./schema";

export type VP<K extends Visual["kind"]> = { v: VisualOf<K>; t: number; onBlue: boolean };

// ---------------------------------------------------------------- bill
export const BillVisual: React.FC<VP<"bill">> = ({ v, t }) => {
  const p = usePalette();
  const stampIn = v.stamp ? sp(t, sec(v.stampAt), 12, 200) : 0;
  const tap = v.tapAt >= 0 ? sec(v.tapAt) : 1e9;
  const press = interpolate(t, [tap, tap + 3, tap + 9], [1, 0.9, 1], clamp);
  const ripple = lin(t, tap + 1, tap + 18);
  const btnIn = sp(t, 8);
  const urgentTick = v.urgent ? Math.max(0, Math.sin(t / 3)) * (t < 30 ? 1 : 0) : 0;
  return (
    <>
      <BillCard
        sender={v.sender}
        subject={v.subject}
        amount={v.amount}
        dueLabel={v.dueLabel}
        urgent={v.urgent}
        tick={urgentTick}
        stamp={v.stamp || undefined}
        stampIn={stampIn}
        style={{ position: "absolute", left: (1080 - BILL_W) / 2, top: v.button ? 200 : 285 }}
      />
      {v.button ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 200 + BILL_H + 60,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, btnIn * 2),
            transform: `scale(${btnIn * press})`,
          }}
        >
          <div
            style={{
              position: "relative",
              height: CTA_H,
              padding: "0 56px",
              borderRadius: CTA_H / 2,
              background: p.blue,
              color: p.white,
              display: "flex",
              alignItems: "center",
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 50,
              letterSpacing: headlineTracking,
              boxShadow: "0 20px 50px rgba(1, 40, 160, 0.3)",
            }}
          >
            {v.button}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 200,
                height: 200,
                marginLeft: -100,
                marginTop: -100,
                borderRadius: "50%",
                border: `5px solid ${p.blue}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0,
                transform: `scale(${0.3 + ripple * 1.3})`,
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------------------------------------------------------------- inbox
export const InboxVisual: React.FC<VP<"inbox">> = ({ v, t }) => {
  const p = usePalette();
  const c = lin(t, 0, sec(v.countLen));
  const eased = 1 - Math.pow(1 - c, 2.2);
  const n = Math.round(v.badgeFrom + (v.badgeTo - v.badgeFrom) * eased);
  const badge = v.badgeTo >= 99 && n >= 99 ? "99+" : String(n);
  const hl = v.highlight >= 0 ? sp(t, sec(v.highlightAt), 13, 200) : 0;
  const ROW = 112;
  return (
    <Card top={40} height={130 + v.rows.length * ROW}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "34px 44px 18px" }}>
        <span style={{ fontSize: 48, fontWeight: 650, color: p.ink }}>{v.title}</span>
        <span
          style={{
            minWidth: 92,
            height: 64,
            padding: "0 22px",
            borderRadius: 32,
            background: p.red,
            color: "#fff",
            fontSize: 36,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 + (c > 0 && c < 1 ? Math.sin(t) * 0.04 : 0)})`,
          }}
        >
          {badge}
        </span>
      </div>
      {v.rows.map((r, i) => {
        // newest rows rain in from the top, already there on frame 0
        const inS = sp(t, -8 + i * 2);
        const isHl = i === v.highlight;
        const dim = v.highlight >= 0 && !isHl ? 1 - hl * 0.55 : 1;
        return (
          <div
            key={i}
            style={{
              height: ROW,
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "0 44px",
              borderTop: `2px solid ${p.grey}`,
              background: isHl ? `rgba(1, 59, 255, ${0.1 * hl})` : "transparent",
              opacity: Math.min(1, inS * 1.5) * dim,
              transform: `translateY(${(1 - inS) * -40}px)`,
            }}
          >
            <Avatar letter={r.from} size={68} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: p.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.from}
              </div>
              <div style={{ fontSize: 28, color: p.greyText, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.subject}
              </div>
            </div>
            {isHl && v.highlightLabel ? (
              <span
                style={{
                  padding: "10px 22px",
                  borderRadius: 26,
                  background: p.blue,
                  color: "#fff",
                  fontSize: 28,
                  fontWeight: 600,
                  opacity: hl,
                  transform: `scale(${0.6 + 0.4 * hl})`,
                  whiteSpace: "nowrap",
                }}
              >
                {v.highlightLabel}
              </span>
            ) : (
              <span style={{ width: 16, height: 16, borderRadius: 8, background: p.blueMid, flexShrink: 0 }} />
            )}
          </div>
        );
      })}
    </Card>
  );
};

// ---------------------------------------------------------------- notifications
export const NotificationsVisual: React.FC<VP<"notifications">> = ({ v, t }) => {
  const arrivals = v.items.map((_, i) => sec(i * v.gap));
  const SLOT = NOTIFICATION_H + 34;
  const top0 = 450 - (v.items.length * SLOT) / 2;
  return (
    <>
      {v.items.map((n, i) => {
        const s = sp(t, arrivals[i], 13, 190);
        if (t < arrivals[i]) return null;
        const pushed = pushedSlots(t, FPS, arrivals, i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (1080 - NOTIFICATION_W) / 2,
              top: top0 + pushed * SLOT - (1 - s) * 40,
              zIndex: i,
              opacity: Math.min(1, s * 1.6),
              transform: `scale(${0.85 + 0.15 * s})`,
            }}
          >
            <Notification text={n.text} time={n.time} icon={n.icon} title={n.title} />
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- calendar
const WEEKDAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];
export const CalendarVisual: React.FC<VP<"calendar">> = ({ v, t }) => {
  const p = usePalette();
  const CELL_W = 118;
  const CELL_H = 74;
  const rows = Math.ceil((v.firstWeekday + v.days) / 7);
  const gridTop = 150;
  const listTop = gridTop + rows * CELL_H + 26;
  const height = listTop + v.marks.length * 64 + 30;
  return (
    <Card top={Math.max(0, 450 - height / 2)} height={height} width={920}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "30px 46px 0" }}>
        <span style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: 600, color: p.ink, letterSpacing: "-0.03em" }}>
          {v.month}
        </span>
        <span style={{ fontSize: 30, color: p.blueMid, fontWeight: 600 }}>{v.calendarName}</span>
      </div>
      <div style={{ position: "absolute", left: 46, top: 108, display: "flex" }}>
        {WEEKDAYS.map((d) => (
          <div key={d} style={{ width: CELL_W, textAlign: "center", fontSize: 26, color: p.greyText }}>
            {d}
          </div>
        ))}
      </div>
      {Array.from({ length: v.days }, (_, i) => {
        const day = i + 1;
        const pos = v.firstWeekday + i;
        const col = pos % 7;
        const row = Math.floor(pos / 7);
        const mi = v.marks.findIndex((m) => m.day === day);
        const m = mi >= 0 ? v.marks[mi] : null;
        const s = m ? sp(t, 10 + sec(mi * v.gap), 11, 200) : 0;
        const tone = m?.tone === "red" ? p.red : p.blue;
        return (
          <div
            key={day}
            style={{
              position: "absolute",
              left: 46 + col * CELL_W,
              top: gridTop + row * CELL_H,
              width: CELL_W,
              height: CELL_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {m ? (
              <div
                style={{
                  position: "absolute",
                  width: 66,
                  height: 66,
                  borderRadius: 33,
                  background: tone,
                  transform: `scale(${s})`,
                }}
              />
            ) : null}
            <span style={{ position: "relative", fontSize: 36, fontWeight: m ? 700 : 450, color: m && s > 0.5 ? "#fff" : p.ink }}>
              {day}
            </span>
          </div>
        );
      })}
      {v.marks.map((m, i) => {
        const s = sp(t, 16 + sec(i * v.gap));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 46,
              right: 46,
              top: listTop + i * 64,
              height: 54,
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 36,
              color: p.ink,
              opacity: Math.min(1, s * 1.5),
              transform: `translateX(${(1 - s) * -30}px)`,
            }}
          >
            <span style={{ width: 18, height: 18, borderRadius: 9, background: m.tone === "red" ? p.red : p.blue }} />
            <b style={{ fontWeight: 650 }}>{m.day}</b>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.label}</span>
          </div>
        );
      })}
    </Card>
  );
};

// ---------------------------------------------------------------- forward
export const ForwardVisual: React.FC<VP<"forward">> = ({ v, t, onBlue }) => {
  const p = usePalette();
  const TAP = 16;
  const tapped = v.phase !== "tap" || t >= TAP;
  const press = v.phase === "tap" ? interpolate(t, [TAP, TAP + 3, TAP + 9], [1, 0.9, 1], clamp) : 1;
  const ripple = v.phase === "tap" ? lin(t, TAP + 1, TAP + 18) : 0;
  const typed = v.phase === "address" ? lin(t, 10, 42) : v.phase === "sent" ? 1 : 0;
  const shown = v.to.slice(0, Math.round(v.to.length * typed));
  const fly = v.phase === "sent" ? lin(t, 12, 30) : 0;
  const flyE = fly * fly;
  const done = v.phase === "sent" ? sp(t, 26, 12, 200) : 0;
  return (
    <>
      <Card
        top={60}
        height={v.phase === "tap" ? 520 : 600}
        style={{
          padding: "38px 46px",
          transform: `translateY(${-flyE * 520}px) scale(${1 - flyE * 0.5}) rotate(${-flyE * 6}deg)`,
          opacity: 1 - fly,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Avatar letter={v.from} size={80} />
          <div>
            <div style={{ fontSize: 36, fontWeight: 600, color: p.ink }}>{v.from}</div>
            <div style={{ fontSize: 30, color: p.greyText }}>{v.subject}</div>
          </div>
        </div>
        {v.phase === "tap" ? (
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
            <Bar w="92%" />
            <Bar w="78%" />
            <Bar w="85%" />
            <Bar w="40%" />
          </div>
        ) : (
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 32, color: p.greyText, borderBottom: `2px solid ${p.grey}`, paddingBottom: 18 }}>
              Aan:
              <span
                style={{
                  color: p.ink,
                  fontWeight: 600,
                  background: typed >= 1 ? p.blueSoft + "66" : "transparent",
                  borderRadius: 12,
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                {shown}
                {typed < 1 && Math.floor(t / 8) % 2 === 0 ? "|" : ""}
              </span>
            </div>
            <div style={{ fontSize: 30, color: p.greyText }}>{v.fwd ? "Fwd" : "Onderwerp"}: {v.subject}</div>
            <Bar w="70%" />
            <Bar w="55%" />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            right: 46,
            bottom: 40,
            height: 92,
            padding: "0 44px",
            borderRadius: 46,
            background: tapped ? p.blue : p.grey,
            color: tapped ? "#fff" : p.ink,
            display: "flex",
            alignItems: "center",
            fontSize: 36,
            fontWeight: 600,
            transform: `scale(${press})`,
          }}
        >
          {v.button}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 180,
              height: 180,
              marginLeft: -90,
              marginTop: -90,
              borderRadius: "50%",
              border: `5px solid ${p.blue}`,
              opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0,
              transform: `scale(${0.3 + ripple * 1.3})`,
            }}
          />
        </div>
      </Card>
      {v.phase === "sent" ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 330,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            opacity: done,
            transform: `scale(${0.6 + 0.4 * done})`,
          }}
        >
          <CheckIcon size={170} color={onBlue ? p.white : p.blue} />
          <div style={{ fontFamily: fonts.display, fontSize: 58, fontWeight: 500, color: onBlue ? p.white : p.blue, letterSpacing: "-0.03em" }}>
            Verstuurd
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------------------------------------------------------------- rule (mail filter)
export const RuleVisual: React.FC<VP<"rule">> = ({ v, t }) => {
  const p = usePalette();
  const on = sp(t, 34, 16, 200);
  const row = (label: string, value: string, delay: number) => {
    const s = sp(t, delay);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: Math.min(1, s * 1.5), transform: `translateX(${(1 - s) * 40}px)` }}>
        <span style={{ width: 96, fontSize: 34, color: p.greyText, fontWeight: 600 }}>{label}</span>
        <span style={{ flex: 1, padding: "20px 28px", borderRadius: 24, background: p.light, border: `2px solid ${p.grey}`, fontSize: 34, color: p.ink }}>
          {value}
        </span>
      </div>
    );
  };
  return (
    <Card top={150} height={540} style={{ padding: "40px 46px", display: "flex", flexDirection: "column", gap: 34 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 44, fontWeight: 650, color: p.ink }}>{v.title}</span>
        <div style={{ width: 120, height: 66, borderRadius: 33, background: on > 0.5 ? p.blue : p.grey, position: "relative" }}>
          <div style={{ position: "absolute", top: 7, left: 7 + on * 54, width: 52, height: 52, borderRadius: 26, background: "#fff", boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }} />
        </div>
      </div>
      {row("Als", v.when, 6)}
      {row("Dan", v.then, 14)}
      <div style={{ fontSize: 30, color: p.blueMid, fontWeight: 600, opacity: lin(t, 40, 50) }}>Regel staat aan</div>
    </Card>
  );
};

// ---------------------------------------------------------------- fields (what is kept)
export const FieldsVisual: React.FC<VP<"fields">> = ({ v, t }) => {
  const p = usePalette();
  const ROW = 120;
  const height = 140 + v.rows.length * ROW;
  return (
    <Card top={Math.max(0, 450 - height / 2)} height={height}>
      <div style={{ padding: "38px 46px 22px", fontSize: 44, fontWeight: 650, color: p.ink }}>{v.title}</div>
      {v.rows.map((r, i) => {
        const s = sp(t, 6 + sec(i * v.gap));
        const strike = r.kept ? 0 : lin(t, 6 + sec(i * v.gap) + 6, 6 + sec(i * v.gap) + 16);
        return (
          <div
            key={i}
            style={{
              height: ROW,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "0 46px",
              borderTop: `2px solid ${p.grey}`,
              opacity: Math.min(1, s * 1.5),
              transform: `translateY(${(1 - s) * 24}px)`,
            }}
          >
            {r.kept ? <CheckIcon size={50} color={p.blue} /> : <CrossIcon size={50} color={p.red} />}
            <span style={{ fontSize: 36, color: p.greyText, width: 270, flexShrink: 0 }}>{r.label}</span>
            <span style={{ position: "relative", fontSize: 40, fontWeight: 600, color: r.kept ? p.ink : p.greyText, whiteSpace: "nowrap" }}>
              {r.value}
              {!r.kept ? (
                <span style={{ position: "absolute", left: 0, top: "52%", height: 4, width: `${strike * 100}%`, background: p.red, borderRadius: 2 }} />
              ) : null}
            </span>
          </div>
        );
      })}
    </Card>
  );
};

// ---------------------------------------------------------------- mail (find the due date)
export const MailVisual: React.FC<VP<"mail">> = ({ v, t }) => {
  const p = usePalette();
  const find = sec(v.findAt);
  // magnifier wanders over the mail, then lands on the tiny line
  const wander = Math.min(t, find) / 9;
  const mx = 540 + Math.sin(wander) * 250;
  const my = 330 + Math.cos(wander * 1.3) * 140;
  const land = lin(t, find - 8, find);
  const lx = interpolate(land, [0, 1], [mx, 380]);
  const ly = interpolate(land, [0, 1], [my, 704]);
  const zoom = sp(t, find + 2, 12, 180);
  return (
    <>
      <Card top={40} height={720} style={{ padding: "38px 46px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Avatar letter={v.from} size={80} />
          <div>
            <div style={{ fontSize: 36, fontWeight: 600, color: p.ink }}>{v.from}</div>
            <div style={{ fontSize: 30, color: p.greyText }}>{v.subject}</div>
          </div>
        </div>
        <div style={{ marginTop: 40, height: 120, borderRadius: 24, background: p.blueSoft + "55" }} />
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 20 }}>
          <Bar w="94%" />
          <Bar w="88%" />
          <Bar w="72%" />
          <Bar w="90%" />
          <Bar w="60%" />
          <Bar w="83%" />
        </div>
        <div style={{ position: "absolute", left: 46, bottom: 34, fontSize: 19, color: "#c9c7cc", letterSpacing: "0.02em" }}>
          {v.tinyLine}
        </div>
      </Card>
      <div
        style={{
          position: "absolute",
          left: lx - 85,
          top: ly - 85,
          width: 170,
          height: 170,
          borderRadius: "50%",
          border: `10px solid ${p.ink}`,
          opacity: 1 - zoom,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 640,
          padding: "22px 28px",
          borderRadius: 28,
          background: p.yellow,
          fontFamily: fonts.ui,
          fontSize: 44,
          fontWeight: 650,
          color: p.ink,
          textAlign: "center",
          opacity: zoom,
          transform: `scale(${0.3 + 0.7 * zoom}) rotate(${(1 - zoom) * -4}deg)`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
          whiteSpace: "nowrap",
        }}
      >
        {v.tinyLine}
      </div>
    </>
  );
};

// ---------------------------------------------------------------- weekly overview
export const OverviewVisual: React.FC<VP<"overview">> = ({ v, t }) => {
  const p = usePalette();
  const ROW = 116;
  const height = 210 + v.rows.length * ROW + 110;
  return (
    <Card top={Math.max(0, 450 - height / 2)} height={height}>
      <div style={{ padding: "34px 46px 0", fontSize: 28, color: p.greyText }}>Maandag · BetaalBuddy</div>
      <div style={{ padding: "8px 46px 22px", fontSize: 42, fontWeight: 650, color: p.ink, lineHeight: 1.15 }}>{v.title}</div>
      {v.rows.map((r, i) => {
        const s = sp(t, 8 + i * 6);
        return (
          <div
            key={i}
            style={{
              height: ROW,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "0 46px",
              borderTop: `2px solid ${p.grey}`,
              opacity: Math.min(1, s * 1.5),
              transform: `translateX(${(1 - s) * 40}px)`,
            }}
          >
            <Avatar letter={r.label} size={64} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 34, fontWeight: 600, color: p.ink }}>{r.label}</div>
              <div style={{ fontSize: 28, color: p.greyText }}>{r.due}</div>
            </div>
            <span style={{ fontFamily: fonts.display, fontSize: 48, fontWeight: 500, color: p.ink, letterSpacing: "-0.04em" }}>
              {r.amount}
            </span>
          </div>
        );
      })}
      <div style={{ padding: "26px 46px", borderTop: `2px solid ${p.grey}`, fontSize: 27, color: p.greyText, lineHeight: 1.3, opacity: lin(t, 26, 38) }}>
        {v.footer}
      </div>
    </Card>
  );
};

// ---------------------------------------------------------------- rules (fixed extraction rules on an invoice)
export const RulesVisual: React.FC<VP<"rules">> = ({ v, t }) => {
  const p = usePalette();
  const ROW = 92;
  const height = 150 + v.lines.length * ROW;
  const top = 900 - height - 10;
  const current = Math.max(0, Math.min(v.upTo, v.items.length - 1));
  const capIn = sp(t, 4);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 0,
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "16px 30px",
          borderRadius: 32,
          background: p.blue,
          border: `3px solid ${p.blueSoft}`,
          color: "#fff",
          fontFamily: fonts.display,
          fontSize: 46,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          opacity: capIn,
          transform: `translateY(${(1 - capIn) * -30}px)`,
          boxSizing: "border-box",
        }}
      >
        {v.items[current]?.rule}
      </div>
      <Card top={top} height={height} style={{ padding: "34px 46px" }}>
        <div style={{ fontSize: 30, color: p.greyText, marginBottom: 14 }}>Factuur</div>
        {v.lines.map((l, i) => {
          const itemIdx = v.items.findIndex((it) => it.label === l.label);
          const active = itemIdx >= 0 && itemIdx <= v.upTo;
          const h = !active ? 0 : itemIdx < v.upTo ? 1 : sp(t, 16, 14, 200);
          const hv = !active ? 0 : itemIdx < v.upTo ? 1 : sp(t, 26, 14, 200);
          return (
            <div key={i} style={{ height: ROW, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 36, color: p.ink }}>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: 14,
                  outline: `4px solid rgba(1, 59, 255, ${h})`,
                  outlineOffset: 0,
                  fontWeight: active ? 650 : 450,
                }}
              >
                {l.label}
              </span>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: 14,
                  background: `rgba(182, 199, 255, ${hv})`,
                  fontWeight: active ? 650 : 450,
                  transform: `scale(${1 + hv * 0.06})`,
                }}
              >
                {l.value}
              </span>
            </div>
          );
        })}
      </Card>
    </>
  );
};

// ---------------------------------------------------------------- lines (generic list card)
export const LinesVisual: React.FC<VP<"lines">> = ({ v, t }) => {
  const p = usePalette();
  const ROW = 122;
  const height = (v.title ? 130 : 30) + v.items.length * ROW + 20;
  return (
    <Card top={Math.max(0, 450 - height / 2)} height={height}>
      {v.title ? <div style={{ padding: "38px 46px 16px", fontSize: 44, fontWeight: 650, color: p.ink }}>{v.title}</div> : null}
      {v.items.map((it, i) => {
        const at = 6 + sec(i * v.gap);
        const s = sp(t, at);
        const strike = it.tone === "strike" ? lin(t, at + 8, at + 18) : 0;
        const color =
          it.tone === "good" ? p.blue : it.tone === "bad" ? p.red : it.tone === "muted" || it.tone === "strike" ? p.greyText : p.ink;
        return (
          <div
            key={i}
            style={{
              height: ROW,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "0 46px",
              borderTop: i === 0 && !v.title ? "none" : `2px solid ${p.grey}`,
              opacity: Math.min(1, s * 1.5),
              transform: `translateX(${(1 - s) * 40}px)`,
            }}
          >
            {it.tone === "good" ? <CheckIcon size={46} color={p.blue} /> : null}
            {it.tone === "bad" ? <CrossIcon size={46} color={p.red} /> : null}
            <span style={{ position: "relative", fontSize: 44, fontWeight: it.tone === "good" ? 650 : 500, color, whiteSpace: "nowrap" }}>
              {it.text}
              {it.tone === "strike" ? (
                <span style={{ position: "absolute", left: 0, top: "54%", height: 4, width: `${strike * 100}%`, background: p.red, borderRadius: 2 }} />
              ) : null}
            </span>
          </div>
        );
      })}
    </Card>
  );
};
