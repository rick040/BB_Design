import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { bounceDrop, netSweep } from "../lib/tableWipes";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { SCENE_STARTS, type TafeltennisProps, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { NeeScene } from "./scenes/NeeScene";
import { ServeScene } from "./scenes/ServeScene";

// Concept 80 · "Alleen wat jij toespeelt." (tafeltennis)
// Scenes run on absolute frames so each scene start sits exactly on its
// spoken cue; every transition is centred on that cue.
export const TafeltennisAd: React.FC<TafeltennisProps> = (props) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: { node: React.ReactNode; style: (p: number) => React.CSSProperties }[] = [
    { node: <HookScene props={props.hook} mailbox={props.mailbox} />, style: () => ({}) },
    { node: <NeeScene props={props.nee} mailbox={props.mailbox} />, style: (p) => netSweep(p) },
    { node: <ServeScene props={props.serve} mailbox={props.mailbox} bill={props.bill} />, style: (p) => bounceDrop(p, height) },
    { node: <CtaScene props={props.cta} />, style: (p) => netSweep(p) },
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
