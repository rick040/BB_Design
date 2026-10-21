import React from "react";
import { AppIcon } from "../../components/AppIcon";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { PaletteProvider } from "../../lib/palette";
import { SlideTop, SwipeHint } from "../d04-rijm/parts";
import { StaticPage } from "../StaticPage";
import { brand } from "../../theme";
import { dec, decFonts, decTracking } from "../theme";
import type { LijstjesProps } from "./schema";

const Headline: React.FC<{ text: string; color: string; size?: number; bottom?: number; top?: number }> = ({
  text,
  color,
  size = 116,
  top = 170,
}) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      right: 90,
      top,
      fontFamily: decFonts.display,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.0,
      letterSpacing: decTracking,
      color,
      whiteSpace: "pre-line",
    }}
  >
    {text}
  </div>
);

const Box: React.FC<{ done: boolean }> = ({ done }) => (
  <div
    style={{
      width: 58,
      height: 58,
      borderRadius: 17,
      flexShrink: 0,
      background: done ? dec.blue : dec.white,
      border: done ? "none" : `4px solid ${dec.blue}`,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {done ? <Checkmark size={36} color={dec.white} progress={1} strokeWidth={15} /> : null}
  </div>
);

const Flag: React.FC<{ color: string }> = ({ color }) => (
  <svg width={26} height={30} viewBox="0 0 26 30">
    <path d="M5 2v26" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <path d="M5 4h18l-5 6 5 6H5z" fill={color} />
  </svg>
);

/** Lijstkaart: titel, rijen met afgevinkt of open vakje. */
const ListCard: React.FC<{
  title: string;
  rows: { name: string; right?: string }[];
  done: boolean;
  width?: number;
  style?: React.CSSProperties;
}> = ({ title, rows, done, width = 840, style }) => (
  <div
    style={{
      width,
      borderRadius: 48,
      background: dec.white,
      boxShadow: "0 24px 60px rgba(1, 40, 160, 0.16)",
      padding: "34px 44px 18px",
      boxSizing: "border-box",
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 18, paddingBottom: 22, borderBottom: `3px solid ${dec.ice}` }}>
      <AppIcon size={52} circle={false} />
      <span style={{ fontFamily: decFonts.display, fontWeight: 500, letterSpacing: decTracking, fontSize: 42, color: dec.blue, flex: 1 }}>{title}</span>
      <span
        style={{
          fontFamily: decFonts.ui,
          fontWeight: 600,
          fontSize: 26,
          color: dec.blue,
          background: dec.ice,
          borderRadius: 999,
          padding: "8px 20px",
        }}
      >
        {done ? `${rows.length}/${rows.length}` : `0/${rows.length}`}
      </span>
    </div>
    {rows.map((r, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          height: 104,
          borderBottom: i < rows.length - 1 ? `3px solid ${dec.ice}` : "none",
        }}
      >
        <Box done={done} />
        <span
          style={{
            flex: 1,
            fontFamily: decFonts.ui,
            fontWeight: 500,
            fontSize: 40,
            color: done ? dec.greyText : dec.ink,
            textDecoration: done ? "line-through" : "none",
            textDecorationThickness: 3,
          }}
        >
          {r.name}
        </span>
        {r.right ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: decFonts.ui,
              fontWeight: 600,
              fontSize: 28,
              color: dec.blue,
              background: dec.ice,
              borderRadius: 999,
              padding: "10px 22px 10px 18px",
              whiteSpace: "nowrap",
            }}
          >
            <Flag color={dec.blue} />
            {r.right}
          </span>
        ) : null}
      </div>
    ))}
  </div>
);

const buddyAt = (size: number, left: number, feet: number): React.CSSProperties => ({
  position: "absolute",
  left,
  top: feet - size * BUDDY_RATIO,
});

const Cover: React.FC<{ p: LijstjesProps }> = ({ p }) => (
  <>
    <Headline text={p.cover.headline} color={dec.white} size={136} top={186} />
    {/* Drie lijstjes in een waaier, Buddy kijkt erachter vandaan. */}
    <Buddy size={250} body={dec.white} eye={brand.blueMascot} look={{ x: -0.4, y: 0.5 }} style={buddyAt(250, 770, 820)} />
    {p.cover.cards.map((t, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 130 + i * 40,
          top: 770 + i * 130,
          width: 660,
          transform: `rotate(${(i - 1) * 2.5}deg)`,
          zIndex: i,
        }}
      >
        <div
          style={{
            height: 190,
            borderRadius: 40,
            background: dec.white,
            boxShadow: "0 20px 50px rgba(0, 20, 120, 0.25)",
            padding: "30px 40px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <Box done />
          <span style={{ fontFamily: decFonts.display, fontWeight: 500, letterSpacing: decTracking, fontSize: 44, color: dec.blue }}>{t}</span>
        </div>
      </div>
    ))}
  </>
);

const Checked: React.FC<{ p: LijstjesProps; onBlue: boolean }> = ({ p, onBlue }) => {
  const list = p.lists[p.slide - 2];
  return (
    <>
      <Headline text={list.headline} color={onBlue ? dec.white : dec.blue} size={112} />
      <ListCard title={list.title} rows={list.items.map((name) => ({ name }))} done style={{ position: "absolute", left: 120, top: 530 }} />
      <Buddy
        size={210}
        body={onBlue ? dec.white : dec.blue}
        eye={onBlue ? brand.blueMascot : dec.white}
        blink={0.2}
        style={buddyAt(210, 800, 538)}
      />
    </>
  );
};

const Final: React.FC<{ p: LijstjesProps }> = ({ p }) => (
  <>
    <Headline text={p.buddy.headline} color={dec.white} size={124} />
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 440,
        fontFamily: decFonts.text,
        fontWeight: 400,
        fontSize: 48,
        color: dec.softBlue,
      }}
    >
      {p.buddy.subline}
    </div>
    <Buddy size={230} body={dec.white} eye={brand.blueMascot} blink={0.2} style={buddyAt(230, 760, 1206)} />
    <ListCard
      title={p.buddy.title}
      rows={p.buddy.rows.map((r) => ({ name: r.name, right: r.date }))}
      done={false}
      style={{ position: "absolute", left: 90, top: 540, width: 900 }}
    />
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 1030,
        fontFamily: decFonts.display,
        fontWeight: 500,
        letterSpacing: decTracking,
        fontSize: 52,
        lineHeight: 1.08,
        color: dec.white,
        whiteSpace: "pre-line",
      }}
    >
      {p.buddy.cta}
    </div>
  </>
);

const TONES = ["blue", "ice", "blue", "ice", "blue"] as const;

export const LijstjesSlide: React.FC<LijstjesProps> = (props) => {
  const tone = TONES[props.slide - 1];
  const onBlue = tone === "blue";
  return (
    <PaletteProvider colors={props.colors}>
      <StaticPage tone={tone} chip={props.slide === 5 ? props.chip : undefined}>
        <SlideTop
          label={props.label}
          index={props.slide}
          total={5}
          color={onBlue ? dec.white : dec.blue}
          dim={onBlue ? dec.bodyOnBlue : dec.softBlue}
        />
        {props.slide === 1 ? <Cover p={props} /> : null}
        {props.slide >= 2 && props.slide <= 4 ? <Checked p={props} onBlue={onBlue} /> : null}
        {props.slide === 5 ? <Final p={props} /> : null}
        {props.slide === 1 ? (
          <div style={{ position: "absolute", right: 90, bottom: 74 }}>
            <SwipeHint text={props.swipe} color={dec.white} />
          </div>
        ) : null}
      </StaticPage>
    </PaletteProvider>
  );
};
