import { springTiming, TransitionSeries } from "@remotion/transitions";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../../components/SafeZones";
import { PaletteProvider } from "../../lib/palette";
import "../theme";
import { type PakketjesProps, pakketjesFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { SpreadScene } from "./scenes/SpreadScene";

// Idee 1 · "Eén dag gekocht, negen dagen betalen"
export const PakketjesAd: React.FC<PakketjesProps> = (props) => {
  const f = pakketjesFrames(props.timing);
  const { width, height } = useVideoConfig();
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Gekocht op één dag">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          {/* De stapel valt uiteen: het blauwe vlak opent vanuit de stapel */}
          <TransitionSeries.Transition presentation={iris({ width, height })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.spread} name="2 · Negen betaaldagen">
            <SpreadScene props={props.spread} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="3 · Doorsturen">
            <ForwardScene props={props.forward} cal={props.spread} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={timing} />

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
