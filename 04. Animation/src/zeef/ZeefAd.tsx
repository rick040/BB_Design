import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { holesWipe } from "../lib/holesWipe";
import { PaletteProvider } from "../lib/palette";
import { tipOver } from "../lib/tipOver";
import "../theme";
import { type ZeefProps, zeefFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { SiftScene } from "./scenes/SiftScene";

// Concept 55 · "Geheugen lekt? Buddy niet." (zeef)
export const ZeefAd: React.FC<ZeefProps> = (props) => {
  const f = zeefFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // The next scene shows through growing sieve holes; the sieve scene is
  // emptied by tipping it over.
  const holes = holesWipe({ cell: 120 });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={holes} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.sift} name="2 · Buddy zeeft">
            <SiftScene props={props.sift} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={tipOver({ angle: 70 })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · In je agenda">
            <AgendaScene props={props.agenda} bill={props.bill} keepDue={props.sift.keepDue} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={holes} timing={timing} />

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
