import React from "react";
import { AppIcon } from "../../components/AppIcon";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { PaletteProvider } from "../../lib/palette";
import { brand } from "../../theme";
import { SlideTop, SwipeHint } from "../d04-rijm/parts";
import { StaticPage } from "../StaticPage";
import { dec, decFonts } from "../theme";
import type { JanuariProps } from "./schema";

const UI = "'Geist', system-ui, sans-serif";

const Headline: React.FC<{ text: string; color: string; size?: number; top?: number }> = ({ text, color, size = 96, top = 170 }) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      right: 90,
      top,
      fontFamily: decFonts.display,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: "-0.02em",
      color,
      whiteSpace: "pre-line",
    }}
  >
    {text}
  </div>
);

const Sub: React.FC<{ text: string; color: string; top: number; size?: number }> = ({ text, color, top, size = 42 }) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      right: 90,
      top,
      fontFamily: decFonts.text,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.25,
      color,
      whiteSpace: "pre-line",
    }}
  >
    {text}
  </div>
);

const buddyAt = (size: number, left: number, feet: number): React.CSSProperties => ({
  position: "absolute",
  left,
  top: feet - size * BUDDY_RATIO,
});

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      borderRadius: 48,
      background: dec.white,
      boxShadow: "0 24px 60px rgba(1, 40, 160, 0.16)",
      boxSizing: "border-box",
      fontFamily: UI,
      ...style,
    }}
  >
    {children}
  </div>
);

const Tag: React.FC<{ text: string; on?: boolean }> = ({ text, on = false }) => (
  <span
    style={{
      fontFamily: decFonts.text,
      fontWeight: 600,
      fontSize: 26,
      color: on ? dec.white : dec.blue,
      background: on ? dec.blue : dec.ice,
      borderRadius: 999,
      padding: "8px 22px",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </span>
);

const Skeleton: React.FC<{ w: number; h?: number }> = ({ w, h = 18 }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: dec.grey }} />
);

const Refresh: React.FC<{ color: string; size?: number }> = ({ color, size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <path d="M36 22a14 14 0 1 1-4.5-10.3" fill="none" stroke={color} strokeWidth={4.2} strokeLinecap="round" />
    <path d="M33 3v10h-10" fill="none" stroke={color} strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Envelope: React.FC<{ label: string; rotate: number; style?: React.CSSProperties }> = ({ label, rotate, style }) => (
  <div style={{ position: "absolute", transform: `rotate(${rotate}deg)`, ...style }}>
    <div
      style={{
        width: 420,
        height: 280,
        borderRadius: 30,
        background: dec.white,
        boxShadow: "0 20px 50px rgba(0, 20, 120, 0.25)",
        position: "relative",
        overflow: "hidden",
        fontFamily: UI,
      }}
    >
      <svg width={420} height={150} viewBox="0 0 420 150" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M0 0 L210 140 L420 0 Z" fill={dec.ice} />
      </svg>
      <div style={{ position: "absolute", left: 40, top: 168, fontSize: 30, fontWeight: 600, color: dec.ink }}>{label}</div>
      <div style={{ position: "absolute", left: 40, top: 208, width: 220, height: 14, borderRadius: 7, background: dec.grey }} />
      <div style={{ position: "absolute", left: 40, top: 238, width: 150, height: 14, borderRadius: 7, background: dec.grey }} />
      <div style={{ position: "absolute", right: 30, top: 24, width: 54, height: 66, borderRadius: 10, border: `4px solid ${dec.softBlue}`, background: dec.white }} />
    </div>
  </div>
);

const Cover: React.FC<{ p: JanuariProps }> = ({ p }) => (
  <>
    <Headline text={p.cover.headline} color={dec.white} size={92} top={176} />
    <Sub text={p.cover.sub} color={dec.softBlue} top={500} size={46} />
    {/* Kalendertegel januari met rekeningen die eruit piepen. */}
    <div style={{ position: "absolute", left: 130, top: 700, width: 520, transform: "rotate(-3deg)" }}>
      <div style={{ borderRadius: 44, background: dec.white, boxShadow: "0 24px 60px rgba(0, 20, 120, 0.3)", overflow: "hidden" }}>
        <div style={{ background: dec.deep, height: 108, display: "flex", alignItems: "center", paddingLeft: 40 }}>
          <span style={{ fontFamily: decFonts.display, fontSize: 52, color: dec.white }}>{p.cover.month}</span>
        </div>
        <div style={{ padding: "30px 40px 40px", display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 18 }}>
          {Array.from({ length: 21 }, (_, i) => (
            <div
              key={i}
              style={{ height: 36, borderRadius: 12, background: i === 4 || i === 11 || i === 15 ? dec.blue : dec.ice }}
            />
          ))}
        </div>
      </div>
    </div>
    <Buddy size={250} body={dec.white} eye={brand.blueMascot} look={{ x: -0.5, y: 0.2 }} style={buddyAt(250, 720, 1120)} />
    <div
      style={{
        position: "absolute",
        left: 700,
        top: 700,
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: dec.white,
        color: dec.blue,
        borderRadius: 999,
        padding: "16px 30px 16px 24px",
        fontFamily: decFonts.display,
        fontSize: 32,
      }}
    >
      <svg width={28} height={36} viewBox="0 0 28 36">
        <path d="M3 2h22v32l-11-8-11 8z" fill={dec.blue} />
      </svg>
      {p.cover.save}
    </div>
  </>
);

const Premie: React.FC<{ p: JanuariProps }> = ({ p }) => (
  <>
    <Headline text={p.premie.headline} color={dec.blue} />
    <Card style={{ position: "absolute", left: 90, top: 470, width: 900, padding: "44px 48px 52px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: dec.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={44} height={44} viewBox="0 0 44 44">
            <path d="M22 6v32M6 22h32" stroke={dec.white} strokeWidth={8} strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 40, fontWeight: 600, color: dec.ink }}>{p.premie.sender}</div>
          <div style={{ fontSize: 28, color: dec.greyText, marginTop: 6 }}>{p.premie.subject}</div>
        </div>
        <Tag text={p.premie.tag} on />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 52 }}>
        <span style={{ fontFamily: decFonts.display, fontSize: 84, color: dec.blue }}>€</span>
        <Skeleton w={150} h={34} />
        <Skeleton w={30} h={34} />
        <Skeleton w={90} h={34} />
      </div>
      <div style={{ marginTop: 36 }}>
        <Skeleton w={560} />
      </div>
    </Card>
    <Buddy size={230} body={dec.blue} eye={dec.white} look={{ x: -0.4, y: 0.4 }} style={buddyAt(230, 770, 1190)} />
  </>
);

const Termijn: React.FC<{ p: JanuariProps }> = ({ p }) => {
  const t = p.termijn;
  return (
    <>
      <Headline text={t.headline} color={dec.white} />
      <Card style={{ position: "absolute", left: 90, top: 540, width: 900, padding: "44px 48px 52px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: dec.ice, color: dec.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 700 }}>
            {t.sender.slice(0, 1)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 40, fontWeight: 600, color: dec.ink }}>{t.sender}</div>
            <div style={{ fontSize: 30, color: dec.greyText, marginTop: 6 }}>{t.subject}</div>
          </div>
          <Tag text={t.example} />
        </div>
        {/* Tijdlijn: gedaan, nu, nog te komen. */}
        <div style={{ position: "relative", height: 150, marginTop: 40 }}>
          <div style={{ position: "absolute", left: 60, right: 60, top: 38, height: 8, background: dec.ice }} />
          <div style={{ position: "absolute", left: 60, width: 342, top: 38, height: 8, background: dec.blue }} />
          {t.steps.map((s, i) => {
            const x = 60 + i * 342;
            const done = i === 0;
            const now = i === 1;
            return (
              <div key={i} style={{ position: "absolute", left: x - 42, top: 0, width: 84, textAlign: "center" }}>
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: "50%",
                    background: done ? dec.blue : dec.white,
                    border: done ? "none" : `7px solid ${now ? dec.blue : dec.softBlue}`,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {done ? <Checkmark size={44} color={dec.white} progress={1} strokeWidth={15} /> : null}
                </div>
                <div style={{ fontFamily: decFonts.text, fontWeight: 600, fontSize: 30, color: now ? dec.blue : dec.greyText, marginTop: 14 }}>{s}</div>
              </div>
            );
          })}
        </div>
      </Card>
      <Buddy size={200} body={dec.white} eye={brand.blueMascot} blink={0.2} style={buddyAt(200, 800, 1190)} />
    </>
  );
};

const Abonnement: React.FC<{ p: JanuariProps }> = ({ p }) => {
  const a = p.abonnement;
  return (
    <>
      <Headline text={a.headline} color={dec.blue} size={86} />
      <div style={{ position: "absolute", left: 90, top: 400, width: 900 }}>
        {a.rows.map((r, i) => (
          <Card
            key={i}
            style={{
              height: 160,
              marginBottom: 30,
              padding: "0 44px",
              display: "flex",
              alignItems: "center",
              gap: 28,
              transform: `rotate(${(i - 1) * 0.8}deg)`,
            }}
          >
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: dec.ice, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Refresh color={dec.blue} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 40, fontWeight: 600, color: dec.ink }}>{r.name}</div>
              <div style={{ fontSize: 28, color: dec.greyText, marginTop: 4 }}>{r.note}</div>
            </div>
            <Tag text={a.cycle} />
          </Card>
        ))}
      </div>
      <Buddy size={210} body={dec.blue} eye={dec.white} look={{ x: -0.5, y: 0.2 }} style={buddyAt(210, 790, 1225)} />
    </>
  );
};

const Post: React.FC<{ p: JanuariProps }> = ({ p }) => (
  <>
    <Headline text={p.post.headline} color={dec.white} />
    <Sub text={p.post.sub} color={dec.softBlue} top={400} />
    <Envelope label={p.post.envelopes[0]} rotate={-5} style={{ left: 90, top: 640 }} />
    <Envelope label={p.post.envelopes[1]} rotate={4} style={{ left: 480, top: 800 }} />
    <Buddy size={220} body={dec.white} eye={brand.blueMascot} look={{ x: 0.6, y: 0.6 }} style={buddyAt(220, 780, 700)} />
    <div
      style={{
        position: "absolute",
        left: 100,
        top: 960,
        fontFamily: decFonts.display,
        fontSize: 34,
        color: dec.white,
        border: `4px solid ${dec.white}`,
        borderRadius: 999,
        padding: "10px 26px",
      }}
    >
      {p.post.note}
    </div>
  </>
);

const Forward: React.FC<{ p: JanuariProps }> = ({ p }) => {
  const f = p.forward;
  return (
    <>
      <Headline text={f.headline} color={dec.blue} size={84} top={160} />
      <Sub text={f.sub} color={dec.deep} top={350} size={38} />
      <Card style={{ position: "absolute", left: 90, top: 450, width: 900, height: 124, padding: "0 36px", display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 66, height: 66, borderRadius: "50%", background: dec.blue, color: dec.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 600 }}>
          {f.sender.slice(0, 1)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 600, color: dec.ink }}>{f.sender}</div>
          <div style={{ fontSize: 26, color: dec.greyText }}>{f.subject}</div>
        </div>
      </Card>
      <svg width={80} height={86} viewBox="0 0 80 86" style={{ position: "absolute", left: 500, top: 584 }}>
        <path d="M40 6v62M16 46l24 26 24-26" fill="none" stroke={dec.blue} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Card style={{ position: "absolute", left: 90, top: 690, width: 900, padding: "34px 40px 38px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 20, borderBottom: `3px solid ${dec.ice}` }}>
          <AppIcon size={48} circle={false} />
          <span style={{ fontFamily: decFonts.display, fontSize: 34, color: dec.blue, flex: 1 }}>{f.agendaTitle}</span>
          <Tag text={f.due} on />
        </div>
        {f.alerts.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              height: 90,
              borderBottom: i === 0 ? `3px solid ${dec.ice}` : "none",
              fontFamily: decFonts.text,
            }}
          >
            <svg width={30} height={34} viewBox="0 0 26 30">
              <path d="M5 2v26" stroke={dec.blue} strokeWidth={4} strokeLinecap="round" />
              <path d="M5 4h18l-5 6 5 6H5z" fill={dec.blue} />
            </svg>
            <span style={{ fontWeight: 600, fontSize: 34, color: dec.ink, flex: 1 }}>{a.day}</span>
            <span style={{ fontWeight: 500, fontSize: 30, color: dec.deep }}>{a.label}</span>
          </div>
        ))}
      </Card>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1112,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: decFonts.display,
          fontSize: 40,
          color: dec.blue,
        }}
      >
        <svg width={30} height={40} viewBox="0 0 28 36">
          <path d="M3 2h22v32l-11-8-11 8z" fill={dec.blue} />
        </svg>
        {f.cta}
      </div>
      <Buddy size={170} body={dec.blue} eye={dec.white} blink={0.2} style={buddyAt(170, 810, 1215)} />
    </>
  );
};

const TONES = ["blue", "ice", "blue", "ice", "blue", "ice"] as const;

export const JanuariSlide: React.FC<JanuariProps> = (props) => {
  const tone = TONES[props.slide - 1];
  const onBlue = tone === "blue";
  return (
    <PaletteProvider colors={props.colors}>
      <StaticPage tone={tone} chip={props.slide === 6 ? props.chip : undefined}>
        <SlideTop
          label={props.label}
          index={props.slide}
          total={6}
          color={onBlue ? dec.white : dec.blue}
          dim={onBlue ? dec.bodyOnBlue : dec.softBlue}
        />
        {props.slide === 1 ? <Cover p={props} /> : null}
        {props.slide === 2 ? <Premie p={props} /> : null}
        {props.slide === 3 ? <Termijn p={props} /> : null}
        {props.slide === 4 ? <Abonnement p={props} /> : null}
        {props.slide === 5 ? <Post p={props} /> : null}
        {props.slide === 6 ? <Forward p={props} /> : null}
        {props.slide === 1 ? (
          <div style={{ position: "absolute", right: 90, bottom: 74 }}>
            <SwipeHint text={props.swipe} color={dec.white} />
          </div>
        ) : null}
      </StaticPage>
    </PaletteProvider>
  );
};
