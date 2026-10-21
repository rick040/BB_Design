import { springTiming, TransitionSeries } from "@remotion/transitions";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../../components/SafeZones";
import { PaletteProvider } from "../../lib/palette";
import "../theme";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { LinkScene } from "./scenes/LinkScene";
import { type VriendProps, vriendFrames } from "./schema";

// Idee 12 · "Vriend mee de feestdagen door" (Reel + Feed, referral)
export const VriendAd: React.FC<VriendProps> = (props) => {
  const f = vriendFrames(props.timing);
  const { width, height } = useVideoConfig();
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Onder de enveloppen">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.link} name="2 · De link">
            <LinkScene props={props.link} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="3 · De berg wordt een agenda">
            <ForwardScene props={props.forward} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={iris({ width, height })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · Proost">
            <CtaScene props={props.cta} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
