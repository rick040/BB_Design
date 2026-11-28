import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { SCENE_STARTS, type SpeeldoosProps, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { NeeScene } from "./scenes/NeeScene";
import { RulesScene } from "./scenes/RulesScene";
import { combIn, lidCloseIn, lidOpenOut } from "./wipes";

// Concept 129 · "Geen AI. Gewoon vaste regels." (speeldoos)
// Scenes run on absolute frames; every transition is centred on the spoken
// cue of the next scene ([S2], [S3], [S4] in public/vo/speeldoos/script.txt).
export const SpeeldoosAd: React.FC<SpeeldoosProps> = (props) => {
  const frame = useCurrentFrame();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  // in: style for scene i while it enters; out: style for scene i while scene i+1 enters.
  const scenes: {
    node: React.ReactNode;
    in?: (p: number) => React.CSSProperties;
    out?: (p: number) => React.CSSProperties;
    z: number;
  }[] = [
    { node: <HookScene props={props.hook} bill={props.bill} />, out: lidOpenOut, z: 2 },
    { node: <NeeScene props={props.nee} badge={props.hook.badge} />, z: 1 },
    { node: <RulesScene props={props.rules} />, in: combIn, z: 3 },
    { node: <CtaScene props={props.cta} />, in: lidCloseIn, z: 4 },
  ];

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        {scenes.map((s, i) => {
          const from = i === 0 ? 0 : starts[i] - half;
          if (frame < from || frame >= ends[i]) return null;
          let style: React.CSSProperties = {};
          if (i > 0 && s.in && progress(i) < 1) style = s.in(progress(i));
          if (i < 3 && s.out && progress(i + 1) > 0) style = s.out(progress(i + 1));
          return (
            <AbsoluteFill key={i} style={{ zIndex: s.z, ...style }}>
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
