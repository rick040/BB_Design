import React from "react";
import { AppIcon } from "../../components/AppIcon";
import { Buddy } from "../../components/Buddy";
import { StaticPage } from "../StaticPage";
import { dec, decFonts } from "../theme";
import { Scarf } from "./Scarf";
import { Snow } from "./Snow";
import type { KerstkaartProps } from "./schema";

const Head: React.FC<{ text: string; top: number; size: number; color: string }> = ({ text, top, size, color }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 90,
      right: 90,
      textAlign: "center",
      fontFamily: decFonts.display,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: "-0.02em",
      color,
      whiteSpace: "pre-line",
    }}
  >
    {text}
  </div>
);

// Voorkant van de kaart: Buddy met sjaal op Betaalbuddy-blauw.
export const KerstkaartFront: React.FC<KerstkaartProps> = ({ front }) => (
  <StaticPage tone="blue">
    <Snow color={dec.softBlue} />
    <Head text={front.headline} top={96} size={140} color={dec.white} />
    <Buddy
      size={430}
      body={dec.white}
      eye={dec.blue}
      look={{ x: 0.1, y: 0.1 }}
      accessory={<Scarf />}
      style={{ position: "absolute", left: (1080 - 430) / 2, top: 560 }}
    />
    <div
      style={{
        position: "absolute",
        top: 1086,
        left: 90,
        right: 90,
        textAlign: "center",
        fontFamily: decFonts.text,
        fontWeight: 600,
        fontSize: 48,
        color: dec.white,
      }}
    >
      {front.subline}
    </div>
  </StaticPage>
);

// Achterkant: postzegel, "Voor:" en de grap die doorgestuurd wordt.
export const KerstkaartBack: React.FC<KerstkaartProps> = ({ back }) => (
  <StaticPage tone="ice" chip={back.chip}>
    <div
      style={{
        position: "absolute",
        top: 84,
        right: 90,
        width: 150,
        height: 184,
        boxSizing: "border-box",
        background: dec.white,
        border: `6px dashed ${dec.softBlue}`,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "rotate(3deg)",
      }}
    >
      <AppIcon size={96} circle={false} />
    </div>
    <div
      style={{
        position: "absolute",
        top: 240,
        left: 90,
        right: 90,
        fontFamily: decFonts.display,
        color: dec.blue,
        letterSpacing: "-0.02em",
      }}
    >
      <div style={{ fontSize: 66, lineHeight: 1, color: dec.deep }}>{back.kicker}</div>
      <div style={{ fontSize: 104, lineHeight: 1.04, marginTop: 24, textWrap: "balance" }}>{back.quote}</div>
    </div>
    <Buddy
      size={250}
      body={dec.blue}
      eye={dec.white}
      look={{ x: -0.5, y: 0.1 }}
      accessory={<Scarf color={dec.white} stripe={dec.softBlue} />}
      style={{ position: "absolute", left: 730, top: 900 }}
    />
    <div style={{ position: "absolute", left: 90, width: 560, top: 1040 }}>
      <div style={{ fontFamily: decFonts.text, fontStyle: "italic", fontSize: 46, color: dec.blue, marginBottom: 14 }}>
        {back.note}
      </div>
      <div style={{ height: 4, background: dec.softBlue }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 4, background: dec.softBlue, width: "70%" }} />
    </div>
  </StaticPage>
);

// Story-sjabloon om te delen: de kaart plus een vrije plek voor een @-vermelding.
export const KerstkaartStory: React.FC<KerstkaartProps> = ({ story }) => (
  <StaticPage tone="blue" chip={story.chip}>
    <Snow color={dec.softBlue} scaleY={1.7} />
    <Head text={story.headline} top={290} size={140} color={dec.white} />
    <Buddy
      size={440}
      body={dec.white}
      eye={dec.blue}
      look={{ x: 0.1, y: 0.1 }}
      accessory={<Scarf />}
      style={{ position: "absolute", left: (1080 - 440) / 2, top: 740 }}
    />
    <div
      style={{
        position: "absolute",
        top: 1296,
        left: 90,
        right: 90,
        textAlign: "center",
        fontFamily: decFonts.text,
        fontWeight: 600,
        fontSize: 48,
        color: dec.white,
      }}
    >
      {story.subline}
    </div>
    <div
      style={{
        position: "absolute",
        top: 1404,
        left: 140,
        right: 140,
        height: 112,
        boxSizing: "border-box",
        borderRadius: 56,
        background: dec.ice,
        display: "flex",
        alignItems: "center",
        padding: "0 44px",
        fontFamily: decFonts.display,
        fontSize: 48,
        color: dec.blue,
      }}
    >
      {story.forLabel}
      <span style={{ flex: 1, borderBottom: `5px dashed ${dec.softBlue}`, marginLeft: 22, marginTop: 28 }} />
    </div>
  </StaticPage>
);
