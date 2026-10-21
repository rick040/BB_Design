import { springTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../../components/SafeZones";
import { PaletteProvider } from "../../lib/palette";
import "../theme";
import { doorSwing } from "./doorSwing";
import { CtaScene } from "./scenes/CtaScene";
import { DoorsScene } from "./scenes/DoorsScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { type AdventProps, adventFrames } from "./schema";

// Idee 2 · "De adventskalender" (Reel + Feed, hero-ad)
export const AdventAd: React.FC<AdventProps> = (props) => {
  const f = adventFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Niet elk deurtje">
            <HookScene props={props.hook} bills={props.bills} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={doorSwing()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.doors} name="2 · Vlaggetjes">
            <DoorsScene props={props.doors} bills={props.bills} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="3 · Doorsturen">
            <ForwardScene props={props.forward} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={doorSwing({ degrees: 100 })} timing={timing} />

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
