import { springTiming, TransitionSeries } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { SafeZones } from "../../components/SafeZones";
import { PaletteProvider } from "../../lib/palette";
import "../theme";
import { IMPACT_BEFORE_CUT } from "./flight";
import { type AgendaProps, agendaFrames } from "./schema";
import { CatchScene } from "./scenes/CatchScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";

// Idee 7 · "De volle decemberagenda"
export const AgendaAd: React.FC<AgendaProps> = (props) => {
  const f = agendaFrames(props.timing);
  const { width, height } = useVideoConfig();
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Je agenda in december">
            <HookScene props={props.hook} week={props.week} impact={f.hook - f.transition - IMPACT_BEFORE_CUT} />
          </TransitionSeries.Sequence>
          {/* Het blokje vliegt door, de klok veegt de agenda blauw */}
          <TransitionSeries.Transition presentation={clockWipe({ width, height })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.catch} name="2 · Buddy vangt het op">
            <CatchScene props={props.catch} week={props.week} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="3 · CTA">
            <CtaScene props={props.cta} week={props.week} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
