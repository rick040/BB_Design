import React from "react";
import { Buddy } from "../../components/Buddy";
import { StaticPage } from "../StaticPage";
import { dec, decFonts, decTracking } from "../theme";
import type { BingoProps } from "./schema";

const TILE = 264;
const GAP = 20;
const GRID = TILE * 3 + GAP * 2;

// Kleine, vaste kanteling per vak: speels zonder dat het rommelig wordt.
const TILT = [-1.2, 0.8, -0.6, 0.9, 0, -0.9, 0.6, -1, 1.1];

export const BingoPost: React.FC<BingoProps> = ({ title, questions, freeSquare, cta, chip }) => {
  const cells: (string | null)[] = [...questions.slice(0, 4), null, ...questions.slice(4)];
  return (
    <StaticPage tone="blue" chip={chip}>
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 90,
          right: 90,
          textAlign: "center",
          fontFamily: decFonts.display,
          fontWeight: 500,
          fontSize: 108,
          lineHeight: 1,
          letterSpacing: decTracking,
          color: dec.white,
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          top: 214,
          left: (1080 - GRID) / 2,
          width: GRID,
          display: "grid",
          gridTemplateColumns: `repeat(3, ${TILE}px)`,
          gap: GAP,
        }}
      >
        {cells.map((q, i) => {
          const free = q === null;
          return (
            <div
              key={i}
              style={{
                width: TILE,
                height: TILE,
                boxSizing: "border-box",
                borderRadius: 26,
                background: free ? dec.deep : dec.white,
                color: free ? dec.white : dec.blue,
                boxShadow: `7px 7px 0 ${free ? dec.ink : dec.deep}`,
                transform: `rotate(${TILT[i]}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: free ? 8 : 0,
                padding: free ? "16px 18px" : "20px 22px",
                textAlign: "center",
                fontFamily: decFonts.ui,
                fontWeight: 600,
                fontSize: free ? 30 : 35,
                lineHeight: 1.18,
                textWrap: "balance",
              }}
            >
              {free ? (
                <>
                  <Buddy size={92} body={dec.white} eye={dec.deep} look={{ x: 0.3, y: 0 }} blink={0.9} />
                  <span>{freeSquare}</span>
                </>
              ) : (
                q
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 214 + GRID + 40,
          left: 90,
          right: 90,
          textAlign: "center",
          fontFamily: decFonts.text,
          fontWeight: 400,
          fontSize: 46,
          color: dec.white,
        }}
      >
        {cta}
      </div>
    </StaticPage>
  );
};
