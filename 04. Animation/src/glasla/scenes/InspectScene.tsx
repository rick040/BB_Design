import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand, fonts } from "../../theme";
import { type GlaslaProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const INSPECT_T = {
  headline: S - 4,
  headlineStagger: 4,
  card: SCENE_STARTS[2] + 2,
  typeStart: wordAt("mail"),
  typeEnd: wordAt("gegevens") + 6,
  tap: wordAt("gegevens") + 8,
  printStart: wordAt("gegevens") + 12,
  printLen: 12,
  subline: wordAt("gegevens") + 16,
};

const CARD_W = 860;

export const InspectScene: React.FC<{
  props: GlaslaProps["inspect"];
  fields: GlaslaProps["fields"];
  sender: string;
}> = ({ props, fields, sender }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, INSPECT_T.card, springs.pop);
  const typed = Math.round(
    interpolate(frame, [INSPECT_T.typeStart, INSPECT_T.typeEnd], [0, props.to.length], clamp),
  );
  const tapS = interpolate(frame, [INSPECT_T.tap, INSPECT_T.tap + 3, INSPECT_T.tap + 9], [1, 0.9, 1], clamp);
  const sent = frame >= INSPECT_T.tap + 4;
  const print = interpolate(frame, [INSPECT_T.printStart, INSPECT_T.printStart + INSPECT_T.printLen], [0, 1], clamp);
  const buddyIn = pop(frame, fps, INSPECT_T.card + 6, springs.bouncy);
  const hop = interpolate(frame, [INSPECT_T.tap - 8, INSPECT_T.tap - 3, INSPECT_T.tap], [0, -70, 0], clamp);
  const RECEIPT_H = 560;
  const rows = [{ label: "Afzender", value: sender }, ...fields];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={INSPECT_T.headline} stagger={INSPECT_T.headlineStagger} />
      <Stage offsetY={0}>
        {/* compose card */}
        <div
          style={{
            position: "absolute",
            left: (1080 - CARD_W) / 2,
            top: 0,
            width: CARD_W,
            height: 220,
            borderRadius: 32,
            background: brand.card,
            boxShadow: "0 20px 50px rgba(0,20,120,0.16)",
            fontFamily: fonts.ui,
            padding: "30px 40px",
            boxSizing: "border-box",
            opacity: Math.min(1, cardIn * 2),
            transform: `translateY(${(1 - cardIn) * 60}px)`,
          }}
        >
          <div style={{ fontSize: 40, color: brand.greyText }}>
            Aan: <span style={{ color: brand.ink, fontWeight: 600 }}>{props.to.slice(0, typed)}</span>
            <span style={{ opacity: !sent && Math.floor(frame / 8) % 2 === 0 ? 1 : 0, color: p.blue }}>|</span>
          </div>
          <div style={{ fontSize: 36, color: brand.ink, marginTop: 18 }}>{props.subject}</div>
          <div
            style={{
              position: "absolute",
              right: 36,
              bottom: 28,
              height: 70,
              padding: "0 34px",
              borderRadius: 35,
              background: sent ? brand.teal : p.blue,
              color: p.white,
              fontSize: 34,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              transform: `scale(${tapS})`,
            }}
          >
            {sent ? "Verstuurd" : props.send}
          </div>
        </div>
        <Buddy
          size={150}
          body={p.blueMascot}
          eye={p.white}
          blink={blinkScale(frame, [INSPECT_T.printStart + 20])}
          look={{ x: frame > INSPECT_T.tap ? -0.6 : 0.8, y: frame > INSPECT_T.tap ? 0.9 : 0.3 }}
          style={{
            position: "absolute",
            left: 50,
            top: 300 - 150 * BUDDY_RATIO + 150 + hop,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        {/* receipt printing out */}
        <div
          style={{
            position: "absolute",
            left: 540 - 300 + 50,
            top: 270,
            width: 640,
            height: RECEIPT_H * print,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 640,
              height: RECEIPT_H,
              background: p.white,
              borderRadius: "8px 8px 0 0",
              boxShadow: "0 18px 40px rgba(0,20,120,0.14)",
              fontFamily: fonts.ui,
              padding: "28px 40px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 700, color: p.blue, textAlign: "center", marginBottom: 14 }}>
              {props.receiptTitle}
            </div>
            <div style={{ borderTop: `3px dashed ${brand.grey}`, marginBottom: 10 }} />
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 36, lineHeight: "74px" }}>
                <span style={{ color: brand.greyText }}>{r.label}</span>
                <span style={{ color: brand.ink, fontWeight: 600 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ borderTop: `3px dashed ${brand.grey}`, marginTop: 8 }} />
          </div>
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={INSPECT_T.subline} />
    </SceneBg>
  );
};
