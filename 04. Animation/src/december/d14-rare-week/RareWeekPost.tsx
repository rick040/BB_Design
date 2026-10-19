import React from "react";
import { Buddy } from "../../components/Buddy";
import { StaticPage } from "../StaticPage";
import { dec, decFonts, decTracking } from "../theme";
import type { RareWeekProps } from "./schema";

const CELL_W = 124;
const CELL_GAP = 14;
const ROW_W = CELL_W * 7 + CELL_GAP * 6; // 952
const CARD_W = ROW_W + 56;
const CARD_X = (1080 - CARD_W) / 2;
const CARD_TOP = 470;
const HEADER_H = 84;
const CELL_TOP = CARD_TOP + HEADER_H + 28;
const CELL_H = 400;

const Flag: React.FC = () => (
  <svg width={150} height={190} viewBox="0 0 150 190" style={{ overflow: "visible" }}>
    <rect x={2} y={0} width={8} height={190} rx={4} fill={dec.ink} />
    <path d="M10 4 H142 L122 36 L142 68 H10 Z" fill={dec.deep} />
  </svg>
);

export const RareWeekPost: React.FC<RareWeekProps> = ({
  headline,
  headlineEnd,
  month,
  days,
  sharpIndex,
  sharpLabel,
  subline,
  chip,
}) => (
  <StaticPage tone="ice" chip={chip}>
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 90,
        right: 90,
        textAlign: "center",
        fontFamily: decFonts.display,
        fontWeight: 500,
        fontSize: 72,
        lineHeight: 1.02,
        letterSpacing: decTracking,
        color: dec.blue,
        textWrap: "balance",
      }}
    >
      {headline} <span style={{ color: dec.deep }}>{headlineEnd}</span>
    </div>

    {/* kalenderkaart */}
    <div
      style={{
        position: "absolute",
        left: CARD_X,
        top: CARD_TOP,
        width: CARD_W,
        height: HEADER_H + 28 + CELL_H + 30,
        borderRadius: 30,
        background: dec.white,
        boxShadow: `10px 10px 0 ${dec.softBlue}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: HEADER_H,
          background: dec.blue,
          display: "flex",
          alignItems: "center",
          paddingLeft: 36,
          fontFamily: decFonts.display,
          fontWeight: 500,
          fontSize: 52,
          color: dec.white,
          letterSpacing: decTracking,
        }}
      >
        {month}
      </div>
    </div>

    {days.map((d, i) => {
      const sharp = i === sharpIndex;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: CARD_X + 28 + i * (CELL_W + CELL_GAP),
            top: CELL_TOP,
            width: CELL_W,
            height: CELL_H,
            boxSizing: "border-box",
            borderRadius: 22,
            background: sharp ? dec.blue : dec.ice,
            color: sharp ? dec.white : dec.blue,
            padding: "22px 10px 18px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            filter: sharp ? "none" : "blur(2.4px)",
            opacity: sharp ? 1 : 0.62,
            transform: sharp ? "scale(1.07)" : `rotate(${(i % 3) - 1}deg)`,
            zIndex: sharp ? 3 : 1,
          }}
        >
          <div
            style={{
              height: 64,
              fontFamily: decFonts.ui,
              fontWeight: 600,
              fontSize: 21,
              lineHeight: 1.12,
              textAlign: "center",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {d.weekday}
          </div>
          <div
            style={{
              fontFamily: decFonts.display,
              fontWeight: 500,
              fontSize: 74,
              lineHeight: 1,
              letterSpacing: decTracking,
              marginTop: 18,
            }}
          >
            {d.date}
          </div>
          <div style={{ flex: 1 }} />
          {sharp ? (
            <div
              style={{
                fontFamily: decFonts.ui,
                fontWeight: 600,
                fontSize: 17,
                background: dec.white,
                color: dec.blue,
                borderRadius: 999,
                padding: "8px 10px",
                lineHeight: 1,
              }}
            >
              {sharpLabel}
            </div>
          ) : (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ height: 12, borderRadius: 6, background: dec.softBlue, width: "90%" }} />
              <div style={{ height: 12, borderRadius: 6, background: dec.softBlue, width: "60%" }} />
            </div>
          )}
        </div>
      );
    })}

    {/* Buddy-vlaggetje op de scherpe dag */}
    <div
      style={{
        position: "absolute",
        left: CARD_X + 28 + sharpIndex * (CELL_W + CELL_GAP) + CELL_W / 2 - 4 - 4,
        top: CELL_TOP - 190 + 10,
        zIndex: 4,
      }}
    >
      <Flag />
      <Buddy
        size={50}
        body={dec.white}
        eye={dec.deep}
        look={{ x: 0.4, y: 0 }}
        style={{ position: "absolute", left: 50, top: 14 }}
      />
    </div>

    <div
      style={{
        position: "absolute",
        top: CARD_TOP + HEADER_H + 28 + CELL_H + 30 + 52,
        left: 110,
        right: 110,
        textAlign: "center",
        fontFamily: decFonts.text,
        fontWeight: 400,
        fontSize: 40,
        lineHeight: 1.25,
        color: dec.ink,
        textWrap: "balance",
      }}
    >
      {subline}
    </div>
  </StaticPage>
);
