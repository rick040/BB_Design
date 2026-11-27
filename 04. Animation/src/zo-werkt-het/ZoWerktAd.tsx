import { springTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { AdSafeZoneProvider } from "../lib/layout";
import { PaletteProvider } from "../lib/palette";
import { sheetUp } from "../lib/sheetUp";
import "../theme";
import { type ZoWerktProps, zoWerktFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { NotifyScene } from "./scenes/NotifyScene";
import { PhoneScene } from "./scenes/PhoneScene";

// Campagne 2612 · W1 "Zo werkt het" (warm)
export const ZoWerktAd: React.FC<ZoWerktProps> = (props) => {
  const f = zoWerktFrames(props.timing);
  const { height } = useVideoConfig();
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  const sheet = sheetUp({ size: height });

  return (
    <PaletteProvider colors={props.colors}>
      <AdSafeZoneProvider enabled={props.adSafeZone}>
        <AbsoluteFill style={{ background: props.colors.blue }}>
          <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={f.phone} name="1+2 · Mail en doorsturen">
              <PhoneScene mail={props.mail} forward={props.forward} bill={props.bill} forwardAt={f.forwardAt} />
            </TransitionSeries.Sequence>
            {/* Like a sheet sliding up on a phone */}
            <TransitionSeries.Transition presentation={sheet} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · In je agenda">
              <AgendaScene props={props.agenda} bill={props.bill} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.notify} name="4 · Seintje">
              <NotifyScene props={props.notify} bill={props.bill} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={sheet} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.cta} name="5 · CTA">
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
