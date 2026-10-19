import React from "react";
import { Buddy } from "../../components/Buddy";
import { StaticPage, type PageTone } from "../StaticPage";
import { dec, decFonts, decTracking } from "../theme";
import type { AftellenProps } from "./schema";

const Kicker: React.FC<{ text: string; fg: string; bg: string; top?: number }> = ({ text, fg, bg, top = 280 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div
      style={{
        background: bg,
        color: fg,
        borderRadius: 999,
        padding: "12px 30px",
        fontFamily: decFonts.ui,
        fontWeight: 600,
        fontSize: 30,
        letterSpacing: "0.04em",
        lineHeight: 1,
      }}
    >
      {text}
    </div>
  </div>
);

const Display: React.FC<{ text: string; top: number; size: number; color: string }> = ({ text, top, size, color }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 90,
      right: 90,
      textAlign: "center",
      fontFamily: decFonts.display,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.0,
      letterSpacing: decTracking,
      color,
      textWrap: "balance",
      whiteSpace: "pre-line",
    }}
  >
    {text}
  </div>
);

const Source: React.FC<{ text: string; color: string; top?: number }> = ({ text, color, top = 1500 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 90,
      right: 90,
      textAlign: "center",
      fontFamily: decFonts.ui,
      fontWeight: 400,
      fontSize: 24,
      color,
    }}
  >
    {text}
  </div>
);

// 1 · Poll
export const AftellenPoll: React.FC<AftellenProps> = ({ poll }) => (
  <StaticPage tone="blue">
    <Display text={poll.headline} top={300} size={118} color={dec.white} />
    <div style={{ position: "absolute", top: 790, left: 150, right: 150, display: "flex", flexDirection: "column", gap: 26 }}>
      {poll.options.map((o, i) => (
        <div
          key={i}
          style={{
            height: 118,
            borderRadius: 59,
            background: dec.white,
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "0 44px",
            fontFamily: decFonts.ui,
            fontWeight: 600,
            fontSize: 44,
            color: dec.blue,
            boxShadow: `7px 7px 0 ${dec.deep}`,
          }}
        >
          <span style={{ width: 40, height: 40, borderRadius: "50%", border: `5px solid ${dec.blue}`, boxSizing: "border-box" }} />
          {o}
        </div>
      ))}
    </div>
    <Buddy
      size={210}
      body={dec.white}
      eye={dec.blue}
      look={{ x: -0.6, y: -0.5 }}
      style={{ position: "absolute", left: 770, top: 1250 }}
    />
  </StaticPage>
);

// 2 · Feitkaart: overstappen t/m 31 december
export const AftellenFeit1: React.FC<AftellenProps> = ({ fact1 }) => (
  <StaticPage tone="ice">
    <Kicker text={fact1.kicker} fg={dec.white} bg={dec.blue} />
    <div
      style={{
        position: "absolute",
        top: 400,
        left: (1080 - 320) / 2,
        width: 320,
        height: 330,
        borderRadius: 34,
        background: dec.white,
        boxShadow: `12px 12px 0 ${dec.softBlue}`,
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div style={{ height: 96, background: dec.blue, color: dec.white, fontFamily: decFonts.display, fontWeight: 500, letterSpacing: decTracking, fontSize: 64, lineHeight: "96px" }}>
        {fact1.dateTop}
      </div>
      <div style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 210, lineHeight: 1.15, color: dec.blue, letterSpacing: decTracking }}>
        {fact1.dateDay}
      </div>
    </div>
    <Display text={fact1.headline} top={830} size={106} color={dec.blue} />
    <div
      style={{
        position: "absolute",
        top: 1130,
        left: 110,
        right: 110,
        textAlign: "center",
        fontFamily: decFonts.text,
        fontWeight: 400,
        fontSize: 50,
        lineHeight: 1.25,
        color: dec.ink,
        textWrap: "balance",
      }}
    >
      {fact1.body}
    </div>
    <Source text={fact1.source} color={dec.greyText} />
  </StaticPage>
);

const Padlock: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M20 28v-8a12 12 0 0 1 24 0v8" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
    <rect x={12} y={28} width={40} height={30} rx={8} fill={color} />
    <circle cx={32} cy={42} r={4.5} fill={dec.deep} />
  </svg>
);

// 3 · Feitkaart: openstaande premie
export const AftellenFeit2: React.FC<AftellenProps> = ({ fact2 }) => (
  <StaticPage tone="deep">
    <Kicker text={fact2.kicker} fg={dec.deep} bg={dec.white} />
    <div
      style={{
        position: "absolute",
        top: 400,
        left: 130,
        right: 130,
        height: 230,
        borderRadius: 36,
        background: dec.white,
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "0 44px",
        boxShadow: `10px 10px 0 ${dec.ink}`,
      }}
    >
      <div
        style={{
          width: 126,
          height: 126,
          borderRadius: "50%",
          background: dec.deep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Padlock size={78} color={dec.white} />
      </div>
      <div style={{ fontFamily: decFonts.ui }}>
        <div style={{ fontWeight: 600, fontSize: 44, color: dec.ink, lineHeight: 1.15 }}>{fact2.cardTitle}</div>
        <div style={{ fontWeight: 500, fontSize: 32, color: dec.greyText, marginTop: 6 }}>{fact2.cardSub}</div>
      </div>
    </div>
    <Display text={fact2.headline} top={760} size={104} color={dec.white} />
    <Buddy
      size={230}
      body={dec.white}
      eye={dec.deep}
      look={{ x: -0.5, y: -0.2 }}
      style={{ position: "absolute", left: 760, top: 1220 }}
    />
    <Source text={fact2.source} color={dec.softBlue} />
  </StaticPage>
);

// 4 · Aftellen naar 31 december
export const AftellenCountdown: React.FC<AftellenProps> = ({ countdown }) => (
  <StaticPage tone="blue" chip={countdown.chip}>
    <div
      style={{
        position: "absolute",
        top: 270,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: decFonts.display,
        fontWeight: 500,
        letterSpacing: decTracking,
        fontSize: 100,
        lineHeight: 1,
        color: dec.softBlue,
      }}
    >
      {countdown.kicker}
    </div>
    <div
      style={{
        position: "absolute",
        top: 340,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: decFonts.display,
        fontWeight: 500,
        fontSize: 600,
        lineHeight: 1,
        letterSpacing: decTracking,
        color: dec.white,
      }}
    >
      {countdown.daysLeft}
    </div>
    <div
      style={{
        position: "absolute",
        top: 870,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: decFonts.display,
        fontWeight: 500,
        letterSpacing: decTracking,
        fontSize: 110,
        lineHeight: 1,
        color: dec.white,
      }}
    >
      {countdown.unit}
    </div>
    <div
      style={{
        position: "absolute",
        top: 1012,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: decFonts.text,
        fontWeight: 400,
        fontSize: 58,
        color: dec.softBlue,
      }}
    >
      {countdown.target}
    </div>
    <div
      style={{
        position: "absolute",
        top: 1150,
        left: 120,
        right: 330,
        fontFamily: decFonts.text,
        fontWeight: 400,
        fontSize: 50,
        lineHeight: 1.22,
        color: dec.white,
        textWrap: "balance",
      }}
    >
      {countdown.line}
    </div>
    <Buddy
      size={190}
      body={dec.white}
      eye={dec.blue}
      look={{ x: -0.5, y: 0.1 }}
      style={{ position: "absolute", left: 780, top: 1130 }}
    />
  </StaticPage>
);

export type { PageTone };
