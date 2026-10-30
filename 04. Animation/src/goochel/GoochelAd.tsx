import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { curtain } from "../lib/curtain";
import { PaletteProvider } from "../lib/palette";
import { wandSwish } from "../lib/wandSwish";
import "../theme";
import { DRAPE } from "./components/Magic";
import { type GoochelProps, goochelFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HatScene } from "./scenes/HatScene";
import { HookScene } from "./scenes/HookScene";
import { PredictScene } from "./scenes/PredictScene";

// Concept 29 · "Geen truc. Gewoon op tijd." (goochelshow)
export const GoochelAd: React.FC<GoochelProps> = (props) => {
  const f = goochelFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // The stage curtain closes and opens between acts; the wand swish
  // sweeps the prediction in with a trail of sparkles.
  const drapes = curtain({ color: DRAPE.color, dark: DRAPE.dark });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Verdwijntruc">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={drapes} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.hat} name="2 · Uit de hoed">
            <HatScene props={props.hat} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={wandSwish()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.predict} name="3 · Voorspelling">
            <PredictScene props={props.predict} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={drapes} timing={timing} />

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
