import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { ReadScene } from "./scenes/ReadScene";
import { RefuseScene } from "./scenes/RefuseScene";
import { SCENE_STARTS, type SleutelbosProps, TOTAL_FRAMES, VO_FILE } from "./schema";
import { keyhole, keyTurn } from "./wipes";

// Concept 120 · "Houd je sleutels." (sleutelbos)
// Scenes run on absolute frames so each scene start sits on its spoken cue;
// every transition is centred on that cue.
export const SleutelbosAd: React.FC<SleutelbosProps> = (props) => {
  const frame = useCurrentFrame();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: { node: React.ReactNode; style: (p: number) => React.CSSProperties }[] = [
    { node: <HookScene props={props.hook} keys={props.keys} />, style: () => ({}) },
    { node: <RefuseScene props={props.refuse} keys={props.keys} />, style: (p) => keyhole(p) },
    { node: <ReadScene props={props.read} bill={props.bill} />, style: (p) => keyTurn(p) },
    { node: <CtaScene props={props.cta} keys={props.keys} />, style: (p) => keyhole(p) },
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
