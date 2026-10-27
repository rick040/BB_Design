import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { plaqueFlip } from "../lib/plaqueFlip";
import { spotlightSweep } from "../lib/spotlightSweep";
import "../theme";
import { type MuseumProps, museumFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { ExhibitScene } from "./scenes/ExhibitScene";
import { HookScene } from "./scenes/HookScene";

// Concept 25 · "Vergeten? Dat is geschiedenis." (museum van vergeten rekeningen)
export const MuseumAd: React.FC<MuseumProps> = (props) => {
  const f = museumFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook: het museum">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={spotlightSweep({ lampX: 0.5 })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.exhibit} name="2 · Van de muur">
            <ExhibitScene props={props.exhibit} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={plaqueFlip()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · In je agenda">
            <AgendaScene props={props.agenda} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={spotlightSweep({ lampX: 0.75 })} timing={timing} />

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
