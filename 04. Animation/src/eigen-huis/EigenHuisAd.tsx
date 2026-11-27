import { springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { doors } from "../lib/doors";
import { AdSafeZoneProvider } from "../lib/layout";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type EigenHuisProps, eigenHuisFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { FanScene } from "./scenes/FanScene";
import { GatherScene } from "./scenes/GatherScene";
import { SignScene } from "./scenes/SignScene";

// Campagne 2612 · K3 "Eén huurcontract, zeven rekeningen"
export const EigenHuisAd: React.FC<EigenHuisProps> = (props) => {
  const f = eigenHuisFrames(props.timing);
  const { width } = useVideoConfig();
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
            <TransitionSeries.Sequence durationInFrames={f.sign} name="1 · Tekenen">
              <SignScene props={props.sign} />
            </TransitionSeries.Sequence>
            {/* The signed contract splits open like two doors */}
            <TransitionSeries.Transition presentation={doors({ width })} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.fan} name="2 · Zeven rekeningen">
              <FanScene props={props.fan} bills={props.bills} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={flip({ direction: "from-right" })} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.gather} name="3 · Doorsturen">
              <GatherScene props={props.gather} bills={props.bills} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={fade()} timing={timing} />
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
