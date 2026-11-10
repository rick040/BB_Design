import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { crtSqueeze } from "../lib/crtSqueeze";
import { PaletteProvider } from "../lib/palette";
import { staticWipe } from "../lib/staticWipe";
import "../theme";
import { type RuisProps, ruisFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { TuneScene } from "./scenes/TuneScene";

// Concept 59 · "Geen ruis. Gewoon op tijd." (radio afstemmen)
// Built on the voice: scene starts come from public/vo/ruis/timing.json.
export const RuisAd: React.FC<RuisProps> = (props) => {
  const f = ruisFrames(props.voice, props.timing);
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
          <TransitionSeries.Transition presentation={staticWipe({ direction: "down" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.tune} name="2 · Afstemmen">
            <TuneScene props={props.tune} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={crtSqueeze({ lineColor: "#ffffff" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · Agenda">
            <AgendaScene props={props.agenda} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={staticWipe({ direction: "up" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* One single take from frame 0 ([S1] starts at 0). */}
        {props.voice.withVoice && props.voice.src ? (
          <Sequence from={0} name="Voice-over">
            <Audio src={staticFile(props.voice.src)} volume={props.voice.volume} />
          </Sequence>
        ) : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
