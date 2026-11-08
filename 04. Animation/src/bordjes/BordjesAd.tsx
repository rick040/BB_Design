import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { plateSpin } from "../lib/plateSpin";
import { tipOver } from "../lib/tipOver";
import "../theme";
import { type BordjesProps, bordjesFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { RemindScene } from "./scenes/RemindScene";

// Concept 51 · "Alles draait. Niks valt." (bordjes draaien)
export const BordjesAd: React.FC<BordjesProps> = (props) => {
  const f = bordjesFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  const label = props.plates[props.fallingIndex];

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} plates={props.plates} fallingIndex={props.fallingIndex} />
          </TransitionSeries.Sequence>
          {/* the scene topples over like the plate that just fell */}
          <TransitionSeries.Transition presentation={tipOver({ pivot: "right" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="2 · Doorsturen">
            <ForwardScene props={props.forward} bill={props.bill} label={label} />
          </TransitionSeries.Sequence>
          {/* spins away edge-on, like a plate turning on its rim */}
          <TransitionSeries.Transition presentation={plateSpin()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.remind} name="3 · Op tijd een seintje">
            <RemindScene props={props.remind} plates={props.plates} fallingIndex={props.fallingIndex} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={tipOver({ pivot: "left" })} timing={timing} />

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
