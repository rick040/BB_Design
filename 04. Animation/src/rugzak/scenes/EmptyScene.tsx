import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand, fonts } from "../../theme";
import { Rugzak, RUGZAK_H, RUGZAK_W } from "../components/Rugzak";
import { type RugzakProps, SCENE_STARTS, wordAt } from "../schema";

// Absolute frames.
export const EMPTY_T = {
  start: SCENE_STARTS[2],
  dates: SCENE_STARTS[2] + 8, // date tiles pop in
  count: wordAt("dagen"), // 14 day ticks start filling
  countEnd: wordAt("leeg") - 4,
  subline: wordAt("vervaldatum"),
  gone: wordAt("leeg"), // papers poof out, bag deflates, chip "Leeg"
  chip: wordAt("leeg") + 6,
};

const GROUND = 860;
const BAG = 330;
const bagH = (BAG * RUGZAK_H) / RUGZAK_W;
const BUD = 170;

const DateTile: React.FC<{ text: string; x: number; s: number; strong: boolean; color: string; ink: string }> = ({ text, x, s, strong, color, ink }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 40,
      width: 220,
      height: 120,
      borderRadius: 26,
      background: strong ? color : brand.white,
      border: strong ? "none" : `4px solid ${color}`,
      boxSizing: "border-box",
      color: strong ? brand.white : ink,
      fontFamily: fonts.display,
      fontWeight: 600,
      fontSize: 54,
      letterSpacing: "-0.03em",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${s})`,
    }}
  >
    {text}
  </div>
);

export const EmptyScene: React.FC<{ props: RugzakProps["empty"]; items: RugzakProps["open"]["items"] }> = ({ props, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const t1 = pop(frame, fps, EMPTY_T.dates, springs.pop);
  const t2 = pop(frame, fps, EMPTY_T.countEnd, springs.bouncy);
  const fill = interpolate(frame, [EMPTY_T.count, EMPTY_T.countEnd], [0, 1], clamp);
  const ticks = Math.round(fill * 14);
  const gone = interpolate(frame, [EMPTY_T.gone - 2, EMPTY_T.gone + 10], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const deflate = frame >= EMPTY_T.gone ? interpolate(frame, [EMPTY_T.gone, EMPTY_T.gone + 6, EMPTY_T.gone + 14], [1, 0.86, 0.94], clamp) : 1;
  const chip = pop(frame, fps, EMPTY_T.chip, springs.bouncy);
  const check = interpolate(frame, [EMPTY_T.chip + 4, EMPTY_T.chip + 16], [0, 1], clamp);
  const bagX = 540 - BAG / 2;
  const open = interpolate(frame, [EMPTY_T.gone + 4, EMPTY_T.gone + 12], [0.6, 0], clamp);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={EMPTY_T.start - 4} stagger={2} />
      <Stage offsetY={-20}>
        <DateTile text={props.dueDate} x={90} s={t1} strong={false} color={p.blue} ink={p.blue} />
        <DateTile text={props.goneDate} x={770} s={t2 > 0.01 ? t2 : 0} strong color={p.blue} ink={p.blue} />
        {/* 14 day ticks between the tiles */}
        <div style={{ position: "absolute", left: 330, width: 420, top: 60, height: 80, opacity: t1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 40 }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 20,
                  height: i < ticks ? 34 : 20,
                  borderRadius: 10,
                  background: i < ticks ? p.blue : brand.grey,
                }}
              />
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 40,
              color: p.blue,
              opacity: fill > 0 ? 1 : 0.35,
            }}
          >
            {props.plusLabel}
          </div>
        </div>

        {/* papers sticking out of the open bag; they poof away on "leeg" */}
        {items.map((it, i) => {
          const dx = (i - 1.5) * 52;
          const s = 1 - gone;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 540 + dx - 60,
                top: GROUND - bagH - 70 + Math.abs(i - 1.5) * 18 - gone * 160,
                width: 120,
                height: 150,
                borderRadius: 16,
                background: brand.white,
                boxShadow: "0 6px 16px rgba(1,59,255,0.18)",
                transform: `rotate(${(i - 1.5) * 12 + gone * (i - 1.5) * 30}deg) scale(${s})`,
                opacity: s,
                fontFamily: fonts.ui,
                fontSize: 20,
                color: brand.greyText,
                padding: 14,
                boxSizing: "border-box",
              }}
            >
              {it.label}
              <div style={{ marginTop: 10, height: 10, borderRadius: 5, background: brand.grey }} />
              <div style={{ marginTop: 8, height: 10, width: "70%", borderRadius: 5, background: brand.grey }} />
            </div>
          );
        })}
        {/* poof ring */}
        {frame >= EMPTY_T.gone ? (
          <div
            style={{
              position: "absolute",
              left: 540 - 180,
              top: GROUND - bagH - 160,
              width: 360,
              height: 200,
              borderRadius: "50%",
              border: `6px dashed ${p.blueSoft}`,
              opacity: 1 - gone,
              transform: `scale(${0.6 + gone * 0.8})`,
            }}
          />
        ) : null}
        <div style={{ position: "absolute", left: bagX, top: GROUND - bagH, transform: `scaleY(${deflate})`, transformOrigin: "50% 100%" }}>
          <Rugzak width={BAG} body={p.blue} flap={brand.blueMid} pocket={p.blueSoft} accent={brand.blueMascot} open={open} />
        </div>
        <Buddy
          size={BUD}
          body={p.blueMascot}
          eye={p.white}
          blink={frame > EMPTY_T.chip + 6 ? 0.22 : blinkScale(frame, [EMPTY_T.start + 20])}
          look={{ x: -0.7, y: 0.2 }}
          style={{ position: "absolute", left: 790, top: GROUND - BUD * BUDDY_RATIO }}
        />
        {/* chip "Leeg" */}
        <div
          style={{
            position: "absolute",
            left: 90,
            top: GROUND - 280,
            padding: "18px 34px 18px 22px",
            borderRadius: 44,
            background: p.blue,
            color: brand.white,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 44,
            display: "flex",
            alignItems: "center",
            gap: 14,
            transform: `scale(${chip}) rotate(${(1 - chip) * -20}deg)`,
          }}
        >
          <Checkmark size={44} color={brand.white} progress={check} strokeWidth={6} />
          {props.emptyChip}
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={EMPTY_T.subline} />
    </SceneBg>
  );
};
