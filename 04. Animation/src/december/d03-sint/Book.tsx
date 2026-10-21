import React from "react";
import { decFonts, decTracking } from "../theme";

// Ontwerpmaten van het boek (twee pagina's naast elkaar).
export const BOOK_W = 800;
export const BOOK_H = 520;
const PAGE_W = BOOK_W / 2;
const ROW_H = 84;
const ROW_TOP = 74;

export type BookRow = { name: string; date: string };

const Tick: React.FC<{ progress: number; color: string }> = ({ progress, color }) => (
  <svg width={44} height={44} viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
    <circle cx={22} cy={22} r={18} fill="none" stroke={color} strokeWidth={3} opacity={0.35} />
    <circle cx={22} cy={22} r={18} fill={color} opacity={Math.min(1, progress * 1.4)} />
    <path
      d="M13 23 L19.5 29 L31 15"
      fill="none"
      stroke="#fff"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
    />
  </svg>
);

const Page: React.FC<{
  rows: BookRow[];
  startIndex: number;
  rowOn: (i: number) => number;
  ink: string;
  accent: string;
  radius: string;
}> = ({ rows, startIndex, rowOn, ink, accent, radius }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "#fff",
      borderRadius: radius,
      fontFamily: decFonts.text,
    }}
  >
    {rows.map((r, k) => {
      const on = rowOn(startIndex + k);
      return (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 34,
            right: 34,
            top: ROW_TOP + k * ROW_H,
            height: ROW_H,
            borderBottom: "2px solid #e3e8f7",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Tick progress={on} color={accent} />
          <div
            style={{
              flex: 1,
              fontWeight: 500,
              fontSize: 38,
              letterSpacing: decTracking,
              color: ink,
              opacity: on,
              transform: `translateX(${(1 - on) * -18}px)`,
            }}
          >
            {r.name}
          </div>
          <div style={{ fontWeight: 400, fontSize: 28, color: "#6b7280", opacity: on }}>{r.date}</div>
        </div>
      );
    })}
  </div>
);

/**
 * Open boek met een lijst namen en data. `open` 0 = dicht (alleen de kaft), 1 = open.
 * De kaft draait om de rug met CSS 3D (geen WebGL). Het boek is `BOOK_W × BOOK_H`
 * en staat zo geplaatst dat het open boek gecentreerd is op `left` + BOOK_W / 2.
 */
export const Book: React.FC<{
  open: number;
  rows: BookRow[];
  /** 0..1 per rij (index 0 t/m 9: eerst de linker, dan de rechter pagina). */
  rowOn: (i: number) => number;
  coverTitle: string;
  cover: string;
  coverAccent: string;
  ink: string;
  accent: string;
  style?: React.CSSProperties;
}> = ({ open, rows, rowOn, coverTitle, cover, coverAccent, ink, accent, style }) => {
  const angle = open * 180;
  const shift = -(PAGE_W / 2) * (1 - open); // dicht boek staat midden in beeld
  const perPage = 5;
  return (
    <div
      style={{
        position: "relative",
        width: BOOK_W,
        height: BOOK_H,
        perspective: 2400,
        transform: `translateX(${shift}px)`,
        ...style,
      }}
    >
      {/* bodem van het boek: de kaft die onder de pagina's doorloopt */}
      <div
        style={{
          position: "absolute",
          left: -14,
          top: -14,
          width: BOOK_W + 28,
          height: BOOK_H + 28,
          borderRadius: 30,
          background: cover,
          opacity: open > 0.5 ? 1 : 0,
          boxShadow: "0 40px 90px rgba(1, 20, 120, 0.35)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: PAGE_W - 14,
          top: -14,
          width: PAGE_W + 28,
          height: BOOK_H + 28,
          borderRadius: "0 30px 30px 0",
          background: cover,
          boxShadow: open > 0.5 ? "none" : "0 40px 90px rgba(1, 20, 120, 0.35)",
        }}
      />
      {/* rechter pagina */}
      <div style={{ position: "absolute", left: PAGE_W, top: 0, width: PAGE_W, height: BOOK_H }}>
        <Page rows={rows.slice(perPage, perPage * 2)} startIndex={perPage} rowOn={rowOn} ink={ink} accent={accent} radius="0 18px 18px 0" />
      </div>
      {/* de kaft: voorkant is de kaft, achterkant is de linker pagina */}
      <div
        style={{
          position: "absolute",
          left: PAGE_W,
          top: 0,
          width: PAGE_W,
          height: BOOK_H,
          transformOrigin: "0% 50%",
          transform: `rotateY(${-angle}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -14,
            left: 0,
            borderRadius: "0 30px 30px 0",
            background: cover,
            backfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 26,
            padding: 40,
            textAlign: "center",
          }}
        >
          <div style={{ width: 90, height: 6, borderRadius: 3, background: coverAccent }} />
          <div style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 60, lineHeight: 1, color: "#fff", letterSpacing: decTracking }}>
            {coverTitle}
          </div>
          <div style={{ width: 90, height: 6, borderRadius: 3, background: coverAccent }} />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
          <Page rows={rows.slice(0, perPage)} startIndex={0} rowOn={rowOn} ink={ink} accent={accent} radius="18px 0 0 18px" />
        </div>
      </div>
      {/* rugschaduw */}
      <div
        style={{
          position: "absolute",
          left: PAGE_W - 3,
          top: 0,
          width: 6,
          height: BOOK_H,
          background: "rgba(1, 38, 168, 0.18)",
          opacity: open > 0.95 ? 1 : 0,
        }}
      />
    </div>
  );
};
