import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { waveWipe } from "../lib/waveWipe";
import "../theme";
import { type VloedProps, vloedFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";

// Concept 57 · "Vloed komt. Jij staat droog." (getijden / strand)
export const VloedAd: React.FC<VloedProps> = (props) => {
  const f = vloedFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Spoelt niet weg">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={waveWipe({ direction: "up" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="2 · Doorsturen">
            <ForwardScene props={props.forward} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={waveWipe({ direction: "left", crests: 2 })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · Agenda">
            <AgendaScene props={props.agenda} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={waveWipe({ direction: "up" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.withVoice
          ? props.voiceCues.map((c, i) => (
              <Sequence key={i} from={c.from} name={`VO ${String(i + 1).padStart(2, "0")}`} layout="none">
                <Audio src={staticFile(c.file)} volume={props.voiceVolume} />
              </Sequence>
            ))
          : null}
        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
