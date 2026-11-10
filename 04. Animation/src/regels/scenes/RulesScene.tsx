import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Subline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Ruler } from "../components/Ruler";
import { type RegelsProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
// Each line is read on its spoken word.
export const RULES_T = {
  sheet: S - 2,
  line1: wordAt("bedrag"),
  line2: wordAt("vervaldatum"),
  line3: wordAt("betaallink"),
  line4: wordAt("kenmerk"),
  subline: wordAt("kenmerk") + 12,
};
const LINE_AT = [RULES_T.line1, RULES_T.line2, RULES_T.line3, RULES_T.line4];
const SPOKEN = [wordAt("buddy", 2), wordAt("leest", 2), wordAt("met", 2), wordAt("vaste"), wordAt("regels")];

const SHEET_X = 110;
const SHEET_W = 860;
const SHEET_TOP = 10;
const TITLE_H = 120;
const LINE_H = 160;
const lineY = (i: number) => SHEET_TOP + TITLE_H + i * LINE_H;
const RULER_W = 940;
const RULER_H = 40;
const BUDDY = 170;

export const RulesScene: React.FC<{ props: RegelsProps["rules"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const sheetIn = pop(frame, fps, RULES_T.sheet, springs.smooth);
  // Ruler steps to the bottom edge of each line on its cue.
  let ry = lineY(0) - 20;
  for (let i = 0; i < 4; i++) {
    const t = interpolate(frame, [LINE_AT[i] - 8, LINE_AT[i]], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    const from = i === 0 ? lineY(0) - 20 : lineY(i - 1) + LINE_H - 20;
    const to = lineY(i) + LINE_H - 20;
    if (frame >= LINE_AT[i] - 8) ry = from + (to - from) * t;
  }
  const hop = LINE_AT.reduce((acc, at) => acc + Math.max(0, Math.sin(Math.PI * interpolate(frame, [at - 8, at], [0, 1], clamp))), 0);
  const rulerIn = interpolate(frame, [S, S + 10], [0, 1], clamp);

  let wi = 0;
  const lines = props.headline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));

  return (
    <SceneBg color={p.light}>
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
          color: p.blue,
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
      <Stage offsetY={60}>
        {/* The forwarded bill as a ruled sheet. */}
        <div
          style={{
            position: "absolute",
            left: SHEET_X,
            top: SHEET_TOP,
            width: SHEET_W,
            height: TITLE_H + 4 * LINE_H + 30,
            background: p.white,
            borderRadius: 40,
            boxShadow: "0 30px 80px rgba(1, 59, 255, 0.14)",
            opacity: sheetIn,
            transform: `translateY(${(1 - sheetIn) * 60}px)`,
          }}
        >
          <div
            style={{
              height: TITLE_H,
              display: "flex",
              alignItems: "center",
              paddingLeft: 56,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 44,
              color: p.ink,
              borderBottom: `4px solid ${p.blueSoft}`,
            }}
          >
            {props.sheetTitle}
          </div>
          {props.lines.map((l, i) => {
            const at = LINE_AT[i];
            const val = interpolate(frame, [at, at + 6], [0, 1], clamp);
            const check = interpolate(frame, [at + 2, at + 12], [0, 1], clamp);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: TITLE_H + i * LINE_H,
                  height: LINE_H,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 56px",
                  borderBottom: i < 3 ? `3px solid ${p.grey}` : "none",
                  fontFamily: fonts.ui,
                }}
              >
                <div style={{ width: 86 }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      border: `5px solid ${check > 0 ? p.blue : p.greyText}`,
                      background: check > 0 ? p.blue : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Checkmark size={40} color={p.white} progress={check} strokeWidth={16} />
                  </div>
                </div>
                <div style={{ flex: 1, marginTop: -10 }}>
                  <div style={{ fontSize: 34, color: "#6b6b78", fontWeight: 500 }}>{l.label}</div>
                  <div
                    style={{
                      fontSize: 54,
                      fontWeight: 600,
                      color: p.ink,
                      height: 62,
                      opacity: val,
                      transform: `translateX(${(1 - val) * 30}px)`,
                    }}
                  >
                    {l.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Ruler with Buddy riding on it, line by line. */}
        <div
          style={{
            position: "absolute",
            left: (1080 - RULER_W) / 2,
            top: ry,
            opacity: rulerIn,
            transform: `translateX(${(1 - rulerIn) * 400}px)`,
          }}
        >
          <Buddy
            size={BUDDY}
            body={p.blueMascot}
            eye={p.white}
            look={{ x: -0.8, y: 0.5 }}
            squash={1 - 0.12 * Math.min(1, hop)}
            style={{
              position: "absolute",
              left: RULER_W - BUDDY - 50,
              top: -BUDDY * BUDDY_RATIO + 4 - 30 * Math.min(1, hop),
            }}
          />
          <Ruler width={RULER_W} height={RULER_H} style={{ opacity: 0.92 }} />
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={RULES_T.subline} />
    </SceneBg>
  );
};
