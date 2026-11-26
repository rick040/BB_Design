import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { clamp } from "../lib/anim";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type RugzakProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { EmptyScene } from "./scenes/EmptyScene";
import { HookScene } from "./scenes/HookScene";
import { OpenScene } from "./scenes/OpenScene";
import { omkiep, rits } from "./wipes";

// Concept 123 · "Alles op tafel." (rugzak)
// Absolute frames: every scene start sits on its spoken cue, and each
// transition is centred on that cue.
// Transitions (CSS only): "rits" (next scene unzips open from the top down)
// and "omkiep" (the old scene is turned upside down and tipped out).
export const RugzakAd: React.FC<RugzakProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = props.transitionFrames;
  const half = T / 2;
  const [, s2, s3, s4] = SCENE_STARTS;
  const ease = Easing.inOut(Easing.cubic);
  const p = (s: number, len = T) => interpolate(frame, [s - len / 2, s + len / 2], [0, 1], { ...clamp, easing: ease });
  const pZip1 = p(s2);
  const pTip = interpolate(frame, [s3 - half, s3 + half + 4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const pZip2 = p(s4);

  const show = (from: number, to: number) => frame >= from && frame < to;

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        {show(0, s2 + half) ? (
          <AbsoluteFill>
            <HookScene props={props.hook} />
          </AbsoluteFill>
        ) : null}
        {show(s3 - half, s4 + half) ? (
          <AbsoluteFill>
            <EmptyScene props={props.empty} items={props.open.items} />
          </AbsoluteFill>
        ) : null}
        {show(s2 - half, s3 + half + 4) ? (
          <AbsoluteFill style={frame < s2 + half ? rits(pZip1, width, height) : pTip > 0 ? omkiep(pTip, height) : {}}>
            <OpenScene props={props.open} />
          </AbsoluteFill>
        ) : null}
        {show(s4 - half, TOTAL_FRAMES + 1) ? (
          <AbsoluteFill style={rits(pZip2, width, height)}>
            <CtaScene props={props.cta} />
          </AbsoluteFill>
        ) : null}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};

export const RUGZAK_TOTAL = TOTAL_FRAMES;
