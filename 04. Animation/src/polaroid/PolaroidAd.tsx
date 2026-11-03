import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { cameraFlash } from "../lib/cameraFlash";
import { PaletteProvider } from "../lib/palette";
import { polaroidZoom } from "../lib/polaroidZoom";
import "../theme";
import { type PolaroidProps, polaroidFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { SnapScene } from "./scenes/SnapScene";

// Concept 43 · "Scherp tot de vervaldatum." (polaroid)
export const PolaroidAd: React.FC<PolaroidProps> = (props) => {
  const f = polaroidFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // A camera flash between the "before" and "Buddy" scenes; the developed
  // photo itself zooms in to become the calendar scene.
  const flash = cameraFlash({ peak: 0.45 });
  // Linear, so the white peak lands mid-transition instead of in frame 2.
  const flashTiming = linearTiming({ durationInFrames: f.transition });
  const photo = polaroidZoom({ from: 0.36, tilt: 6, border: 70 });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={flash} timing={flashTiming} />

          <TransitionSeries.Sequence durationInFrames={f.snap} name="2 · Buddy legt vast">
            <SnapScene props={props.snap} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={photo} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · Scherp in je agenda">
            <AgendaScene props={props.agenda} bill={props.bill} caption={props.snap.caption} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={flash} timing={flashTiming} />

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
