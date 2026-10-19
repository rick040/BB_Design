import { springTiming, TransitionSeries } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { iris } from "@remotion/transitions/iris";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../../components/SafeZones";
import { PaletteProvider } from "../../lib/palette";
import "../theme";
import { CountScene } from "./scenes/CountScene";
import { CtaScene } from "./scenes/CtaScene";
import { JanuaryScene } from "./scenes/JanuaryScene";
import { type AftellenProps, aftellenFrames } from "./schema";

// Idee 15 · "Aftellen naar 2027" (Reel + Feed)
export const AftellenAd: React.FC<AftellenProps> = (props) => {
  const f = aftellenFrames(props.timing);
  const { width, height } = useVideoConfig();
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.count} name="1 · Aftellen 10 tot 0">
            <CountScene props={props.count} />
          </TransitionSeries.Sequence>
          {/* De nul gaat open: een cirkel groeit uit het midden, de rustige agenda eronder. */}
          <TransitionSeries.Transition presentation={iris({ width, height })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.january} name="2 · Rustige januari">
            <JanuaryScene props={props.january} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={clockWipe({ width, height })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="3 · Dit jaar knalt alleen het vuurwerk">
            <CtaScene props={props.cta} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
