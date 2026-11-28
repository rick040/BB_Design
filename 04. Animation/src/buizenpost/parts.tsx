import React from "react";
import { usePalette } from "../lib/palette";
import { fonts } from "../theme";

// World geometry (px). The camera only moves vertically: screenY = worldY - camY.
export const PAN = 2000; // camera travel from mailbox to Buddy
export const BOX = { x: 110, y: 610, w: 700, rowH: 56, header: 92 };
export const FUNNEL = { top: 1300, bottom: 1400, wTop: 300, wBottom: 150 };
export const TUBE_TOP = FUNNEL.bottom;
export const END_Y = 640; // tube mouth on screen once the camera has arrived
export const TUBE_END = PAN + END_Y;
export const BAND_H = 500; // fixed headline band; the world slides under it
export const TUBE_W = 130;

/** Centre line of the tube: an S-bend between two straight runs. */
export const tubeX = (y: number) => {
  const a = TUBE_TOP + 120;
  const b = TUBE_END - 160;
  if (y <= a || y >= b) return 540;
  const u = (y - a) / (b - a);
  return 540 - 270 * Math.sin(2 * Math.PI * u) * Math.sin(Math.PI * u);
};
export const tubeAngle = (y: number) => {
  const dx = tubeX(y + 4) - tubeX(y - 4);
  return (Math.atan2(dx, 8) * -180) / Math.PI;
};

export const Tube: React.FC = () => {
  const p = usePalette();
  const pts: string[] = [];
  for (let y = TUBE_TOP - 6; y <= TUBE_END; y += 8) pts.push(`${tubeX(y).toFixed(1)},${y}`);
  const d = `M${pts.join(" L")}`;
  const f = FUNNEL;
  const funnel = `M${540 - f.wTop / 2},${f.top} L${540 + f.wTop / 2},${f.top} L${540 + f.wBottom / 2},${f.bottom} L${540 - f.wBottom / 2},${f.bottom} Z`;
  return (
    <svg
      width={1080}
      height={TUBE_END + 80}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <path d={d} fill="none" stroke={p.blueSoft} strokeWidth={TUBE_W + 22} strokeLinecap="round" />
      <path d={d} fill="none" stroke={p.white} strokeWidth={TUBE_W} strokeLinecap="round" />
      <path d={d} fill="none" stroke="rgba(1,59,255,0.07)" strokeWidth={TUBE_W * 0.42} strokeLinecap="round" />
      <path d={funnel} fill={p.white} stroke={p.blueSoft} strokeWidth={11} strokeLinejoin="round" />
      <ellipse cx={540} cy={f.top} rx={f.wTop / 2} ry={22} fill={p.grey} stroke={p.blueSoft} strokeWidth={11} />
      <ellipse cx={540} cy={TUBE_END} rx={TUBE_W / 2 + 18} ry={20} fill={p.blueMid} stroke={p.blueSoft} strokeWidth={11} />
    </svg>
  );
};

/** Pneumatic-post capsule (vertical), with a tiny bill inside. */
export const Capsule: React.FC<{ open?: number; content?: "bill" | "button" }> = ({ open = 0, content = "bill" }) => {
  const p = usePalette();
  const W = 96;
  const H = 156;
  const cap = 34;
  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: W / 2,
          background: "rgba(182,199,255,0.55)",
          border: `6px solid ${p.white}`,
          boxShadow: "0 12px 30px rgba(0,20,120,0.25)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: 34,
            bottom: 34,
            borderRadius: 8,
            background: content === "bill" ? p.white : p.blueMid,
            borderLeft: content === "bill" ? `8px solid ${p.yellow}` : "none",
          }}
        />
      </div>
      {/* Lid: lifts and spins off when the capsule opens. */}
      <div
        style={{
          position: "absolute",
          left: -6,
          top: -6,
          width: W + 12,
          height: cap,
          borderRadius: `${W / 2}px ${W / 2}px 10px 10px`,
          background: p.blueMid,
          border: `6px solid ${p.white}`,
          boxSizing: "border-box",
          transform: `translate(${open * 70}px, ${-open * 90}px) rotate(${open * 50}deg)`,
          opacity: 1 - Math.max(0, open - 0.6) * 2.5,
        }}
      />
    </div>
  );
};

/** Mail row inside the mailbox (generic sender + skeleton bar). */
export const MailRow: React.FC<{ sender: string; highlight?: boolean; amount?: string; style?: React.CSSProperties }> = ({
  sender,
  highlight,
  amount,
  style,
}) => {
  const p = usePalette();
  return (
    <div
      style={{
        height: BOX.rowH - 10,
        borderRadius: 18,
        background: highlight ? p.white : "transparent",
        borderLeft: highlight ? `10px solid ${p.yellow}` : "10px solid transparent",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 20px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: highlight ? p.yellow : p.grey, flexShrink: 0 }} />
      <div style={{ fontSize: 28, fontWeight: 600, color: p.ink, width: 250, whiteSpace: "nowrap" }}>{sender}</div>
      {amount ? (
        <div style={{ marginLeft: "auto", fontSize: 30, fontWeight: 700, color: p.ink }}>{amount}</div>
      ) : (
        <div style={{ flex: 1, height: 14, borderRadius: 7, background: p.grey }} />
      )}
    </div>
  );
};

/** Plug on a cable coming in from the right edge. */
export const Plug: React.FC<{ x: number; y: number; label: string }> = ({ x, y, label }) => {
  const p = usePalette();
  return (
    <>
      <svg width={1400} height={200} style={{ position: "absolute", left: 0, top: y - 100, overflow: "visible" }}>
        <path
          d={`M${x + 120},100 C${x + 220},100 ${x + 260},150 ${x + 600},150`}
          fill="none"
          stroke={p.ink}
          strokeWidth={18}
          strokeLinecap="round"
        />
        <rect x={x} y={56} width={130} height={88} rx={22} fill={p.ink} />
        <rect x={x - 46} y={74} width={52} height={14} rx={7} fill={p.greyText} />
        <rect x={x - 46} y={112} width={52} height={14} rx={7} fill={p.greyText} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x - 190,
          top: y - 160,
          fontFamily: fonts.ui,
          fontSize: 26,
          fontWeight: 600,
          color: p.ink,
          background: p.grey,
          borderRadius: 30,
          padding: "10px 22px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </>
  );
};
