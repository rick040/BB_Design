import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { crackShatter } from "../lib/crackShatter";
import { PaletteProvider } from "../lib/palette";
import { skateCarve } from "../lib/skateCarve";
import "../theme";
import { type IjsProps, ijsFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { CUES } from "./vo";

// Concept 61 · "Van dun ijs naar vaste grond."
// Scene starts follow the voice-over cues (public/vo/ijs/timing.json);
// each transition is centred on the first word of the next scene.
export const IjsAd: React.FC<IjsProps> = (props) => {
  const { width, height } = useVideoConfig();
  const f = ijsFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.lens[0]} name="1 · Dun ijs">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={crackShatter({ width, height, cy: 0.6 })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.lens[1]} name="2 · Doorsturen">
            <ForwardScene props={props.forward} bill={props.bill} start={f.starts[1]} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={skateCarve({ width, height, edgeColor: "#ffffff" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.lens[2]} name="3 · Agenda">
            <AgendaScene props={props.agenda} bill={props.bill} start={f.starts[2]} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={skateCarve({ width, height, fromRight: true, edgeColor: props.colors.softBlue })}
            timing={timing}
          />

          <TransitionSeries.Sequence durationInFrames={f.lens[3]} name="4 · CTA">
            <CtaScene props={props.cta} start={f.starts[3]} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* One take, from the [S1] cue. Toggle with withVoice. */}
        {props.withVoice && props.voiceSrc ? (
          <Sequence from={CUES[0]} name="Voice-over">
            <Audio src={staticFile(props.voiceSrc)} volume={props.voiceVolume} />
          </Sequence>
        ) : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
