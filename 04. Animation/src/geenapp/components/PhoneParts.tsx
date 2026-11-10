import React from "react";
import { fonts } from "../../theme";

// Generic app tiles (no real brands), the phone body, the install sheet,
// the forwarded mail and the agenda widget for concept 67.

export type Glyph = "circle" | "square" | "tri" | "bars" | "ring" | "plus" | "wave" | "dots";

export const APP_COLORS = [
  "#ff8a3d", "#2ec27e", "#9b5cff", "#ff5a79", "#18b6c9", "#ffce31", "#5a6b7d", "#ff6fb5",
  "#3d8bff", "#7ccf3d", "#c4532f", "#00a68c", "#8a6cff", "#ff9f1c", "#4b5563", "#e04f8b",
];
export const APP_GLYPHS: Glyph[] = ["circle", "bars", "tri", "ring", "square", "wave", "plus", "dots"];
export const APP_BADGES: (number | null)[] = [3, null, 12, null, null, 1, null, 7, null, 24, null, null, 2, null, 9, null];

const GlyphSvg: React.FC<{ g: Glyph; c: string }> = ({ g, c }) => {
  switch (g) {
    case "circle":
      return <circle cx={50} cy={50} r={22} fill={c} />;
    case "square":
      return <rect x={29} y={29} width={42} height={42} rx={8} fill={c} />;
    case "tri":
      return <path d="M50 26 L76 72 H24 Z" fill={c} />;
    case "bars":
      return (
        <g fill={c}>
          <rect x={26} y={52} width={12} height={22} rx={3} />
          <rect x={44} y={38} width={12} height={36} rx={3} />
          <rect x={62} y={26} width={12} height={48} rx={3} />
        </g>
      );
    case "ring":
      return <circle cx={50} cy={50} r={20} fill="none" stroke={c} strokeWidth={10} />;
    case "plus":
      return (
        <g fill={c}>
          <rect x={44} y={24} width={12} height={52} rx={4} />
          <rect x={24} y={44} width={52} height={12} rx={4} />
        </g>
      );
    case "wave":
      return <path d="M22 56 Q36 32 50 50 T78 44" fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" />;
    case "dots":
      return (
        <g fill={c}>
          {[34, 66].flatMap((x) => [34, 66].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={9} />))}
        </g>
      );
  }
};

export const AppTile: React.FC<{
  size: number;
  color: string;
  glyph: Glyph;
  badge?: number | null;
  style?: React.CSSProperties;
}> = ({ size, color, glyph, badge, style }) => (
  <div style={{ position: "absolute", width: size, height: size, ...style }}>
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
      <rect width={100} height={100} rx={24} fill={color} />
      <GlyphSvg g={glyph} c="#ffffff" />
    </svg>
    {badge ? (
      <div
        style={{
          position: "absolute",
          top: -size * 0.12,
          right: -size * 0.12,
          minWidth: size * 0.36,
          height: size * 0.36,
          padding: `0 ${size * 0.08}px`,
          boxSizing: "border-box",
          borderRadius: size * 0.18,
          background: "#ff3b30",
          color: "#fff",
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: size * 0.22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid #fff",
        }}
      >
        {badge}
      </div>
    ) : null}
  </div>
);

export const MailTile: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", display: "block", ...style }}>
    <rect width={100} height={100} rx={24} fill="#ffffff" />
    <rect x={20} y={30} width={60} height={42} rx={7} fill="none" stroke="#013bff" strokeWidth={7} />
    <path d="M22 34 L50 55 L78 34" fill="none" stroke="#013bff" strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

export const AgendaTile: React.FC<{ size: number; day: string; date: string; style?: React.CSSProperties }> = ({
  size,
  day,
  date,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: fonts.ui,
      lineHeight: 1,
      ...style,
    }}
  >
    <div style={{ fontSize: size * 0.2, fontWeight: 600, color: "#ff3b30" }}>{day}</div>
    <div style={{ fontSize: size * 0.46, fontWeight: 500, color: "#111114", marginTop: size * 0.03 }}>{date}</div>
  </div>
);

export const PHONE = { w: 440, h: 880, bezel: 16 } as const;
export const SCREEN = { w: PHONE.w - PHONE.bezel * 2, h: PHONE.h - PHONE.bezel * 2 } as const;

/** Phone body; children are drawn on the (clipped) screen, centre origin. */
export const PhoneBody: React.FC<{ wallpaper: string; children?: React.ReactNode }> = ({ wallpaper, children }) => (
  <div
    style={{
      position: "absolute",
      left: -PHONE.w / 2,
      top: -PHONE.h / 2,
      width: PHONE.w,
      height: PHONE.h,
      borderRadius: 70,
      background: "#111114",
      boxShadow: "0 40px 90px rgba(1, 30, 140, 0.28)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: PHONE.bezel,
        top: PHONE.bezel,
        width: SCREEN.w,
        height: SCREEN.h,
        borderRadius: 56,
        overflow: "hidden",
        background: wallpaper,
      }}
    >
      <div style={{ position: "absolute", left: SCREEN.w / 2, top: SCREEN.h / 2 }}>{children}</div>
      {/* status bar */}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 40,
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: 24,
          color: "#fff",
        }}
      >
        9:41
      </div>
      <div
        style={{
          position: "absolute",
          top: 16,
          left: SCREEN.w / 2 - 60,
          width: 120,
          height: 36,
          borderRadius: 18,
          background: "#111114",
        }}
      />
    </div>
  </div>
);

export const InstallSheet: React.FC<{
  title: string;
  installing: string;
  chip: string;
  progress: number;
  chipIn: number;
  width: number;
}> = ({ title, installing, chip, progress, chipIn, width }) => {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <div
      style={{
        width,
        borderRadius: 34,
        background: "#ffffff",
        padding: "26px 26px 30px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        boxShadow: "0 -10px 40px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <AppTile size={72} color="#c9d1db" glyph="square" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 27, fontWeight: 600, color: "#111114" }}>{title}</div>
          <div style={{ fontSize: 22, color: "#8a8a90", marginTop: 6 }}>{installing}</div>
        </div>
        <svg width={56} height={56} viewBox="0 0 56 56">
          <circle cx={28} cy={28} r={r} fill="none" stroke="#e8edf2" strokeWidth={6} />
          <circle
            cx={28}
            cy={28}
            r={r}
            fill="none"
            stroke="#2459fd"
            strokeWidth={6}
            strokeDasharray={c}
            strokeDashoffset={c * (1 - progress)}
            strokeLinecap="round"
            transform="rotate(-90 28 28)"
          />
        </svg>
      </div>
      <div
        style={{
          marginTop: 22,
          display: "inline-block",
          padding: "10px 20px",
          borderRadius: 22,
          background: "#ff5a79",
          color: "#fff",
          fontSize: 24,
          fontWeight: 600,
          transform: `scale(${chipIn})`,
          transformOrigin: "left center",
          opacity: Math.min(1, chipIn * 2),
        }}
      >
        {chip}
      </div>
    </div>
  );
};

export const MailCard: React.FC<{
  sender: string;
  subject: string;
  amount: string;
  due: string;
  button: string;
  press: number;
  width: number;
}> = ({ sender, subject, amount, due, button, press, width }) => (
  <div
    style={{
      width,
      borderRadius: 30,
      background: "#ffffff",
      padding: 24,
      boxSizing: "border-box",
      fontFamily: fonts.ui,
      boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          background: "#ffce31",
          color: "#111114",
          fontWeight: 600,
          fontSize: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        E
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 25, fontWeight: 600, color: "#111114" }}>{sender}</div>
        <div style={{ fontSize: 20, color: "#8a8a90", marginTop: 4 }}>{subject}</div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 18 }}>
      <div style={{ fontSize: 44, fontWeight: 600, color: "#111114", letterSpacing: "-0.02em" }}>{amount}</div>
      <div style={{ fontSize: 20, color: "#ff5a79", fontWeight: 600 }}>{due}</div>
    </div>
    <div
      style={{
        marginTop: 18,
        height: 60,
        borderRadius: 30,
        background: "#013bff",
        color: "#fff",
        fontSize: 25,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        transform: `scale(${1 - 0.07 * press})`,
        boxShadow: press > 0 ? `0 0 0 ${press * 14}px rgba(1,59,255,${0.25 * press})` : "none",
      }}
    >
      <svg width={26} height={26} viewBox="0 0 26 26">
        <path d="M3 13h18M14 6l7 7-7 7" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {button}
    </div>
  </div>
);

export const DateChip: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      padding: "14px 24px",
      borderRadius: 26,
      background: "#ffffff",
      border: "4px solid #013bff",
      color: "#013bff",
      fontFamily: fonts.ui,
      fontWeight: 600,
      fontSize: 34,
      whiteSpace: "nowrap",
      boxShadow: "0 12px 30px rgba(1,30,140,0.2)",
    }}
  >
    {text}
  </div>
);

export const AgendaWidget: React.FC<{
  month: string;
  day: string;
  date: string;
  event: string;
  reminder: string;
  eventIn: number;
  width: number;
}> = ({ month, day, date, event, reminder, eventIn, width }) => (
  <div
    style={{
      width,
      borderRadius: 36,
      background: "#ffffff",
      padding: 28,
      boxSizing: "border-box",
      fontFamily: fonts.ui,
      boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    }}
  >
    <div style={{ fontSize: 22, color: "#ff3b30", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {month}
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 6 }}>
      <div style={{ fontSize: 30, color: "#8a8a90", fontWeight: 500 }}>{day}</div>
      <div style={{ fontSize: 76, color: "#111114", fontWeight: 500, lineHeight: 1 }}>{date}</div>
    </div>
    <div
      style={{
        marginTop: 18,
        borderRadius: 18,
        background: "#013bff",
        color: "#fff",
        padding: "14px 18px",
        fontSize: 24,
        fontWeight: 600,
        transform: `scale(${0.6 + 0.4 * eventIn})`,
        transformOrigin: "left center",
        opacity: eventIn,
      }}
    >
      {event}
    </div>
    <div
      style={{
        marginTop: 14,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 20,
        color: "#5a6b7d",
        opacity: eventIn,
      }}
    >
      <svg width={24} height={24} viewBox="0 0 24 24">
        <path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4z M10 21h4" fill="#2459fd" stroke="#2459fd" strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
      {reminder}
    </div>
  </div>
);
