import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { useLayout } from "../../lib/layout";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand, fonts, headlineTracking } from "../../theme";
import { Cloth, FieldCard, GlassDrawer } from "../components/Glass";
import { type GlaslaProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const EXPIRY_T = {
  question: S - 4,
  answer: wordAt("veertien") - 4,
  countStart: wordAt("veertien"),
  countEnd: wordAt("is"),
  gone: wordAt("weg") - 4,
  goneStagger: 3,
  polish: wordAt("weg") + 6,
  polishEnd: SCENE_STARTS[4] + 6,
};
// Headline words land on the spoken words.
const SPOKEN = [
  wordAt("veertien"),
  wordAt("dagen"),
  wordAt("na"),
  wordAt("de"),
  wordAt("vervaldatum"),
  wordAt("weg"),
];

const DW = 760;
const DH = 500;

export const ExpiryScene: React.FC<{ props: GlaslaProps["expiry"]; fields: GlaslaProps["fields"] }> = ({ props, fields }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const qOut = interpolate(frame, [EXPIRY_T.answer - 6, EXPIRY_T.answer], [1, 0], clamp);
  const qIn = pop(frame, fps, EXPIRY_T.question, springs.pop);
  const lines = props.headline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const count = interpolate(frame, [EXPIRY_T.countStart, EXPIRY_T.countEnd], [0, props.days], clamp);
  const polishing = frame >= EXPIRY_T.polish && frame < EXPIRY_T.polishEnd;
  const pa = Math.max(0, frame - EXPIRY_T.polish) / 4;
  const blend = interpolate(frame, [EXPIRY_T.polish - 10, EXPIRY_T.polish], [0, 1], clamp);
  const rest = { x: 880, y: 600 };
  const circ = { x: 540 + Math.cos(pa) * 190, y: 330 + Math.sin(pa) * 120 };
  const cloth = { x: rest.x + (circ.x - rest.x) * blend, y: rest.y + (circ.y - rest.y) * blend };
  const buddyX = cloth.x + 30;

  const dotW = 40;
  const gap = 8;
  const stripW = props.days * dotW + (props.days - 1) * gap;
  const stripX = (1080 - stripW) / 2;

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
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: L.headlineSize * 0.5,
            color: p.white,
            opacity: Math.min(qOut, qIn * 1.4),
            transform: `scale(${0.9 + 0.1 * qIn})`,
          }}
        >
          {props.question}
        </div>
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
                      color: li === 0 ? p.white : p.blueSoft,
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

      <Stage offsetY={0}>
        <GlassDrawer width={DW} height={DH} frost={0} open={1} edge={p.white} backdrop={p.blue} style={{ left: (1080 - DW) / 2, top: 0 }}>
          {fields.map((f, i) => {
            const g = interpolate(frame, [EXPIRY_T.gone + i * EXPIRY_T.goneStagger, EXPIRY_T.gone + i * EXPIRY_T.goneStagger + 10], [0, 1], clamp);
            return (
              <FieldCard
                key={i}
                label={f.label}
                value={f.value}
                width={DW - 110}
                style={{
                  left: 49,
                  top: 70 + i * 104,
                  height: 92,
                  opacity: 1 - g,
                  transform: `translateY(${-g * 60}px) scale(${1 - g * 0.15})`,
                  filter: `blur(${g * 12}px)`,
                }}
              />
            );
          })}
          {/* sparkle once the glass is empty and polished */}
          {frame > EXPIRY_T.polish + 8 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 40,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 44,
                color: p.white,
                opacity: interpolate(frame, [EXPIRY_T.polish + 8, EXPIRY_T.polish + 16], [0, 0.9], clamp),
              }}
            >
              {props.goneLabel}
            </div>
          ) : null}
        </GlassDrawer>

        {/* 14-day strip after the due date */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 680,
            textAlign: "center",
            fontFamily: fonts.ui,
            fontSize: 42,
            fontWeight: 600,
            color: p.blueSoft,
          }}
        >
          {props.dueLabel} + {Math.round(count)} {Math.round(count) === 1 ? "dag" : "dagen"}
        </div>
        {Array.from({ length: props.days }).map((_, i) => {
          const on = count > i + 0.5;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: stripX + i * (dotW + gap),
                top: 740,
                width: dotW,
                height: dotW,
                borderRadius: 10,
                background: on ? (i === props.days - 1 ? brand.yellow : p.white) : "rgba(255,255,255,0.22)",
                transform: `scale(${on ? 1 : 0.8})`,
              }}
            />
          );
        })}

        <Buddy
          size={150}
          body={p.white}
          eye={p.blueMascot}
          blink={frame > EXPIRY_T.polishEnd - 8 ? 0.18 : 1}
          look={{ x: polishing ? -0.8 : -0.3, y: polishing ? -0.4 : 0.6 }}
          squash={polishing ? 1 + Math.sin(pa * 2) * 0.05 : 1}
          style={{
            position: "absolute",
            left: buddyX,
            top: cloth.y - 150 * BUDDY_RATIO / 2,
            transition: "none",
          }}
        />
        <Cloth size={110} color={brand.yellow} rot={polishing ? pa * 30 : 0} style={{ left: cloth.x - 55, top: cloth.y - 55 }} />
      </Stage>
    </SceneBg>
  );
};
