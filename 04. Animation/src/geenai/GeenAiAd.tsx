import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { plateDrop, slamIn, stencilHoles } from "../lib/stencilWipes";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type GeenAiProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { NeeScene } from "./scenes/NeeScene";
import { RulesScene } from "./scenes/RulesScene";

// Concept 64 · "Geen AI. Gewoon vaste regels." (sjabloon)
// Scenes run on absolute frames so each scene start sits exactly on its
// spoken cue; every transition is centred on that cue.
export const GeenAiAd: React.FC<GeenAiProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: { node: React.ReactNode; style: (p: number) => React.CSSProperties }[] = [
    { node: <HookScene props={props.hook} invoice={props.invoice} />, style: () => ({}) },
    { node: <NeeScene props={props.nee} orbLabel={props.hook.orbLabel} />, style: (p) => slamIn(p) },
    { node: <RulesScene props={props.rules} invoice={props.invoice} />, style: (p) => stencilHoles(p, width, height) },
    { node: <CtaScene props={props.cta} />, style: (p) => plateDrop(p) },
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
