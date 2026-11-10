import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { sumLine, sumReveal, tiltIn } from "../lib/scaleWipes";
import "../theme";
import { SCENE_STARTS, TOTAL_FRAMES, VO_FILE, type WeegschaalProps } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { BuddyScene } from "./scenes/BuddyScene";
import { CtaScene } from "./scenes/CtaScene";
import { WeighScene } from "./scenes/WeighScene";

type Kind = "none" | "tilt" | "sum";

// Concept 66 · "Reken maar uit." (weegschaal)
// Scenes run on absolute frames so each scene start sits exactly on its
// spoken cue; every transition is centred on that cue. Scene 1 and 2 share
// one scale (the headline swaps on the cue of [S2]).
export const WeegschaalAd: React.FC<WeegschaalProps> = (props) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = [0, SCENE_STARTS[2], SCENE_STARTS[3], SCENE_STARTS[4]];
  const ends = [...starts.slice(1).map((s) => s + half), TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;
  const lineY = 0.5;

  const scenes: { node: React.ReactNode; kind: Kind; lineColor?: string }[] = [
    { node: <WeighScene hook={props.hook} fine={props.fine} bill={props.bill} />, kind: "none" },
    { node: <BuddyScene props={props.buddy} bill={props.bill} weight={props.fine.weight} />, kind: "tilt" },
    { node: <AgendaScene props={props.agenda} bill={props.bill} />, kind: "sum", lineColor: props.colors.blue },
    { node: <CtaScene props={props.cta} />, kind: "sum", lineColor: props.colors.light },
  ];

  let overlay: React.ReactNode = null;
  scenes.forEach((s, i) => {
    const p = progress(i);
    if (i > 0 && s.kind === "sum" && p >= 0 && p < 1) {
      const len = sumLine(p);
      overlay = (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: height * lineY - 6,
            width: (1080 - 120) * len,
            height: 12,
            borderRadius: 6,
            background: s.lineColor,
            opacity: p > 0.8 ? (1 - p) * 5 : 1,
          }}
        />
      );
    }
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        {scenes.map((s, i) => {
          const from = i === 0 ? 0 : starts[i] - half;
          if (frame < from || frame >= ends[i]) return null;
          const p = progress(i);
          const style = i > 0 && p < 1 ? (s.kind === "tilt" ? tiltIn(p) : s.kind === "sum" ? sumReveal(p, lineY * 100) : {}) : {};
          return (
            <AbsoluteFill key={i} style={style}>
              {s.node}
            </AbsoluteFill>
          );
        })}
        {overlay}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
