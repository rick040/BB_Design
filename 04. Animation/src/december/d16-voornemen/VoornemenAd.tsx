import { springTiming, TransitionSeries } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../../components/SafeZones";
import { PaletteProvider } from "../../lib/palette";
import "../theme";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { SendScene } from "./scenes/SendScene";
import { ThirtyScene } from "./scenes/ThirtyScene";
import { type VoornemenProps, voornemenFrames } from "./schema";

// Idee 16 · "Een voornemen in 30 seconden"
// Overgangen: bladzijde omslaan (flip) van de lijst naar de actie, een klok voor de 30 seconden,
// en een schuif van boven naar de afsluiter.
export const VoornemenAd: React.FC<VoornemenProps> = (props) => {
  const f = voornemenFrames(props.timing);
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
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} goals={props.goals} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={flip({ direction: "from-bottom" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.send} name="2 · Eén mail doorsturen">
            <SendScene props={props.send} goals={props.goals} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={clockWipe({ width, height })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.thirty} name="3 · 30 seconden">
            <ThirtyScene props={props.thirty} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={slide({ direction: "from-top" })} timing={timing} />

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
