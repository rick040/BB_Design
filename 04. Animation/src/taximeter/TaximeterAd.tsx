import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { headlight, rollIn, rollOut } from "../lib/meterWipes";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { SCENE_STARTS, type TaximeterProps, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { MeterScene } from "./scenes/MeterScene";

// Concept 92 · "Vast tarief. Geen meter." (taximeter)
// Scenes run on absolute frames; each transition is centred on its spoken cue.
// Scene 1+2 is one shot (meter), so there are two cuts: [S3] and [S4].
export const TaximeterAd: React.FC<TaximeterProps> = (props) => {
  const frame = useCurrentFrame();
  const T = props.transitionFrames;
  const half = T / 2;
  const cut1 = SCENE_STARTS[2];
  const cut2 = SCENE_STARTS[3];
  const p1 = (frame - (cut1 - half)) / T;
  const p2 = (frame - (cut2 - half)) / T;

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        {frame < cut1 + half ? (
          <AbsoluteFill style={p1 > 0 ? rollOut(p1) : {}}>
            <MeterScene props={props.hook} bill={props.bill} />
          </AbsoluteFill>
        ) : null}
        {frame >= cut1 - half && frame < cut2 + half ? (
          <AbsoluteFill style={p1 < 1 ? rollIn(p1) : {}}>
            <ForwardScene props={props.forward} hook={props.hook} bill={props.bill} />
          </AbsoluteFill>
        ) : null}
        {frame >= cut2 - half ? (
          <AbsoluteFill style={p2 < 1 ? headlight(p2) : {}}>
            <CtaScene props={props.cta} />
          </AbsoluteFill>
        ) : null}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};

export { TOTAL_FRAMES };
