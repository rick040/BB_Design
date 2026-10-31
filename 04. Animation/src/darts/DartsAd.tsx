import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { ringWipe } from "../lib/ringWipe";
import { whipPan } from "../lib/whipPan";
import "../theme";
import { type DartsProps, dartsFrames } from "./schema";
import { AimScene } from "./scenes/AimScene";
import { CtaScene } from "./scenes/CtaScene";
import { HitsScene } from "./scenes/HitsScene";
import { HookScene } from "./scenes/HookScene";

// Concept 35 · "Niet ongeveer. Precies." (dartbord)
export const DartsAd: React.FC<DartsProps> = (props) => {
  const f = dartsFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // Ring wipe = a target filling in; whip pan = the camera follows a throw.
  const rings = ringWipe({ period: 150 });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Ongeveer is te laat">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={rings} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.aim} name="2 · Buddy mikt">
            <AimScene props={props.aim} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={whipPan({ blur: 12, direction: "left" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.hits} name="3 · Drie keer raak">
            <HitsScene props={props.hits} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={rings} timing={timing} />

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
