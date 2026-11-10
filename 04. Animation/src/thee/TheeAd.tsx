import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { steamRise } from "../lib/steamRise";
import { steepWipe } from "../lib/steepWipe";
import "../theme";
import { type TheeProps, theeFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";

// Concept 58 · "Thee laat je trekken. Rekeningen niet." (theezakje)
// The animation follows the voice: scene starts come from
// public/vo/thee/timing.json (see schema.ts). The voice-over is one take,
// placed once from frame 0 and switched with the prop `withVoice`.
export const TheeAd: React.FC<TheeProps> = (props) => {
  const f = theeFrames(props.timing);
  // Linear timing so the transition window is exactly `transition` frames
  // and the scene starts land where timing.json says.
  const timing = linearTiming({ durationInFrames: f.transition });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook: thee trekt">
            <HookScene props={props.hook} bill={props.bill} tea={props.tea} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={steepWipe({ x: 55, y: 55 })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="2 · Stuur door">
            <ForwardScene props={props.forward} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={steamRise()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · Op tijd eruit">
            <AgendaScene props={props.agenda} bill={props.bill} tea={props.tea} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={steepWipe({ x: 48, y: 40 })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} tea={props.tea} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.withVoice && props.voice ? <Audio src={staticFile(props.voice)} volume={props.voiceVolume} /> : null}
        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
