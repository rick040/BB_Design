import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { burstMask, floatUp } from "../lib/ballonWipes";
import { useLayout } from "../lib/layout";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type BallonProps, MARKERS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { BALLOON_POP, HookScene } from "./scenes/HookScene";
import { PriceScene } from "./scenes/PriceScene";

// Concept 84 · "Laat hem niet opblazen." (ballon)
// Scenes run on absolute frames so each cut sits on its spoken cue
// ([S3] and [S4]); [S2] continues inside the hook scene.
export const BallonAd: React.FC<BallonProps> = (props) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = [0, MARKERS[2], MARKERS[3]];
  const ends = [starts[1] + half, starts[2] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  // Burst centre = balloon centre in frame pixels.
  const popX = (L.width - 1080) / 2 + BALLOON_POP.x;
  const popY = L.stageCenterY + (BALLOON_POP.y - 450) * L.stageScale;

  const scenes: { node: React.ReactNode; style: (p: number) => React.CSSProperties }[] = [
    { node: <HookScene props={props.hook} bill={props.bill} />, style: () => ({}) },
    {
      node: <PriceScene props={props.price} bill={props.bill} />,
      style: (p) => burstMask(p, popX, popY, L.width, L.height),
    },
    { node: <CtaScene props={props.cta} />, style: (p) => floatUp(p) },
  ];

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light }}>
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
