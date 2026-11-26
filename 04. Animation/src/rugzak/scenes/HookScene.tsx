import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand, fonts } from "../../theme";
import { Rugzak, RUGZAK_H, RUGZAK_W } from "../components/Rugzak";
import { type RugzakProps, wordAt } from "../schema";

// Absolute frames. Frame 0 already shows the question, Buddy and his bag.
export const HOOK_T = {
  wiggle: wordAt("buddy"), // the bag wiggles on "Buddy"
  glance: wordAt("van"), // Buddy glances at the bag
  mark: wordAt("je"), // question mark pops on "je?"
};

const GROUND = 860;
const BUD = 340;
const BAG = 360;

export const HookScene: React.FC<{ props: RugzakProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const wig = interpolate(frame, [HOOK_T.wiggle, HOOK_T.wiggle + 14], [0, 1], clamp);
  const rot = Math.sin(wig * Math.PI * 3) * 7 * (1 - wig);
  const look = interpolate(frame, [HOOK_T.glance - 4, HOOK_T.glance + 4], [0, 1], clamp);
  const mark = pop(frame, fps, HOOK_T.mark - 4, springs.bouncy);
  const bagH = (BAG * RUGZAK_H) / RUGZAK_W;
  const breathe = 1 + Math.sin(frame / 7) * 0.012;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-12} stagger={2} />
      <Stage>
        {/* ground shadow */}
        <div style={{ position: "absolute", left: 110, width: 860, top: GROUND - 8, height: 26, borderRadius: "50%", background: "rgba(1,59,255,0.08)" }} />
        <Buddy
          size={BUD}
          body={p.blueMascot}
          eye={p.white}
          blink={blinkScale(frame, [22])}
          look={{ x: 0.2 + 0.6 * look, y: 0.1 }}
          squash={breathe}
          style={{ position: "absolute", left: 110, top: GROUND - BUD * BUDDY_RATIO }}
        />
        <div
          style={{
            position: "absolute",
            left: 570,
            top: GROUND - bagH,
            transform: `rotate(${rot}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <Rugzak width={BAG} body={p.blue} flap={brand.blueMid} pocket={p.blueSoft} accent={brand.blueMascot} />
        </div>
        {/* question mark chip above the bag */}
        <div
          style={{
            position: "absolute",
            left: 570 + BAG / 2 - 70,
            top: GROUND - bagH - 170,
            width: 140,
            height: 140,
            borderRadius: 70,
            background: brand.yellow,
            color: brand.ink,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${mark}) rotate(${(1 - mark) * -30}deg)`,
          }}
        >
          {props.bagLabel}
        </div>
      </Stage>
    </SceneBg>
  );
};
