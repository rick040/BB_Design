import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { blinds } from "../lib/blinds";
import { AdSafeZoneProvider } from "../lib/layout";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type AchterafProps, achterafFrames } from "./schema";
import { CalendarScene } from "./scenes/CalendarScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";

// Campagne 2612 · K1 "Eén dag gekocht, negen dagen betalen"
export const AchterafAd: React.FC<AchterafProps> = (props) => {
  const f = achterafFrames(props.timing);
  const { width, height } = useVideoConfig();
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AdSafeZoneProvider enabled={props.adSafeZone}>
        <AbsoluteFill style={{ background: props.colors.blue }}>
          <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={f.calendar} name="1+2 · Gekocht, verspreid">
              <CalendarScene props={props.calendar} spreadAt={f.spreadAt} />
            </TransitionSeries.Sequence>
            {/* Calendar rows: the blue scene opens in horizontal strips */}
            <TransitionSeries.Transition presentation={blinds({ count: 9, axis: "rows", size: height })} timing={timing} />

            <TransitionSeries.Sequence durationInFrames={f.forward} name="3 · Doorsturen">
              <ForwardScene props={props.forward} calendar={props.calendar} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={blinds({ count: 7, axis: "columns", size: width })} timing={timing} />

            <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
              <CtaScene props={props.cta} />
            </TransitionSeries.Sequence>
          </TransitionSeries>

          {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
          {props.showSafeZones ? <SafeZones /> : null}
        </AbsoluteFill>
      </AdSafeZoneProvider>
    </PaletteProvider>
  );
};
