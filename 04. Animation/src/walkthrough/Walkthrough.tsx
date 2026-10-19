import { springTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { type WalkthroughProps, walkthroughFrames } from "./schema";
import { DoneScene } from "./scenes/DoneScene";
import { IntroScene } from "./scenes/IntroScene";
import { Step1Scene } from "./scenes/Step1Scene";
import { Step2Scene } from "./scenes/Step2Scene";
import { Step3Scene } from "./scenes/Step3Scene";
import { Step4Scene } from "./scenes/Step4Scene";
import { Step5Scene } from "./scenes/Step5Scene";
import { bb } from "./tokens";

// Walkthrough "Stel je Buddy in": intro, the 5 steps of /stel-je-buddy-in/, done.
export const Walkthrough: React.FC<WalkthroughProps> = (props) => {
  const f = walkthroughFrames(props.timing);
  const timing = springTiming({ config: { damping: 200 }, durationInFrames: f.transition, durationRestThreshold: 0.001 });
  // Blue intro/outro wipe in and out; the steps slide on like "next step".
  const next = slide({ direction: "from-right" });
  const ex = props.example;

  return (
    <AbsoluteFill style={{ background: bb.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={f.intro} name="Intro">
          <IntroScene props={props.intro} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={f.step1} name="Stap 1 · Startmail">
          <Step1Scene props={props.step1} example={ex} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={next} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={f.step2} name="Stap 2 · Gegevens plakken">
          <Step2Scene props={props.step2} example={ex} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={next} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={f.step3} name="Stap 3 · Doorsturen">
          <Step3Scene props={props.step3} example={ex} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={next} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={f.step4} name="Stap 4 · Agenda">
          <Step4Scene props={props.step4} example={ex} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={next} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={f.step5} name="Stap 5 · Test">
          <Step5Scene props={props.step5} example={ex} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={f.done} name="Klaar">
          <DoneScene props={props.done} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
      {props.voiceover ? <Audio src={staticFile(props.voiceover)} volume={props.voiceoverVolume} /> : null}
    </AbsoluteFill>
  );
};
