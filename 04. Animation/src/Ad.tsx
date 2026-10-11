import { springTiming, TransitionSeries } from "@remotion/transitions";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "./components/SafeZones";
import { PaletteProvider } from "./lib/palette";
import { BuddyScene } from "./scenes/BuddyScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { RemindScene } from "./scenes/RemindScene";
import { type AdProps, sceneFrames } from "./schema";
import "./theme";

export const Ad: React.FC<AdProps> = (props) => {
  const { width, height } = useVideoConfig();
  const f = sceneFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  const circle = iris({ width, height });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={circle} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.buddy} name="2 · Buddy">
            <BuddyScene props={props.buddy} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="3 · Doorsturen">
            <ForwardScene props={props.forward} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.remind} name="4 · Herinneren">
            <RemindScene props={props.remind} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={circle} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="5 · CTA">
            <CtaScene props={props.cta} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
