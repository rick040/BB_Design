import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { coinFlip, slotReveal } from "../lib/slotWipes";
import "../theme";
import { SCENE_STARTS, type SpaarpotProps, TOTAL_FRAMES, VO_FILE } from "./schema";
import { BuddyScene } from "./scenes/BuddyScene";
import { CtaScene } from "./scenes/CtaScene";
import { FactScene } from "./scenes/FactScene";
import { HookScene } from "./scenes/HookScene";

// Concept 76 · "Zonde? Reken even mee." (spaarpot)
// Scenes run on absolute frames so each scene start sits exactly on its
// spoken cue; every transition is centred on that cue.
export const SpaarpotAd: React.FC<SpaarpotProps> = (props) => {
  const frame = useCurrentFrame();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: { node: React.ReactNode; style: (p: number) => React.CSSProperties }[] = [
    { node: <HookScene props={props.hook} />, style: () => ({}) },
    { node: <FactScene props={props.fact} />, style: (p) => coinFlip(p) },
    { node: <BuddyScene props={props.buddy} />, style: (p) => slotReveal(p, 50) },
    { node: <CtaScene props={props.cta} />, style: (p) => coinFlip(p) },
  ];

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        {scenes.map((s, i) => {
          const from = i === 0 ? 0 : starts[i] - half;
          if (frame < from || frame >= ends[i]) return null;
          const p = progress(i);
          const style = i > 0 && p < 1 ? s.style(p) : {};
          return (
            <AbsoluteFill key={i} style={style}>
              {s.node}
            </AbsoluteFill>
          );
        })}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
