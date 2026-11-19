import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { beadRoll, threadWipe } from "../lib/kralenWipes";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type KralenProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { SheetScene } from "./scenes/SheetScene";
import { ThreadScene } from "./scenes/ThreadScene";

// Concept 102 · "Alles aan één draad." (kralen)
// Scenes run on absolute frames so each scene start sits exactly on its
// spoken cue; every transition is centred on that cue.
export const KralenAd: React.FC<KralenProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: { node: React.ReactNode; style: (p: number) => React.CSSProperties }[] = [
    { node: <HookScene props={props.hook} beads={props.beads} order={props.looseOrder} />, style: () => ({}) },
    { node: <ThreadScene props={props.thread} beads={props.beads} />, style: (p) => threadWipe(p, "left") },
    { node: <SheetScene props={props.sheet} beads={props.beads} />, style: (p) => beadRoll(p, width, height) },
    { node: <CtaScene props={props.cta} beads={props.beads} />, style: (p) => threadWipe(p, "right") },
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
