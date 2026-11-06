import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { pageTurn } from "../lib/pageTurn";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type BladwijzerProps, bladwijzerFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { FlipScene } from "./scenes/FlipScene";
import { HookScene } from "./scenes/HookScene";
import { MarkScene } from "./scenes/MarkScene";

// Concept 48 · "Blader gerust. Buddy houdt de plek." (bladwijzer)
export const BladwijzerAd: React.FC<BladwijzerProps> = (props) => {
  const f = bladwijzerFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // Every scene change is a page that turns over: the whole ad is a book.
  const turn = pageTurn();

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={turn} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.mark} name="2 · Bladwijzer">
            <MarkScene props={props.mark} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={turn} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.flip} name="3 · Doorbladeren">
            <FlipScene props={props.flip} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={turn} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} bookTitle={props.mark.bookTitle} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
