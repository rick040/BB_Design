import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { cubeTurn } from "../lib/cubeTurn";
import { PaletteProvider } from "../lib/palette";
import { pipWipe } from "../lib/pipWipe";
import "../theme";
import { type BordspelProps, bordspelFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";

// Concept 53 · "Geen dobbelsteen. Een datum." (bordspel)
export const BordspelAd: React.FC<BordspelProps> = (props) => {
  const f = bordspelFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // Die-themed transitions: the five pips of a die open up the next scene,
  // and the scene turns over like a die rolling one face.
  const pips = pipWipe();
  const cube = cubeTurn();

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Op goed geluk">
            <HookScene props={props.hook} board={props.board} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={pips} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="2 · Doorsturen">
            <ForwardScene props={props.forward} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={cube} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · Buddy is de pion">
            <AgendaScene props={props.agenda} board={props.board} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={pips} timing={timing} />

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
