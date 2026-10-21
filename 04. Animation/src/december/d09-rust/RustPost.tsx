import React from "react";
import { Arrow } from "../../components/CtaPill";
import { Buddy } from "../../components/Buddy";
import { StaticPage } from "../StaticPage";
import { dec, decFonts, decTracking } from "../theme";
import type { RustProps } from "./schema";

const RECEIPT_W = 660;
const TOOTH = 22;

// Vaste streepjescode, zodat elke render hetzelfde is.
const BARS = [6, 3, 9, 4, 3, 8, 3, 5, 10, 3, 4, 7, 3, 9, 5, 3, 6, 4, 8, 3, 5, 9, 3, 4, 7, 3, 6, 10, 4, 3];

const Dashed: React.FC = () => (
  <div style={{ borderTop: `4px dashed ${dec.softBlue}`, margin: "26px 0" }} />
);

// Zigzag-onderrand als clip-path, harde schaduw via drop-shadow op de wrapper.
const zigzag = () => {
  const n = Math.floor(RECEIPT_W / (TOOTH * 2));
  const pts = ["0 0", "100% 0", "100% calc(100% - " + TOOTH + "px)"];
  for (let i = n * 2; i >= 0; i--) {
    const x = (i / (n * 2)) * 100;
    pts.push(`${x}% ${i % 2 === 0 ? `calc(100% - ${TOOTH}px)` : "100%"}`);
  }
  return `polygon(${pts.join(", ")})`;
};

export const RustPost: React.FC<RustProps> = ({ headline, receipt, button, chip }) => (
  <StaticPage tone="ice" chip={chip}>
    <div
      style={{
        position: "absolute",
        top: 92,
        left: 90,
        right: 90,
        textAlign: "center",
        fontFamily: decFonts.display,
        fontWeight: 500,
        fontSize: 108,
        lineHeight: 1.0,
        letterSpacing: decTracking,
        color: dec.blue,
        textWrap: "balance",
        whiteSpace: "pre-line",
      }}
    >
      {headline}
    </div>

    {/* Buddy kijkt over de rand van de bon */}
    <Buddy
      size={128}
      body={dec.blue}
      eye={dec.white}
      look={{ x: 0, y: 0.5 }}
      style={{ position: "absolute", left: 640, top: 330, transform: "rotate(6deg)" }}
    />

    <div
      style={{
        position: "absolute",
        left: (1080 - RECEIPT_W) / 2,
        top: 424,
        transform: "rotate(-2deg)",
        filter: `drop-shadow(12px 12px 0 ${dec.softBlue})`,
      }}
    >
      <div
        style={{
          width: RECEIPT_W,
          boxSizing: "border-box",
          padding: `40px 52px ${TOOTH + 36}px`,
          background: dec.white,
          clipPath: zigzag(),
          fontFamily: decFonts.ui,
          color: dec.ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: decFonts.display, fontWeight: 700, fontSize: 38, letterSpacing: decTracking, color: dec.blue }}>betaalbuddy</span>
          <span style={{ fontWeight: 500, fontSize: 24, color: dec.greyText }}>{receipt.label}</span>
        </div>
        <Dashed />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontWeight: 600, fontSize: 38 }}>{receipt.item}</span>
          <span style={{ fontWeight: 600, fontSize: 38 }}>{receipt.itemPrice}</span>
        </div>
        <div style={{ fontWeight: 500, fontSize: 25, color: dec.greyText, marginTop: 6 }}>{receipt.itemNote}</div>
        <Dashed />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", color: dec.blue }}>
          <span style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 46, letterSpacing: decTracking }}>{receipt.totalLabel}</span>
          <span style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 80, letterSpacing: decTracking }}>{receipt.total}</span>
        </div>
        <Dashed />
        <div style={{ display: "flex", gap: 4, height: 62, alignItems: "stretch", justifyContent: "center" }}>
          {BARS.map((w, i) => (
            <div key={i} style={{ width: w, background: i % 2 === 0 ? dec.ink : "transparent" }} />
          ))}
        </div>
        <div style={{ textAlign: "center", fontWeight: 500, fontSize: 25, color: dec.greyText, marginTop: 16 }}>
          {receipt.thanks}
        </div>
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1084,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          height: 104,
          borderRadius: 52,
          background: dec.blue,
          display: "inline-flex",
          alignItems: "center",
          gap: 24,
          padding: "0 48px 0 16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: dec.deep,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Arrow size={40} />
        </div>
        <span style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 50, letterSpacing: decTracking, color: dec.white, lineHeight: 1 }}>
          {button}
        </span>
      </div>
    </div>
  </StaticPage>
);
