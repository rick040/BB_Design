import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { flurryWipe } from "../lib/flurryWipe";
import { globeShake } from "../lib/globeShake";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type SneeuwbolProps, sneeuwbolFrames } from "./schema";
import { CatchScene } from "./scenes/CatchScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";

// Concept 62 · "Laat de rest maar dwarrelen." (sneeuwbol)
// The animation follows the voice-over: scene lengths come from the
// spoken cues, and the whole take plays as one <Audio> from frame 0.
export const SneeuwbolAd: React.FC<SneeuwbolProps> = (props) => {
  const f = sneeuwbolFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook (sneeuwbol)">
            <HookScene props={props.hook} bill={props.bill} start={f.starts[0]} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={globeShake()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="2 · Doorsturen">
            <ForwardScene props={props.forward} bill={props.bill} start={f.starts[1]} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={flurryWipe()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.catch} name="3 · Vangen en agenda">
            <CatchScene props={props.catch} bill={props.bill} start={f.starts[2]} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={globeShake({ amp: 30 })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} start={f.starts[3]} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.withVoice && props.voiceFile ? (
          <Audio src={staticFile(props.voiceFile)} volume={props.voiceVolume} />
        ) : null}
        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
