import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Sparkle } from "../components/Ruler";
import { type RegelsProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[1];
// Headline words land on the spoken words; the AI chip is struck at "geen".
export const FACT_T = {
  no: S,
  strike: wordAt("geen"),
  drop: wordAt("ai", 2),
  tag: wordAt("mail"),
};
const SPOKEN = ["er", "gaat", "geen", "ai", "over", "je", "mail"].map((w) => (w === "je" ? wordAt("je", 2) : w === "ai" ? wordAt("ai", 2) : wordAt(w)));

const BUDDY = 320;
const FEET = 920;

export const FactScene: React.FC<{ props: RegelsProps["fact"]; aiChip: string }> = ({ props, aiChip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const noIn = pop(frame, fps, FACT_T.no - 4, springs.pop);
  const strike = interpolate(frame, [FACT_T.strike, FACT_T.strike + 8], [0, 1], clamp);
  const fall = Math.max(0, frame - FACT_T.drop);
  const tagIn = pop(frame, fps, FACT_T.tag, springs.bouncy);
  const head = FEET - BUDDY * BUDDY_RATIO;
  // Sparkles fall off Buddy when the chip is struck.
  const bits = [-1, -0.4, 0.4, 1].map((k, i) => ({
    x: 540 + k * 260 + k * fall * 3,
    y: head + 60 + 0.9 * fall * fall * 0.6 - (i % 2) * 40,
    r: fall * (8 + i * 3),
    o: interpolate(fall, [0, 24], [1, 0], clamp),
  }));
  const happy = frame > FACT_T.tag + 4 ? 0.2 : 1;

  let wi = 0;
  const lines = props.headline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
          color: p.white,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const at = SPOKEN[wi] ?? SPOKEN[SPOKEN.length - 1];
              wi++;
              const s = pop(frame, fps, at - 3, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      opacity: Math.min(1, s * 1.4),
                      transform: `translateY(${(1 - s) * 0.4}em)`,
                      filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                    }}
                  >
                    {w}
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
      <Stage>
        {/* Giant "Nee." */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 20,
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 300,
            lineHeight: 1,
            letterSpacing: headlineTracking,
            color: p.blueSoft,
            opacity: Math.min(1, noIn * 1.5),
            transform: `scale(${1.5 - 0.5 * noIn})`,
          }}
        >
          {props.no}
        </div>
        {/* The AI chip, struck through, then falls away. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 370 + 0.5 * fall * fall * 0.5,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(fall, [10, 26], [1, 0], clamp),
            transform: `rotate(${fall * 1.6}deg)`,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: p.white,
              color: p.blue,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 72,
              padding: "14px 40px",
              borderRadius: 60,
            }}
          >
            <Sparkle size={52} color={p.blue} />
            {aiChip}
            <div
              style={{
                position: "absolute",
                left: -16,
                top: "50%",
                height: 12,
                width: `calc(${strike * 100}% + 32px)`,
                background: p.red,
                borderRadius: 6,
                transform: "rotate(-8deg)",
                transformOrigin: "0 50%",
              }}
            />
          </div>
        </div>
        {bits.map((b, i) => (
          <Sparkle
            key={i}
            size={60}
            color={p.blueSoft}
            style={{ position: "absolute", left: b.x - 30, top: b.y - 30, opacity: frame < FACT_T.drop ? 0.8 : b.o, transform: `rotate(${b.r}deg)` }}
          />
        ))}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={happy}
          look={{ x: 0, y: frame < FACT_T.tag ? -0.6 : 0.2 }}
          squash={interpolate(frame, [FACT_T.drop, FACT_T.drop + 4, FACT_T.drop + 10], [1, 0.86, 1], clamp)}
          style={{ position: "absolute", left: 540 - BUDDY / 2, top: head }}
        />
        {/* Fact tag */}
        <div
          style={{
            position: "absolute",
            left: 690,
            top: head - 20,
            opacity: Math.min(1, tagIn * 2),
            transform: `rotate(-10deg) scale(${1.6 - 0.6 * tagIn})`,
            background: p.teal,
            color: p.ink,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 62,
            padding: "12px 34px",
            borderRadius: 18,
          }}
        >
          {props.factTag}
        </div>
      </Stage>
    </SceneBg>
  );
};
