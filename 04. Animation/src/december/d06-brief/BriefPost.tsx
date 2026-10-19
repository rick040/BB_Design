import React from "react";
import { Buddy } from "../../components/Buddy";
import { StaticPage } from "../StaticPage";
import { dec, decFonts } from "../theme";
import type { BriefProps } from "./schema";

// Idee 6: brief op papier (vlak, harde schaduw), Rick tekent, kleine Buddy in de hoek.
export const BriefPost: React.FC<BriefProps> = ({ kicker, paragraphs, signature, role, footerLine, chip }) => (
  <StaticPage tone="blue" chip={chip}>
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 92,
        width: 900,
        boxSizing: "border-box",
        padding: "70px 70px 60px",
        background: dec.white,
        borderRadius: 18,
        boxShadow: `16px 16px 0 ${dec.deep}`,
        transform: "rotate(-1deg)",
        transformOrigin: "50% 0%",
      }}
    >
      <div
        style={{
          fontFamily: decFonts.text,
          fontWeight: 600,
          fontSize: 27,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: dec.blue,
        }}
      >
        {kicker}
      </div>
      <div style={{ height: 4, width: 86, background: dec.blue, margin: "22px 0 40px" }} />
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            margin: "0 0 34px",
            fontFamily: decFonts.text,
            fontWeight: 500,
            fontSize: 54,
            lineHeight: 1.32,
            letterSpacing: "-0.01em",
            color: dec.ink,
            textWrap: "pretty",
          }}
        >
          {p}
        </p>
      ))}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 22 }}>
        <div>
          <div
            style={{
              fontFamily: decFonts.text,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 96,
              lineHeight: 1,
              color: dec.blue,
              letterSpacing: "-0.03em",
            }}
          >
            {signature}
          </div>
          <svg width="260" height="26" viewBox="0 0 260 26" style={{ display: "block", marginTop: 4 }}>
            <path d="M4 18 C 60 4, 120 24, 256 8" fill="none" stroke={dec.blue} strokeWidth="5" strokeLinecap="round" />
          </svg>
          <div style={{ fontFamily: decFonts.text, fontWeight: 500, fontSize: 26, color: dec.greyText, marginTop: 10 }}>
            {role}
          </div>
          {footerLine ? (
            <div style={{ fontFamily: decFonts.text, fontWeight: 400, fontSize: 22, color: dec.greyText, marginTop: 6 }}>
              {footerLine}
            </div>
          ) : null}
        </div>
        <Buddy size={150} body={dec.blue} eye={dec.white} look={{ x: -0.4, y: 0.2 }} />
      </div>
    </div>
  </StaticPage>
);
