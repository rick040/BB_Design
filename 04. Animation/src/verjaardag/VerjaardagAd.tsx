import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { confettiWipe } from "../lib/confettiWipe";
import { doorSwing } from "../lib/doorSwing";
import { PaletteProvider } from "../lib/palette";
import { brand } from "../theme";
import "../theme";
import { type VerjaardagProps, verjaardagFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { InsightScene } from "./scenes/InsightScene";

// Concept 42 · "Tante Ria op tijd. Je rekening ook." (verjaardagskalender)
export const VerjaardagAd: React.FC<VerjaardagProps> = (props) => {
  const f = verjaardagFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // The hook swings open like the toilet door; after that every step is a
  // little party: confetti wipes.
  const door = doorSwing();
  const confetti = confettiWipe({
    colors: [brand.yellow, props.colors.alert, brand.teal, props.colors.softBlue, brand.white],
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} calendar={props.calendar} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={door} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.insight} name="2 · Hangt op de wc">
            <InsightScene props={props.insight} calendar={props.calendar} toot={props.toot} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={confetti} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · In je agenda">
            <AgendaScene props={props.agenda} bill={props.bill} toot={props.toot} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={confetti} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} toot={props.toot} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
