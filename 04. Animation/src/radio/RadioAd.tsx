import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { needleSweep } from "../lib/needleSweep";
import { PaletteProvider } from "../lib/palette";
import { signalRings } from "../lib/signalRings";
import "../theme";
import { radioFrames, type RadioProps } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { TuneScene } from "./scenes/TuneScene";

// Concept 60 · "Ruis eruit. Datum erin." (radio)
// Built on the voice-over: each transition is centred on the frame where
// the voice starts that scene (public/vo/radio/timing.json).
export const RadioAd: React.FC<RadioProps> = (props) => {
  const f = radioFrames(props.cues);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Ruis">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={needleSweep({ direction: "from-left", color: props.colors.alert })}
            timing={timing}
          />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="2 · Doorsturen">
            <ForwardScene props={props.forward} bill={props.bill} start={f.start.forward} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={signalRings({ x: 45, y: 62, period: 110 })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.tune} name="3 · Afstemmen">
            <TuneScene props={props.tune} stations={props.hook.stations} bill={props.bill} start={f.start.tune} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={needleSweep({ direction: "from-right", color: props.colors.softBlue })}
            timing={timing}
          />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} start={f.start.cta} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* One continuous voice-over take from frame 0. */}
        {props.withVoice && props.voice ? (
          <Audio src={staticFile(props.voice)} volume={props.voiceVolume} name="Voice-over" />
        ) : null}
        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
