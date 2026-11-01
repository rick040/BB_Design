import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { navTilt } from "../lib/navTilt";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type RouteProps, routeFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { DriveScene } from "./scenes/DriveScene";
import { HookScene } from "./scenes/HookScene";
import { PlanScene } from "./scenes/PlanScene";

// Concept 39 · "Jij rijdt. Buddy navigeert." (navigatie)
export const RouteAd: React.FC<RouteProps> = (props) => {
  const f = routeFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // Every cut is a navigation-camera tilt: the old view tips away like a map
  // in 3D mode, the next one comes up from below.
  const tilt = navTilt({ tilt: 55 });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Afslag gemist">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={tilt} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.plan} name="2 · Buddy plant de route">
            <PlanScene props={props.plan} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={tilt} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.drive} name="3 · Onderweg">
            <DriveScene props={props.drive} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={tilt} timing={timing} />

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
