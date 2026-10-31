import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { balloonPop } from "../lib/balloonPop";
import { floatAway } from "../lib/floatAway";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type BallonProps, ballonFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { TieScene } from "./scenes/TieScene";

// Concept 31 · "Jij laat los. Buddy houdt vast." (ballonnen)
export const BallonAd: React.FC<BallonProps> = (props) => {
  const f = ballonFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // Scenes pop like a balloon or float away on strings.
  const popToBlue = balloonPop({ burstColor: "#ffffff" });
  const lift = floatAway({ stringColor: props.colors.softBlue });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={popToBlue} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="2 · Doorsturen">
            <ForwardScene props={props.forward} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={lift} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.tie} name="3 · Vastknopen">
            <TieScene props={props.tie} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={popToBlue} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
