import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { MusicBox } from "../components/MusicBox";
import { SCENE_STARTS, type SpeeldoosProps, wordAt } from "../schema";
import { AiBadge } from "./HookScene";

const S = SCENE_STARTS[1];
export const NEE_T = {
  jump: S - 2, // Buddy jumps up on "Nee"
  bonk: wordAt("buddy") - 2, // Buddy heads the AI badge out of frame
  box: wordAt("werkt"), // the music box pops up
  fact: wordAt("speeldoos"), // FEIT label
};

const BUDDY = 230;
const FLOOR = 800;
const BOX_X = 110;
const BOX_Y = FLOOR - 240;

export const NeeScene: React.FC<{ props: SpeeldoosProps["nee"]; badge: string }> = ({ props, badge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Buddy: in from the right, hop up to the badge, land next to the box.
  const hop = interpolate(frame, [NEE_T.jump, NEE_T.bonk, NEE_T.box + 6], [0, 1, 2], clamp);
  const bx = interpolate(hop, [0, 1, 2], [1150, 690, 900]);
  const arc = hop < 1 ? Math.sin(hop * Math.PI * 0.5) : Math.cos((hop - 1) * Math.PI * 0.5);
  const by = FLOOR - 330 * arc;
  const landSq = interpolate(frame, [NEE_T.box + 6, NEE_T.box + 9, NEE_T.box + 15], [1, 0.8, 1], clamp);
  const bonkSq = interpolate(frame, [NEE_T.bonk - 1, NEE_T.bonk + 2, NEE_T.bonk + 7], [1, 0.82, 1.06], clamp);

  // Badge: hovers top-right, then gets knocked off frame spinning.
  const hit = interpolate(frame, [NEE_T.bonk, NEE_T.bonk + 16], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const badgeX = 680 + 700 * hit;
  const badgeY = 230 - 520 * hit + Math.sin(frame / 9) * 8;

  const boxIn = pop(frame, fps, NEE_T.box, springs.bouncy);
  const lid = interpolate(frame, [NEE_T.box + 4, NEE_T.box + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const fact = pop(frame, fps, NEE_T.fact, springs.pop);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={S - 4} stagger={2} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: BOX_X,
            top: BOX_Y,
            transform: `scale(${boxIn})`,
            transformOrigin: "50% 100%",
            opacity: Math.min(1, boxIn * 3),
          }}
        >
          <MusicBox lid={lid} crank={-60} phase={0} body={p.white} face={p.blueSoft} inside="#0a2bb8" accent={p.yellow} slot={false} />
        </div>
        <div
          style={{
            position: "absolute",
            left: BOX_X - 40,
            top: BOX_Y - 300,
            transform: `rotate(-8deg) scale(${interpolate(fact, [0, 1], [2.2, 1])})`,
            opacity: Math.min(1, fact * 3),
            background: p.teal,
            color: p.ink,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 60,
            letterSpacing: "0.08em",
            padding: "8px 28px",
            borderRadius: 16,
          }}
        >
          {props.factLabel}
        </div>
        <div style={{ position: "absolute", left: badgeX - 75, top: badgeY - 75, transform: `rotate(${hit * 540}deg) scale(${1 - 0.4 * hit})` }}>
          <AiBadge text={badge} frame={frame} ink={p.ink} yellow={p.yellow} />
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [NEE_T.box + 18])}
          squash={Math.min(landSq, bonkSq)}
          look={frame < NEE_T.bonk + 4 ? { x: -0.4, y: -0.9 } : { x: -0.9, y: 0.3 }}
          style={{ position: "absolute", left: bx - BUDDY / 2, top: by - BUDDY * BUDDY_RATIO }}
        />
      </Stage>
    </SceneBg>
  );
};
