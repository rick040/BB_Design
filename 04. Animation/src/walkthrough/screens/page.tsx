import React from "react";
import { Buddy } from "../../components/Buddy";
import { fonts } from "../../theme";
import { ArrowIcon, CalIcon, CheckIcon, CopyIcon, ExtIcon, InfoIcon } from "../components/Icons";
import { STATUS_H } from "../layout";
import { bb, wfonts } from "../tokens";

// The setup page /stel-je-buddy-in/ as it looks on a phone (mobile layout of
// the v2 page), rebuilt with its own tokens and copy. Sizes are logical px.

/** An address that may wrap after the @, like the page does with <wbr>. */
export const Addr: React.FC<{ value: string }> = ({ value }) => {
  const i = value.indexOf("@");
  if (i < 0) return <>{value}</>;
  return (
    <>
      {value.slice(0, i + 1)}
      <wbr />
      {value.slice(i + 1)}
    </>
  );
};

export const PageLogo: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
    <Buddy size={22} body={bb.blue} eye="#fff" />
    <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 19, letterSpacing: "-0.06em", lineHeight: 1 }}>
      <span style={{ color: bb.blue }}>betaal</span>
      <span style={{ color: bb.ink }}>buddy</span>
    </span>
  </div>
);

export const PageScreen: React.FC<{
  /** Current step 1..5. */
  step: number;
  /** Steps done (1..n are done). */
  done?: number;
  /** Scroll offset of the page in px. */
  scroll?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ step, done = step - 1, scroll = 0, children, style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: bb.bg,
      fontFamily: wfonts.body,
      color: bb.ink,
      fontSize: 15.5,
      lineHeight: 1.45,
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ padding: `${STATUS_H + URL_BAR_H}px 16px 40px`, transform: `translateY(${-scroll}px)` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 50 }}>
        <PageLogo />
        <span style={{ fontSize: 13.5, fontWeight: 500, color: bb.muted }}>Hulp nodig?</span>
      </div>
      <div
        style={{
          fontFamily: wfonts.heading,
          fontWeight: 600,
          fontSize: 25,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          marginTop: 2,
        }}
      >
        Stel je Buddy in
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginTop: 14 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              height: 6,
              borderRadius: 99,
              background: n <= done || n === step ? bb.blue : bb.barOff,
              boxShadow: n === step ? "0 0 0 3px rgba(1,59,255,.18)" : undefined,
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 9, fontSize: 13.5, fontWeight: 600, color: bb.blue }}>
        {step > 5 ? "Alles klaar" : `Stap ${step} van 5${done ? ` · ${done} klaar` : ""}`}
      </div>
      <div
        style={{
          marginTop: 14,
          background: bb.card,
          border: `1px solid ${bb.line}`,
          borderRadius: 20,
          padding: "20px 18px",
          boxShadow: "0 1px 2px rgba(17,24,39,.04)",
        }}
      >
        {children}
      </div>
    </div>
    <UrlBar scrolled={scroll > 4} />
  </div>
);

const URL_BAR_H = 42;

/** The browser's address bar, so the page reads as "the website", not an app. */
const UrlBar: React.FC<{ scrolled: boolean }> = ({ scrolled }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: STATUS_H + URL_BAR_H,
      paddingTop: STATUS_H,
      boxSizing: "border-box",
      background: "rgba(246,247,249,.97)",
      borderBottom: `1px solid ${scrolled ? bb.line : "transparent"}`,
      display: "flex",
      justifyContent: "center",
      zIndex: 5,
    }}
  >
    <div
      style={{
        marginTop: 2,
        height: 32,
        width: 300,
        borderRadius: 11,
        background: "#E7E9EE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontSize: 14,
        color: bb.ink,
      }}
    >
      <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden>
        <rect x="0.5" y="5.5" width="10" height="7" rx="1.6" fill={bb.muted} />
        <path d="M2.8 5.6V4a2.7 2.7 0 015.4 0v1.6" fill="none" stroke={bb.muted} strokeWidth="1.4" />
      </svg>
      betaalbuddy.nl
    </div>
  </div>
);

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 12.5, fontWeight: 600, color: bb.blue, textTransform: "uppercase", letterSpacing: "0.06em" }}>
    {children}
  </div>
);

export const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: wfonts.heading,
      fontWeight: 600,
      fontSize: 21.5,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
      marginTop: 5,
    }}
  >
    {children}
  </div>
);

export const Lead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ marginTop: 7, color: bb.muted, fontSize: 15 }}>{children}</div>
);

export const Tiny: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: bb.muted, ...style }}>{children}</div>
);

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 7, ...style }}>{children}</div>
);

export const Btn: React.FC<{
  children: React.ReactNode;
  kind?: "blue" | "ink" | "ghost";
  /** 0..1 press state (from pressed()). */
  press?: number;
  tap?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}> = ({ children, kind = "blue", press = 0, tap, disabled, style }) => {
  const bg = disabled
    ? "#C9CFDB"
    : kind === "blue"
      ? press > 0.5
        ? bb.blueD
        : bb.blue
      : kind === "ink"
        ? press > 0.5
          ? "#000"
          : bb.ink
        : "#fff";
  return (
    <div
      data-tap={tap}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        minHeight: 54,
        borderRadius: 14,
        background: bg,
        color: kind === "ghost" ? bb.ink : "#fff",
        border: kind === "ghost" ? `1.5px solid ${bb.field}` : undefined,
        fontSize: kind === "ghost" ? 15 : 16.5,
        fontWeight: kind === "ghost" ? 500 : 600,
        padding: "10px 16px",
        boxSizing: "border-box",
        boxShadow: kind === "blue" && !disabled ? "0 6px 16px rgba(1,59,255,.25)" : undefined,
        transform: `scale(${1 - press * 0.03})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Note: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      padding: "12px 13px",
      borderRadius: 16,
      background: bb.tint2,
      border: `1px solid ${bb.tintLine}`,
      fontSize: 13.5,
      lineHeight: 1.45,
      ...style,
    }}
  >
    <span
      style={{
        flex: "none",
        width: 26,
        height: 26,
        borderRadius: "50%",
        background: bb.blue,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <InfoIcon size={15} />
    </span>
    <div>{children}</div>
  </div>
);

export const CopyField: React.FC<{ value: string; tap?: string; copied?: boolean; press?: number }> = ({
  value,
  tap,
  copied,
  press = 0,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      border: `1.5px solid ${bb.field}`,
      background: bb.fieldBg,
      borderRadius: 14,
      padding: "6px 6px 6px 13px",
      minHeight: 54,
      boxSizing: "border-box",
    }}
  >
    <code
      style={{
        flex: 1,
        minWidth: 0,
        fontFamily: wfonts.mono,
        fontSize: 14.5,
        fontWeight: 600,
        lineHeight: 1.35,
        overflowWrap: "anywhere",
      }}
    >
      <Addr value={value} />
    </code>
    <span
      data-tap={tap}
      style={{
        flex: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 40,
        padding: "0 12px",
        borderRadius: 10,
        background: copied ? bb.ok : bb.ink,
        color: "#fff",
        fontSize: 13,
        fontWeight: 600,
        transform: `scale(${1 - press * 0.05})`,
      }}
    >
      {copied ? (
        "Gekopieerd"
      ) : (
        <>
          <CopyIcon size={15} />
          Kopieer
        </>
      )}
    </span>
  </div>
);

export const InputField: React.FC<{
  label: React.ReactNode;
  value: string;
  placeholder: string;
  state?: "empty" | "focus" | "ok";
  tap?: string;
  /** 0..1, value pops in. */
  fill?: number;
  /** Optional edit menu above the box (e.g. "Plak"). */
  menu?: React.ReactNode;
}> = ({ label, value, placeholder, state = "empty", tap, fill = 1, menu }) => {
  const ok = state === "ok";
  const focus = state === "focus";
  return (
    <div style={{ position: "relative" }}>
      <Label>{label}</Label>
      <div
        data-tap={tap}
        style={{
          position: "relative",
          height: 54,
          borderRadius: 14,
          border: `1.5px solid ${ok ? "#7CC8A0" : focus ? bb.blue : bb.field}`,
          background: ok || focus ? "#fff" : bb.fieldBg,
          boxShadow: focus ? "0 0 0 4px rgba(1,59,255,.14)" : undefined,
          display: "flex",
          alignItems: "center",
          padding: "0 44px 0 13px",
          boxSizing: "border-box",
          fontFamily: wfonts.mono,
          fontSize: 14,
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {value ? (
          <span style={{ color: bb.ink, opacity: fill, overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
        ) : (
          <span style={{ color: "#A6ADBA" }}>{placeholder}</span>
        )}
        {focus && !value ? (
          <span style={{ position: "absolute", left: 12, top: 15, width: 2, height: 22, background: bb.blue }} />
        ) : null}
        {ok ? (
          <span
            style={{
              position: "absolute",
              right: 13,
              top: 15,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: bb.ok,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${fill})`,
            }}
          >
            <CheckIcon size={12} />
          </span>
        ) : null}
      </div>
      {menu}
    </div>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; grey?: boolean }> = ({ children, grey }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 99,
      fontSize: 11.5,
      fontWeight: 600,
      fontFamily: wfonts.body,
      letterSpacing: 0,
      background: grey ? "#F0F2F5" : bb.okBg,
      color: grey ? bb.muted : bb.ok,
      verticalAlign: 2,
    }}
  >
    {children}
  </span>
);

export const Method: React.FC<{ title: React.ReactNode; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  title,
  children,
  style,
}) => (
  <div style={{ border: `1px solid ${bb.line}`, borderRadius: 16, padding: 15, background: "#fff", ...style }}>
    <div style={{ fontFamily: wfonts.heading, fontWeight: 600, fontSize: 16, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
      {title}
    </div>
    {children}
  </div>
);

/** Numbered mini steps (.bb-li), optionally ticked. */
export const MiniList: React.FC<{ items: React.ReactNode[]; ticked?: number }> = ({ items, ticked = 0 }) => (
  <div style={{ display: "grid", gap: 7 }}>
    {items.map((it, i) => {
      const on = i < ticked;
      return (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            padding: 10,
            borderRadius: 13,
            border: `1px solid ${on ? bb.okLine : bb.line}`,
            background: on ? bb.okSoft : "#fff",
            fontSize: 14,
            lineHeight: 1.42,
          }}
        >
          <span
            style={{
              flex: "none",
              width: 23,
              height: 23,
              borderRadius: "50%",
              border: `1.5px solid ${on ? bb.ok : bb.field}`,
              background: on ? bb.ok : "#fff",
              color: on ? "#fff" : bb.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {on ? <CheckIcon size={12} /> : i + 1}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>{it}</span>
        </div>
      );
    })}
  </div>
);

export const Path: React.FC<{ children: React.ReactNode }> = ({ children }) => <b style={{ fontWeight: 600 }}>{children}</b>;

export const Chip: React.FC<{ children: React.ReactNode; block?: boolean }> = ({ children, block }) => (
  <span
    style={{
      display: block ? "flex" : "inline-flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 6,
      padding: block ? "7px 6px 7px 11px" : "2px 4px 2px 9px",
      borderRadius: 9,
      background: bb.tint,
      fontFamily: wfonts.mono,
      fontSize: 12.5,
      fontWeight: 600,
      color: bb.blueD,
      overflowWrap: "anywhere",
      lineHeight: 1.4,
    }}
  >
    <span>{children}</span>
    <span
      style={{
        flex: "none",
        fontFamily: wfonts.body,
        fontSize: 11.5,
        fontWeight: 600,
        background: "#fff",
        color: bb.blue,
        borderRadius: 7,
        padding: "3px 7px",
      }}
    >
      Kopieer
    </span>
  </span>
);

export const Nav: React.FC<{ children: React.ReactNode; back?: boolean }> = ({ children, back = true }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column-reverse",
      gap: 6,
      marginTop: 22,
      paddingTop: 16,
      borderTop: `1px solid ${bb.line2}`,
    }}
  >
    {back ? (
      <div
        style={{
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14.5,
          fontWeight: 500,
          color: bb.muted,
        }}
      >
        Terug
      </div>
    ) : null}
    {children}
  </div>
);

/** The page's toast (bottom, dark pill with a check). */
export const PageToast: React.FC<{ text: string; show: number }> = ({ text, show }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      bottom: 34,
      transform: `translate(-50%, ${(1 - show) * 20}px)`,
      opacity: show,
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "11px 17px",
      borderRadius: 99,
      background: bb.ink,
      color: "#fff",
      fontFamily: wfonts.body,
      fontSize: 14,
      fontWeight: 600,
      whiteSpace: "nowrap",
      boxShadow: "0 10px 30px rgba(17,24,39,.25)",
      zIndex: 30,
    }}
  >
    <CheckIcon size={15} />
    {text}
  </div>
);

/** Calendar choice button (.bb-cal) on step 4. */
export const CalBtn: React.FC<{
  name: string;
  sub: string;
  rec?: boolean;
  external?: boolean;
  tap?: string;
  press?: number;
}> = ({ name, sub, rec, external, tap, press = 0 }) => (
  <div
    data-tap={tap}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      minHeight: 66,
      padding: "11px 13px",
      borderRadius: 16,
      border: `1.5px solid ${rec || press > 0.3 ? bb.blue : bb.line}`,
      boxShadow: rec ? `0 0 0 1px ${bb.blue} inset` : undefined,
      background: press > 0.3 ? bb.tint2 : "#fff",
      transform: `scale(${1 - press * 0.02})`,
      marginTop: 8,
    }}
  >
    <span
      style={{
        flex: "none",
        width: 38,
        height: 38,
        borderRadius: 11,
        background: bb.tint,
        color: bb.blue,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CalIcon size={21} />
    </span>
    <span style={{ flex: 1, minWidth: 0 }}>
      <b style={{ display: "block", fontSize: 15, fontWeight: 600 }}>
        {name}
        {rec ? (
          <span
            style={{
              display: "inline-block",
              marginLeft: 6,
              padding: "1px 7px",
              borderRadius: 99,
              background: bb.blue,
              color: "#fff",
              fontSize: 10.5,
              fontWeight: 600,
              verticalAlign: 2,
            }}
          >
            Voor dit apparaat
          </span>
        ) : null}
      </b>
      <span style={{ display: "block", fontSize: 12.5, color: bb.muted, lineHeight: 1.4 }}>{sub}</span>
    </span>
    <span style={{ flex: "none", color: bb.blue }}>{external ? <ExtIcon size={19} /> : <ArrowIcon size={19} />}</span>
  </div>
);

/** Choice tile (.bb-tile) for the mail program on step 3. */
export const Tile: React.FC<{ name: string; sub: string; on?: boolean; tap?: string; press?: number }> = ({
  name,
  sub,
  on,
  tap,
  press = 0,
}) => (
  <div
    data-tap={tap}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 1,
      minHeight: 58,
      padding: "10px 12px",
      borderRadius: 14,
      border: `1.5px solid ${on ? bb.blue : bb.line}`,
      background: on ? bb.tint2 : "#fff",
      boxShadow: on ? `0 0 0 1px ${bb.blue} inset` : undefined,
      transform: `scale(${1 - press * 0.04})`,
      boxSizing: "border-box",
    }}
  >
    <b style={{ fontSize: 15, fontWeight: 600 }}>{name}</b>
    <span style={{ fontSize: 12, color: bb.muted }}>{sub}</span>
  </div>
);
