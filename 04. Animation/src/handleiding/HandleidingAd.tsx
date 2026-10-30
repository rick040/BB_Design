import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { assemble, unfold } from "../lib/manualTransitions";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type HandleidingProps, handleidingFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { PartsScene } from "./scenes/PartsScene";
import { StepsScene } from "./scenes/StepsScene";

// Concept 30 · "Vaste lasten. Geen handleiding." (montagehandleiding)
export const HandleidingAd: React.FC<HandleidingProps> = (props) => {
  const f = handleidingFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // The flat-pack quarters ease themselves; a spring on top would make them
  // arrive in the first few frames.
  const linear = linearTiming({ durationInFrames: f.transition });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={unfold()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.parts} name="2 · Onderdeel">
            <PartsScene props={props.parts} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={assemble()} timing={linear} />

          <TransitionSeries.Sequence durationInFrames={f.steps} name="3 · Stappen">
            <StepsScene props={props.steps} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={unfold()} timing={timing} />

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
