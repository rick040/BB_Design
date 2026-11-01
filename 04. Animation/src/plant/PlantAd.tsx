import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { leafReveal } from "../lib/leafReveal";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type PlantProps, plantFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { StakeScene } from "./scenes/StakeScene";
import { WaterScene } from "./scenes/WaterScene";

// Concept 40 · "Buddy denkt eraan. Niks verdort." (kamerplanten)
export const PlantAd: React.FC<PlantProps> = (props) => {
  const f = plantFrames(props.timing);
  // Linear timing: the leaf reveal does its own easing (smoothstep).
  const timing = linearTiming({ durationInFrames: f.transition });
  const potLabel = props.hook.pots[1];

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={leafReveal({ angle: -35, vein: props.colors.softBlue })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.stake} name="2 · Datum erbij">
            <StakeScene props={props.stake} bill={props.bill} potLabel={potLabel} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={leafReveal({ angle: 30, vein: props.colors.softBlue })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.water} name="3 · Op tijd water">
            <WaterScene props={props.water} bill={props.bill} potLabel={potLabel} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={leafReveal({ angle: -55, vein: props.colors.softBlue })} timing={timing} />

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
