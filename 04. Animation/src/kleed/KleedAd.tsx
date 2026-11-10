import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { broomSweep } from "../lib/broomSweep";
import { PaletteProvider } from "../lib/palette";
import { unroll } from "../lib/unroll";
import "../theme";
import { type KleedProps, kleedFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { LiftScene } from "./scenes/LiftScene";

// Concept 56 · "Niks onder het kleed." (wegstoppen)
export const KleedAd: React.FC<KleedProps> = (props) => {
  const f = kleedFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Onder het kleed">
            <HookScene props={props.hook} bill={props.bill} />
          </TransitionSeries.Sequence>
          {/* one broom stroke sweeps the blue scene in */}
          <TransitionSeries.Transition
            presentation={broomSweep({ direction: "from-right", bristle: props.colors.softBlue })}
            timing={timing}
          />

          <TransitionSeries.Sequence durationInFrames={f.lift} name="2 · Buddy rolt het kleed op">
            <LiftScene props={props.lift} bill={props.bill} />
          </TransitionSeries.Sequence>
          {/* the light scene unrolls like a rug */}
          <TransitionSeries.Transition
            presentation={unroll({ roll: props.colors.light, stripe: props.colors.softBlue })}
            timing={timing}
          />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · In je agenda">
            <AgendaScene props={props.agenda} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={broomSweep({ direction: "from-left", bristle: props.colors.softBlue })}
            timing={timing}
          />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.withVoice
          ? props.voiceCues.map((c, i) => (
              <Sequence key={i} from={c.from} name={`VO ${String(i + 1).padStart(2, "0")}`} layout="none">
                <Audio src={staticFile(c.src)} volume={props.voiceVolume} />
              </Sequence>
            ))
          : null}
        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
