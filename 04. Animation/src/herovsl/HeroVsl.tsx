import { springTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Audio, Freeze, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type HeroVslProps, heroVslFrames, heroVslTotal } from "./schema";
import { EndScene } from "./scenes/EndScene";
import { StepsScene } from "./scenes/StepsScene";

// Hero VSL: steps 1–3 as one calm shot, a slide to the promise + button,
// and a slide back into frame 0 so the loop has no seam.
export const HeroVsl: React.FC<HeroVslProps> = (props) => {
  const f = heroVslFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light, overflow: "hidden" }}>
        <LoopOut props={props}>
          <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={f.steps} name="1–3 · Stappen">
              <StepsScene props={props} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
            <TransitionSeries.Sequence durationInFrames={f.end} name="4 · Belofte + knop">
              <EndScene props={props.end} />
            </TransitionSeries.Sequence>
          </TransitionSeries>
        </LoopOut>

        <LoopIn props={props} />

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} loop /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};

// 0 → 1 over the last `loopIn` frames, with the same spring as the slide.
const useLoopProgress = (props: HeroVslProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = heroVslFrames(props.timing);
  const total = heroVslTotal(props.timing);
  if (f.loopIn <= 0) return 0;
  return spring({
    frame: frame - (total - f.loopIn),
    fps,
    config: { damping: 200 },
    durationInFrames: f.loopIn,
    durationRestThreshold: 0.001,
  });
};

const LoopOut: React.FC<{ props: HeroVslProps; children: React.ReactNode }> = ({ props, children }) => {
  const t = useLoopProgress(props);
  return <AbsoluteFill style={{ transform: t > 0 ? `translateX(${-t * 100}%)` : undefined }}>{children}</AbsoluteFill>;
};

const LoopIn: React.FC<{ props: HeroVslProps }> = ({ props }) => {
  const t = useLoopProgress(props);
  if (t <= 0) return null;
  return (
    <AbsoluteFill style={{ transform: `translateX(${(1 - t) * 100}%)` }}>
      <Freeze frame={0}>
        <StepsScene props={props} />
      </Freeze>
    </AbsoluteFill>
  );
};
