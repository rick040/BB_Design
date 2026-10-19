import React from "react";
import { AppIcon } from "../../components/AppIcon";
import { ChevronLeft, ForwardIcon, PencilIcon, ReplyIcon, SendIcon, TrashIcon } from "../components/Icons";
import { SCREEN_H, SCREEN_W, STATUS_H } from "../layout";
import { bb, wfonts } from "../tokens";

// A neutral mail app: no brand look, so it reads as "your own mail".

const AVATAR_BG = ["#FCE7D6", "#DDF3E4", "#E6E1FA", "#FBE0E6", "#DCEEFB"];
const AVATAR_FG = ["#9A4A12", "#1E6B3C", "#4B3A9E", "#9C2A46", "#1F5F8F"];

export const Avatar: React.FC<{ name: string; size?: number; isBb?: boolean }> = ({ name, size = 40, isBb }) => {
  if (isBb) return <AppIcon size={size} circleColor="#EEF2FF" />;
  const i = name.charCodeAt(0) % AVATAR_BG.length;
  return (
    <div
      style={{
        flex: "none",
        width: size,
        height: size,
        borderRadius: "50%",
        background: AVATAR_BG[i],
        color: AVATAR_FG[i],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.42,
      }}
    >
      {name[0]}
    </div>
  );
};

export type InboxMail = {
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
  isBb?: boolean;
  tap?: string;
};

const Row: React.FC<{ m: InboxMail; press?: number }> = ({ m, press = 0 }) => (
  <div
    data-tap={m.tap}
    style={{
      position: "relative",
      display: "flex",
      gap: 12,
      padding: "11px 16px 11px 22px",
      borderBottom: `1px solid ${bb.appLine}`,
      background: press > 0.3 ? "#EEF1F6" : "#fff",
    }}
  >
    {m.unread ? (
      <span style={{ position: "absolute", left: 7, top: 27, width: 9, height: 9, borderRadius: "50%", background: bb.app }} />
    ) : null}
    <Avatar name={m.from} isBb={m.isBb} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontWeight: 650, fontSize: 15.5 }}>{m.from}</span>
        <span style={{ fontSize: 12.5, color: bb.appGrey, flex: "none" }}>{m.time}</span>
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: m.unread ? 600 : 450,
          marginTop: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {m.subject}
      </div>
      <div
        style={{
          fontSize: 13,
          color: bb.appGrey,
          marginTop: 1,
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {m.preview}
      </div>
    </div>
  </div>
);

const ROW_H = 92;

export const MailInbox: React.FC<{
  mails: InboxMail[];
  /** 0..1: the first mail slides in on top (new arrival). */
  arrive?: number;
  /** Press state of the first row. */
  press?: number;
  style?: React.CSSProperties;
}> = ({ mails, arrive = 1, press = 0, style }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: wfonts.body, color: bb.ink, ...style }}>
    <div style={{ paddingTop: STATUS_H }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 12px 0 8px",
          color: bb.app,
          fontSize: 16,
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <ChevronLeft size={24} />
          Postvakken
        </span>
        <span>Wijzig</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 31, letterSpacing: "-0.01em", padding: "4px 16px 8px" }}>Inbox</div>
      <div
        style={{
          margin: "0 16px 8px",
          height: 36,
          borderRadius: 10,
          background: "#EFF0F3",
          color: bb.appGrey,
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
        }}
      >
        Zoek
      </div>
      <div style={{ overflow: "hidden" }}>
        <div style={{ height: ROW_H * arrive, overflow: "hidden", opacity: arrive }}>
          <div style={{ transform: `translateY(${(1 - arrive) * -30}px)` }}>
            <Row m={mails[0]} press={press} />
          </div>
        </div>
        {mails.slice(1).map((m, i) => (
          <Row key={i} m={m} />
        ))}
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 74,
        borderTop: `1px solid ${bb.appLine}`,
        background: "rgba(250,250,252,.96)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "12px 18px 0 60px",
        boxSizing: "border-box",
        fontSize: 12,
        color: bb.appGrey,
      }}
    >
      <span style={{ flex: 1, textAlign: "center", marginTop: 4 }}>Zojuist bijgewerkt</span>
      <span style={{ color: bb.app }}>
        <PencilIcon size={24} />
      </span>
    </div>
  </div>
);

export const MailView: React.FC<{
  from: string;
  isBb?: boolean;
  subject: string;
  time: string;
  children: React.ReactNode;
  /** Show the bottom bar with Antwoord / Doorsturen / Verwijder. */
  toolbar?: boolean;
  forwardPress?: number;
  style?: React.CSSProperties;
}> = ({ from, isBb, subject, time, children, toolbar = true, forwardPress = 0, style }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: wfonts.body, color: bb.ink, ...style }}>
    <div style={{ paddingTop: STATUS_H }}>
      <div style={{ display: "flex", alignItems: "center", padding: "6px 8px 0", color: bb.app, fontSize: 16 }}>
        <ChevronLeft size={24} />
        Inbox
      </div>
      <div style={{ padding: "10px 18px 0" }}>
        <div style={{ fontWeight: 700, fontSize: 20, lineHeight: 1.25 }}>{subject}</div>
        <div style={{ display: "flex", gap: 11, alignItems: "center", marginTop: 14 }}>
          <Avatar name={from} isBb={isBb} size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 650, fontSize: 15 }}>{from}</div>
            <div style={{ fontSize: 12.5, color: bb.appGrey }}>Aan: mij</div>
          </div>
          <span style={{ fontSize: 12.5, color: bb.appGrey, alignSelf: "flex-start", marginTop: 3 }}>{time}</span>
        </div>
        <div style={{ height: 1, background: bb.appLine, margin: "14px 0" }} />
        <div style={{ fontSize: 15, lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
    {toolbar ? (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 80,
          borderTop: `1px solid ${bb.appLine}`,
          background: "rgba(250,250,252,.97)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          padding: "8px 10px 0",
          boxSizing: "border-box",
          color: bb.app,
          fontSize: 11.5,
          fontWeight: 500,
        }}
      >
        {[
          { icon: <ReplyIcon size={23} />, label: "Antwoord", tap: undefined, press: 0 },
          { icon: <ForwardIcon size={23} />, label: "Doorsturen", tap: "forward", press: forwardPress },
          { icon: <TrashIcon size={23} />, label: "Verwijder", tap: undefined, press: 0 },
        ].map((b) => (
          <div
            key={b.label}
            data-tap={b.tap}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "4px 0",
              borderRadius: 12,
              background: b.press > 0.3 ? "#E8EEFB" : undefined,
            }}
          >
            {b.icon}
            {b.label}
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

const FieldRow: React.FC<{ label: string; children: React.ReactNode; tap?: string; mark?: number }> = ({
  label,
  children,
  tap,
  mark = 0,
}) => (
  <div
    data-tap={tap}
    style={{
      display: "flex",
      gap: 6,
      alignItems: "center",
      minHeight: 46,
      padding: "6px 16px",
      borderBottom: `1px solid ${bb.appLine}`,
      fontSize: 15,
      boxSizing: "border-box",
      background: mark > 0 ? `rgba(255, 206, 49, ${0.32 * mark})` : undefined,
      boxShadow: mark > 0 ? `inset 4px 0 0 rgba(230, 170, 0, ${mark})` : undefined,
    }}
  >
    <span style={{ color: bb.appGrey, flex: "none" }}>{label}</span>
    <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>{children}</span>
  </div>
);

/** A recipient token, as mail apps show a filled-in address. */
export const Token: React.FC<{ children: React.ReactNode; pop?: number }> = ({ children, pop = 1 }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 7,
      background: "#E7EEFC",
      color: "#1D4FB8",
      fontSize: 14.5,
      transform: `scale(${0.8 + 0.2 * pop})`,
      opacity: pop,
      transformOrigin: "0 50%",
    }}
  >
    {children}
  </span>
);

export const Caret: React.FC<{ frame: number }> = ({ frame }) => (
  <span
    style={{
      display: "inline-block",
      width: 2,
      height: 19,
      background: bb.app,
      verticalAlign: -4,
      opacity: Math.floor(frame / 9) % 2 ? 0 : 1,
    }}
  />
);

/** A plain on-screen keyboard, so a compose screen looks like you are typing. */
export const Keyboard: React.FC = () => {
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const key = (k: string, w: number | string = 28) => (
    <div
      key={k}
      style={{
        width: w,
        height: 40,
        borderRadius: 5,
        background: "#fff",
        boxShadow: "0 1px 0 #898A8D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: bb.ink,
      }}
    >
      {k}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 240,
        background: "#D3D6DC",
        padding: "8px 3px 0",
        boxSizing: "border-box",
        fontFamily: wfonts.body,
      }}
    >
      {rows.map((r, i) => (
        <div key={r} style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 11 }}>
          {i === 2 ? key("⇧", 38) : null}
          {r.split("").map((c) => key(c))}
          {i === 2 ? key("⌫", 38) : null}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
        {key("123", 40)}
        {key("@", 32)}
        {key("spatie", 170)}
        {key(".", 32)}
        {key("ga", 50)}
      </div>
    </div>
  );
};

export const Compose: React.FC<{
  title?: string;
  to: React.ReactNode;
  from: string;
  subject: string;
  body?: React.ReactNode;
  sendPress?: number;
  /** 0..1 highlight on the "Van" row. */
  markFrom?: number;
  keyboard?: boolean;
}> = ({ title = "Nieuw bericht", to, from, subject, body, sendPress = 0, markFrom = 0, keyboard = true }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", fontFamily: wfonts.body, color: bb.ink }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, padding: "0 12px 0 16px" }}>
      <span style={{ color: bb.app, fontSize: 16 }}>Annuleer</span>
      <span style={{ fontWeight: 650, fontSize: 16.5 }}>{title}</span>
      <span
        data-tap="send"
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: bb.app,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${1 - sendPress * 0.12})`,
        }}
      >
        <SendIcon size={20} />
      </span>
    </div>
    <div style={{ borderTop: `1px solid ${bb.appLine}` }}>
      <FieldRow label="Aan:" tap="to">
        {to}
      </FieldRow>
      <FieldRow label="Van:" mark={markFrom}>
        {from}
      </FieldRow>
      <FieldRow label="Onderwerp:">{subject}</FieldRow>
    </div>
    <div style={{ padding: "14px 16px", fontSize: 14.5, lineHeight: 1.5, whiteSpace: "pre-line" }}>{body}</div>
    {keyboard ? <Keyboard /> : null}
  </div>
);

/** Bottom sheet that slides up over the current screen (p 0..1). */
export const Sheet: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) =>
  p <= 0.001 ? null : (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.28)", opacity: p, zIndex: 20 }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: STATUS_H + 6,
          height: SCREEN_H - STATUS_H - 6,
          borderRadius: "14px 14px 0 0",
          overflow: "hidden",
          background: "#fff",
          transform: `translateY(${(1 - p) * (SCREEN_H - STATUS_H)}px)`,
          boxShadow: "0 -10px 30px rgba(0,0,0,.15)",
          zIndex: 21,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 6,
            left: SCREEN_W / 2 - 18,
            width: 36,
            height: 5,
            borderRadius: 3,
            background: "#D4D6DC",
            zIndex: 2,
          }}
        />
        {children}
      </div>
    </>
  );

/** Style for a screen pushed in from the right (p 0..1) and the one beneath. */
export const pushStyle = (p: number): React.CSSProperties => ({
  transform: `translateX(${(1 - p) * SCREEN_W}px)`,
  boxShadow: p < 1 ? "-12px 0 30px rgba(0,0,0,.12)" : undefined,
  zIndex: 10,
});
export const underStyle = (p: number): React.CSSProperties => ({
  transform: `translateX(${-p * SCREEN_W * 0.28}px)`,
  filter: p > 0 ? `brightness(${1 - p * 0.08})` : undefined,
});

/** Switch between apps: the old one scales back, the new one comes forward. */
export const appOut = (p: number): React.CSSProperties => ({
  transform: `scale(${1 - p * 0.08})`,
  opacity: 1 - p,
  borderRadius: 40 * p,
});
export const appIn = (p: number): React.CSSProperties => ({
  transform: `scale(${1.06 - p * 0.06})`,
  opacity: p,
  zIndex: 10,
});

/** The dark edit menu that pops up over selected text or a field. */
export const EditMenu: React.FC<{
  items: string[];
  /** data-tap ids per item. */
  taps?: (string | undefined)[];
  /** Anchor: centre-bottom of the bubble (the arrow tip), screen px. */
  x: number;
  y: number;
  show: number;
  highlight?: number;
}> = ({ items, taps = [], x, y, show, highlight = -1 }) => (
  // Stays mounted while hidden, so a <Tap> on it can still find it.
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -100%) scale(${0.85 + 0.15 * show})`,
      transformOrigin: "50% 100%",
      opacity: show,
      zIndex: 35,
      fontFamily: wfonts.body,
    }}
  >
    <div
      style={{
        display: "flex",
        borderRadius: 10,
        overflow: "hidden",
        background: "#2A2C31",
        color: "#fff",
        fontSize: 14.5,
        boxShadow: "0 8px 24px rgba(0,0,0,.25)",
      }}
    >
      {items.map((it, i) => (
        <div
          key={it}
          data-tap={taps[i]}
          style={{
            padding: "10px 14px",
            borderLeft: i ? "1px solid rgba(255,255,255,.18)" : undefined,
            background: i === highlight ? "#4A4D55" : undefined,
            whiteSpace: "nowrap",
          }}
        >
          {it}
        </div>
      ))}
    </div>
    <div
      style={{
        width: 0,
        height: 0,
        margin: "0 auto",
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
        borderTop: "8px solid #2A2C31",
      }}
    />
  </div>
);

/** A line of text that can be shown as selected (p 0..1 sweeps left to right). */
export const Sel: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span
    style={{
      backgroundImage: "linear-gradient(rgba(47,111,222,.24), rgba(47,111,222,.24))",
      backgroundRepeat: "no-repeat",
      backgroundSize: `${Math.max(0, Math.min(1, p)) * 100}% 100%`,
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    }}
  >
    {children}
  </span>
);
