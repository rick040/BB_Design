import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { AdSafeZoneProvider } from "../lib/layout";
import { PaletteProvider } from "../lib/palette";
import { rollCut } from "../lib/rollCut";
import "../theme";
import { type TwaalfProps, twaalfFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { GrowScene } from "./scenes/GrowScene";
import { HookScene } from "./scenes/HookScene";
import { LetterScene } from "./scenes/LetterScene";
import { RewindScene } from "./scenes/RewindScene";

// Campagne 2612 · K2 "Twaalf wordt tweeënvijftig"
export const TwaalfAd: React.FC<TwaalfProps> = (props) => {
  const f = twaalfFrames(props.timing);
  const { height } = useVideoConfig();
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // The whole Reel rolls like the number: forward (up) while the bill grows,
  // backwards (down) when Buddy rewinds it.
  const up = rollCut({ direction: "up", size: height, blur: 10 });
  const down = rollCut({ direction: "down", size: height, blur: 10 });

  return (
    <PaletteProvider colors={props.colors}>
      <AdSafeZoneProvider enabled={props.adSafeZone}>
        <AbsoluteFill style={{ background: props.colors.blue }}>
          <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Vergeten">
              <HookScene props={props.hook} bill={props.bill} amounts={props.amounts} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={up} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.letter} name="2 · Aanmaning">
              <LetterScene props={props.letter} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={up} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.grow} name="3 · €12 wordt €52">
              <GrowScene props={props.grow} amounts={props.amounts} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={down} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.rewind} name="4 · Terugspoelen">
              <RewindScene props={props.rewind} bill={props.bill} amounts={props.amounts} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={up} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.cta} name="5 · CTA">
              <CtaScene props={props.cta} bill={props.bill} />
            </TransitionSeries.Sequence>
          </TransitionSeries>

          {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
          {props.showSafeZones ? <SafeZones /> : null}
        </AbsoluteFill>
      </AdSafeZoneProvider>
    </PaletteProvider>
  );
};
