import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { photoFinish } from "../lib/photoFinish";
import { tapeSnap } from "../lib/tapeSnap";
import { brand } from "../theme";
import "../theme";
import { type EstafetteProps, estafetteFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { ScoreScene } from "./scenes/ScoreScene";
import { WisselScene } from "./scenes/WisselScene";

// Concept 27 · "Buddy loopt mee. Jij finisht." (estafette)
export const EstafetteAd: React.FC<EstafetteProps> = (props) => {
  const f = estafetteFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // A finish-camera scan line between the race scenes, and a finish tape
  // that snaps open into the CTA.
  const finish = (stamp: string) =>
    photoFinish({
      lineColor: brand.yellow,
      streakColor: props.colors.softBlue,
      stampBg: brand.yellow,
      stampColor: props.colors.blue,
      stamp,
    });

  // The stamp shows the real time at which the scan line starts.
  const stampAt = (frames: number) => {
    const sec = frames / 30;
    return `00:${String(Math.floor(sec)).padStart(2, "0")},${String(Math.round((sec % 1) * 100)).padStart(2, "0")}`;
  };
  const t1 = f.hook - f.transition;
  const t2 = t1 + f.wissel - f.transition;

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={finish(stampAt(t1))} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.wissel} name="2 · Wissel">
            <WisselScene props={props.wissel} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={finish(stampAt(t2))} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.score} name="3 · Scorebord">
            <ScoreScene props={props.score} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={tapeSnap({ tapeColor: brand.yellow, y: 0.5 })} timing={timing} />

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
