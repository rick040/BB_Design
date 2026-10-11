import { springTiming, TransitionSeries } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type CountdownProps, countdownFrames } from "./schema";
import { CountdownScene } from "./scenes/CountdownScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { PaidScene } from "./scenes/PaidScene";

// Concept 2 · "7 · 2 · Betaald."
export const CountdownAd: React.FC<CountdownProps> = (props) => {
  const { width, height } = useVideoConfig();
  const f = countdownFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // A clock hand sweeping round fits a countdown.
  const clock = clockWipe({ width, height });
  const paidDue = props.hook.dueLabel.replace("{n}", props.countdown.secondNumber);

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={clock} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.countdown} name="2 · Aftellen">
            <CountdownScene props={props.countdown} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.paid} name="3 · Betaald">
            <PaidScene props={props.paid} bill={props.bill} dueLabel={paidDue} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={clock} timing={timing} />

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
