import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { splitFlap, ticketTear } from "../lib/ticketWipes";
import "../theme";
import { SCENE_STARTS, TOTAL_FRAMES, VO_FILE, type OproepProps } from "./schema";
import { CallScene } from "./scenes/CallScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";

// Concept 71 · "Elke nota op zijn beurt." (oproep)
// Scenes run on absolute frames so each scene start sits on its spoken cue;
// every transition is centred on that cue. Transitions: ticket tear
// (perforated zig-zag edge) and split-flap (departure-board flip).
export const OproepAd: React.FC<OproepProps> = (props) => {
  const frame = useCurrentFrame();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: React.ReactNode[] = [
    <HookScene props={props.hook} notas={props.notas} />,
    <ForwardScene props={props.forward} notas={props.notas} />,
    <CallScene props={props.call} notas={props.notas} />,
    <CtaScene props={props.cta} />,
  ];

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        {scenes.map((node, i) => {
          const from = i === 0 ? 0 : starts[i] - half;
          if (frame < from || frame >= ends[i]) return null;
          const p = progress(i);
          if (i === 0 || p >= 1) return <AbsoluteFill key={i}>{node}</AbsoluteFill>;
          if (i === 2) {
            const f = splitFlap(p);
            return (
              <React.Fragment key={i}>
                <AbsoluteFill style={f.top}>{node}</AbsoluteFill>
                <AbsoluteFill style={f.bottom}>{node}</AbsoluteFill>
              </React.Fragment>
            );
          }
          return (
            <AbsoluteFill key={i} style={ticketTear(p, i === 1 ? "top" : "bottom")}>
              {node}
            </AbsoluteFill>
          );
        })}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
