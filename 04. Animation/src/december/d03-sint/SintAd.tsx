import { springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../../components/SafeZones";
import { PaletteProvider } from "../../lib/palette";
import "../theme";
import { hardCut } from "./hardCut";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";
import { InboxScene } from "./scenes/InboxScene";
import { type SintProps, sintFrames } from "./schema";

// Idee 3 · "Sint heeft zijn boek"
export const SintAd: React.FC<SintProps> = (props) => {
  const f = sintFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Het grote boek">
            <HookScene props={props.hook} book={props.book} />
          </TransitionSeries.Sequence>
          {/* Harde wissel van boek naar telefoon */}
          <TransitionSeries.Transition presentation={hardCut()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.inbox} name="2 · Volle inbox">
            <InboxScene props={props.inbox} />
          </TransitionSeries.Sequence>
          {/* Omslaan als een bladzijde */}
          <TransitionSeries.Transition presentation={flip({ direction: "from-right" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="3 · Eén mail door">
            <ForwardScene props={props.forward} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={fade()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.cta} name="4 · CTA">
            <CtaScene props={props.cta} book={props.book} coverTitle={props.hook.coverTitle} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
