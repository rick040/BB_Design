import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { clothWipe } from "../lib/clothWipe";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { type ZakdoekProps, zakdoekFrames } from "./schema";

// Concept 50 · "Knoop eruit. Datum erin." (knoop in je zakdoek)
export const ZakdoekAd: React.FC<ZakdoekProps> = (props) => {
  const f = zakdoekFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Knoop, maar waarvoor?">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={clothWipe({ direction: "up" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="2 · Doorsturen, label eraan">
            <ForwardScene props={props.forward} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={clothWipe({ direction: "right", amp: 60, waves: 2 })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · In je agenda">
            <AgendaScene props={props.agenda} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={clothWipe({ direction: "down" })} timing={timing} />

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
