import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { capsuleWipe, lidDrop, strikeWipe } from "../lib/pillWipes";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type WeekdoosProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { FactScene } from "./scenes/FactScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";

// Concept 95 · "Elke nota op zijn dag." (weekdoos)
// Scenes run on absolute frames; each transition is centred on its spoken cue.
// Strike opens from the struck-through myth line, capsule grows out of a pill
// shape, lid folds the CTA down like the box closing.
export const WeekdoosAd: React.FC<WeekdoosProps> = (props) => {
  const frame = useCurrentFrame();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: { node: React.ReactNode; style: (p: number) => React.CSSProperties }[] = [
    { node: <HookScene props={props.hook} notas={props.notas} />, style: () => ({}) },
    { node: <FactScene props={props.fact} notas={props.notas} />, style: (p) => strikeWipe(p, 0.21) },
    { node: <ForwardScene props={props.forward} notas={props.notas} />, style: (p) => capsuleWipe(p) },
    { node: <CtaScene props={props.cta} notas={props.notas} />, style: (p) => lidDrop(p) },
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
