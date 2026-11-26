import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { clamp } from "../lib/anim";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type DuveltjeProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { SplitScene } from "./scenes/SplitScene";

// Concept 122 · "Hij springt pas als jij draait." (duveltje uit een doosje)
// Absolute frames: every scene start sits on its spoken cue.
// Transitions (CSS only): "split" (the hook breaks into two doors that slide
// apart onto the two screens) and "deksel" (the CTA folds down like a lid).
export const DuveltjeAd: React.FC<DuveltjeProps> = (props) => {
  const frame = useCurrentFrame();
  const T = props.transitionFrames;
  const half = T / 2;
  const [, s2, , s4] = SCENE_STARTS;
  const ease = Easing.inOut(Easing.cubic);
  const pSplit = interpolate(frame, [s2 - half, s2 + half], [0, 1], { ...clamp, easing: ease });
  const pLid = interpolate(frame, [s4 - half, s4 + half], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.2)) });

  const hook = <HookScene props={props.hook} bill={props.bill} />;
  const showHook = frame < s2 + half;
  const showSplit = frame >= s2 - half && frame < s4 + half;
  const showCta = frame >= s4 - half;

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue, perspective: 2400 }}>
        {showSplit ? (
          <AbsoluteFill style={{ filter: showCta ? `brightness(${1 - 0.35 * pLid})` : undefined }}>
            <SplitScene props={props.split} bill={props.bill} />
          </AbsoluteFill>
        ) : null}
        {showHook ? (
          pSplit <= 0 ? (
            <AbsoluteFill>{hook}</AbsoluteFill>
          ) : (
            <>
              <AbsoluteFill style={{ clipPath: "inset(0 50% 0 0)", transform: `translateX(${-pSplit * 560}px)` }}>{hook}</AbsoluteFill>
              <AbsoluteFill style={{ clipPath: "inset(0 0 0 50%)", transform: `translateX(${pSplit * 560}px)` }}>{hook}</AbsoluteFill>
            </>
          )
        ) : null}
        {showCta ? (
          <AbsoluteFill
            style={{
              transformOrigin: "50% 0%",
              transform: pLid < 1 ? `rotateX(${(1 - pLid) * 100}deg)` : undefined,
              backfaceVisibility: "hidden",
            }}
          >
            <CtaScene props={props.cta} />
          </AbsoluteFill>
        ) : null}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};

export const DUVELTJE_TOTAL = TOTAL_FRAMES;
