import { springTiming, type TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type BaseProps, sec } from "./common";
import { EndCard } from "./EndCard";

export type SceneSpec = { name: string; frames: number; node: React.ReactNode };

/**
 * Wrapper every backlog template renders into: palette, the scene series with
 * one transition style per template, the shared end card, music, safe zones.
 */
export const BacklogFrame: React.FC<{
  base: BaseProps;
  scenes: SceneSpec[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  presentation: (i: number) => TransitionPresentation<any>;
}> = ({ base, scenes, presentation }) => {
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: sec(base.transition),
    durationRestThreshold: 0.001,
  });
  const all: SceneSpec[] = [
    ...scenes,
    { name: "Eindkaart", frames: sec(base.endCard.seconds), node: <EndCard props={base.endCard} /> },
  ];
  return (
    <PaletteProvider colors={base.colors}>
      <AbsoluteFill style={{ background: base.colors.blue }}>
        <TransitionSeries>
          {all.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 ? (
                <TransitionSeries.Transition presentation={presentation(i)} timing={timing} />
              ) : null}
              <TransitionSeries.Sequence durationInFrames={s.frames} name={`${i + 1} · ${s.name}`}>
                {s.node}
              </TransitionSeries.Sequence>
            </React.Fragment>
          ))}
        </TransitionSeries>
        {base.music ? <Audio src={staticFile(base.music)} volume={base.musicVolume} /> : null}
        {base.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};

/** Frames of the end card, for duration maths. */
export const endFrames = (base: BaseProps) => sec(base.endCard.seconds);
