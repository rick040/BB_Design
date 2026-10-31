import { springTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Audio, Freeze, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../lib/anim";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { StepRail } from "./components/ui";
import { useHeroLayout } from "./layout";
import { type HeroVslProps, heroVslFrames, heroVslStarts, heroVslTotal } from "./schema";
import { EndScene } from "./scenes/EndScene";
import { PitchScene } from "./scenes/PitchScene";
import { ReadScene } from "./scenes/ReadScene";
import { RemindScene } from "./scenes/RemindScene";
import { SendScene } from "./scenes/SendScene";

// The step indicator stays put while the step scenes slide underneath it.
const Rail: React.FC<{ props: HeroVslProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const L = useHeroLayout();
  const f = heroVslFrames(props.timing);
  const s = heroVslStarts(props.timing);
  const tr = f.transition;
  const opacity =
    interpolate(frame, [s.send + tr * 0.6, s.send + tr + 4], [0, 1], clamp) *
    interpolate(frame, [s.end, s.end + tr * 0.6], [1, 0], clamp);
  if (opacity <= 0) return null;
  const active =
    interpolate(frame, [s.read, s.read + tr], [0, 1], clamp) +
    interpolate(frame, [s.remind, s.remind + tr], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity, alignItems: "center", paddingTop: L.wide ? 56 : 50 }}>
      <StepRail steps={props.steps} active={active} scale={L.wide ? 1.1 : 0.98} />
    </AbsoluteFill>
  );
};

export const HeroVsl: React.FC<HeroVslProps> = (props) => {
  const f = heroVslFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // Steps slide in from the right like a carousel: 1 → 2 → 3.
  const next = slide({ direction: "from-right" });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light, overflow: "hidden" }}>
        <LoopOut props={props}>
          <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={f.pitch} name="1 · Pitch (5 s)">
              <PitchScene props={props.pitch} bill={props.bill} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={next} timing={timing} />

            <TransitionSeries.Sequence durationInFrames={f.send} name="2 · Stuur door">
              <SendScene props={props.send} bill={props.bill} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={next} timing={timing} />

            <TransitionSeries.Sequence durationInFrames={f.read} name="3 · Buddy onthoudt">
              <ReadScene props={props.read} bill={props.bill} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={next} timing={timing} />

            <TransitionSeries.Sequence durationInFrames={f.remind} name="4 · Seintje op tijd">
              <RemindScene props={props.remind} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={next} timing={timing} />

            <TransitionSeries.Sequence durationInFrames={f.end} name="5 · Belofte + CTA">
              <EndScene props={props.end} />
            </TransitionSeries.Sequence>
          </TransitionSeries>

          <Rail props={props} />
        </LoopOut>

        {/* Seamless loop: frame 0 of the pitch slides in, like the other steps. */}
        <LoopIn props={props} />

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} loop /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};

// 0 → 1 over the last `loopIn` frames, with the same spring as the slides.
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
        <PitchScene props={props.pitch} bill={props.bill} />
      </Freeze>
    </AbsoluteFill>
  );
};
