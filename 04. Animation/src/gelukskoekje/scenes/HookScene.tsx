import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Cookie } from "../components/Cookie";
import { Slip } from "../components/Slip";
import { LabelChip } from "../components/SpokenLine";
import { type GelukskoekjeProps, wordAt } from "../schema";

// Absolute frames; the cookie cracks on the spoken word "voorspelt".
export const HOOK_T = {
  ai: wordAt("AI") - 2,
  crack: wordAt("voorspelt"),
  slip: wordAt("voorspelt") + 6,
  marks: wordAt("voorspelt") + 16,
  doubt: wordAt("voorspelt") + 20,
};

const DARK = "#111827";
const COOKIE = 700;
const BUDDY = 200;

const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill={color} />
  </svg>
);

export const HookScene: React.FC<{ props: GelukskoekjeProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const crack = pop(frame, fps, HOOK_T.crack, springs.pop);
  const wobble = frame < HOOK_T.crack ? Math.sin(frame / 3.2) * 3 * interpolate(frame, [30, HOOK_T.crack], [0.3, 1.6], clamp) : 0;
  const aiIn = pop(frame, fps, HOOK_T.ai, springs.bouncy);
  const aiFade = interpolate(frame, [HOOK_T.crack, HOOK_T.crack + 8], [1, 0.35], clamp);
  const slipOpen = interpolate(frame, [HOOK_T.slip, HOOK_T.slip + 14], [0, 1], clamp);
  const slipRise = pop(frame, fps, HOOK_T.slip, springs.smooth);
  const buddyLook = interpolate(frame, [HOOK_T.slip, HOOK_T.slip + 10], [0, 1], clamp);
  const doubt = interpolate(frame, [HOOK_T.doubt, HOOK_T.doubt + 6], [1, 0.5], clamp);
  const blink = Math.min(doubt, blinkScale(frame, [40]));
  const crackSquash = interpolate(frame, [HOOK_T.crack, HOOK_T.crack + 3, HOOK_T.crack + 10], [1, 1.12, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-16} stagger={2} />
      <Stage offsetY={30}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", justifyContent: "center" }}>
          <LabelChip text={props.label} bg={DARK} fg={p.white} />
        </div>

        {/* The fortune slip with the vague prediction. */}
        <Slip
          width={880}
          height={240}
          open={slipOpen}
          style={{ left: 100, top: 110 + (1 - slipRise) * 120, transform: `rotate(${-2 + wobble * 0.2}deg)` }}
        >
          {props.guess.map((g, i) => (
            <div
              key={i}
              style={{
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 66,
                letterSpacing: "-0.03em",
                color: "#6b6b78",
                lineHeight: 1.15,
              }}
            >
              {g}
            </div>
          ))}
        </Slip>

        {/* Floating question marks once the slip is out. */}
        {[
          { x: 90, y: 400, r: -14, d: 0 },
          { x: 990, y: 90, r: 12, d: 5 },
          { x: 990, y: 420, r: -6, d: 10 },
        ].map((q, i) => {
          const s = pop(frame, fps, HOOK_T.marks + q.d, springs.bouncy);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: q.x - 30,
                top: q.y - 40 + Math.sin((frame + i * 9) / 7) * 8,
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 96,
                color: p.blueSoft,
                opacity: Math.min(1, s * 1.5),
                transform: `rotate(${q.r}deg) scale(${s})`,
              }}
            >
              ?
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 540 - COOKIE / 2,
            top: 400,
            transform: `rotate(${wobble}deg)`,
            transformOrigin: "50% 90%",
          }}
        >
          <Cookie width={COOKIE} crack={crack} />
        </div>

        {/* The "AI" that supposedly guesses along. */}
        <div
          style={{
            position: "absolute",
            left: 690,
            top: 350,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: DARK,
            color: p.white,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 58,
            padding: "16px 36px 16px 26px",
            borderRadius: 44,
            opacity: Math.min(1, aiIn * 2) * aiFade,
            transform: `rotate(8deg) scale(${aiIn})`,
            boxShadow: "0 18px 40px rgba(17,24,39,0.25)",
          }}
        >
          <Sparkle size={50} color={p.yellow} />
          {props.aiChip}
        </div>

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={crackSquash}
          look={{ x: -0.6 * buddyLook - 0.2, y: -0.8 * buddyLook + 0.2 }}
          style={{ position: "absolute", left: 130 - BUDDY / 2, top: 975 - BUDDY * BUDDY_RATIO }}
        />
      </Stage>
    </SceneBg>
  );
};
