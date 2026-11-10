import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { AiOrb } from "../components/AiOrb";
import { Chip } from "../components/Chip";
import { type GeenAiProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[1];
// Absolute frames. The fact: a huge "Nee.", Buddy shakes his head, the orb is struck out.
export const NEE_T = {
  nee: S, // "Nee." slams in on the spoken word
  buddy: wordAt("Buddy"), // Buddy pops up
  shake: wordAt("gebruikt"), // head shake starts
  shakeLen: 30,
  strike: wordAt("AI", 2), // red strike through the orb
};
// Subline words land on the spoken words.
const SPOKEN = [wordAt("Buddy"), wordAt("gebruikt"), wordAt("geen"), wordAt("AI", 2)];

const BUDDY = 230;
const FEET = 820;

export const NeeScene: React.FC<{ props: GeenAiProps["nee"]; orbLabel: string }> = ({ props, orbLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const neeIn = pop(frame, fps, NEE_T.nee - 2, springs.pop);
  const buddyIn = pop(frame, fps, NEE_T.buddy - 4, springs.bouncy);
  const shakeT = frame - NEE_T.shake;
  const shaking = shakeT >= 0 && shakeT < NEE_T.shakeLen;
  const lookX = shaking ? Math.sin(shakeT * 0.65) * (1 - shakeT / NEE_T.shakeLen) : frame >= NEE_T.strike ? 0.8 : 0.2;
  const strike = interpolate(frame, [NEE_T.strike, NEE_T.strike + 8], [0, 1], clamp);
  const dead = interpolate(frame, [NEE_T.strike + 4, NEE_T.strike + 16], [0, 1], clamp);
  const orbIn = pop(frame, fps, S + 4, springs.smooth);
  const chipIn = pop(frame, fps, S + 6, springs.bouncy);

  const words = props.subline.split(/\s+/);

  return (
    <SceneBg color={p.blue}>
      <Chip text={props.factChip} bg={p.teal} color={p.ink} style={{ left: "50%", top: L.safeTop + 10, transform: `translateX(-50%) scale(${chipIn})` }} />
      <Stage offsetY={-40}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -40,
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 400,
            lineHeight: 1,
            letterSpacing: headlineTracking,
            color: p.white,
            transform: `scale(${0.6 + 0.4 * neeIn})`,
            opacity: Math.min(1, neeIn * 2),
          }}
        >
          {props.word}
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [NEE_T.strike + 12])}
          look={{ x: lookX, y: 0.1 }}
          squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.12, 1])}
          style={{
            position: "absolute",
            left: 330 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        <AiOrb
          size={200}
          label={orbLabel}
          glow={1 - dead}
          strike={strike}
          dead={dead}
          style={{ left: 740 - 100, top: FEET - 230, opacity: orbIn, transform: `scale(${0.9 - 0.1 * dead})` }}
        />
      </Stage>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: L.safeBottom + 10,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 72,
          letterSpacing: "-0.04em",
          color: p.white,
        }}
      >
        {words.map((w, i) => {
          const s = pop(frame, fps, (SPOKEN[i] ?? SPOKEN[SPOKEN.length - 1]) - 3, springs.pop);
          return (
            <React.Fragment key={i}>
              <span style={{ display: "inline-block", opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 0.4}em)` }}>{w}</span>{" "}
            </React.Fragment>
          );
        })}
      </div>
    </SceneBg>
  );
};
