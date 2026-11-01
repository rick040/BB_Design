import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { labelPrint } from "../lib/labelPrint";
import { PaletteProvider } from "../lib/palette";
import { stickerPeel } from "../lib/stickerPeel";
import "../theme";
import { brand } from "../theme";
import { type NaambordProps, naambordFrames } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { HookScene } from "./scenes/HookScene";

// Concept 37 · "Nu op jouw naam." (rotatie-idee N01)
export const NaambordAd: React.FC<NaambordProps> = (props) => {
  const f = naambordFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Nu op jouw naam">
            <HookScene props={props.hook} bills={props.bills} dueLabel={props.forward.dueLabel} />
          </TransitionSeries.Sequence>
          {/* The whole hook comes off like a sticker, bottom-right corner first. */}
          <TransitionSeries.Transition
            presentation={stickerPeel({ corner: "br", angle: 34, backing: "#f4f1e6" })}
            timing={timing}
          />

          <TransitionSeries.Sequence durationInFrames={f.forward} name="2 · Doorsturen">
            <ForwardScene props={props.forward} bills={props.bills} ownLabel={props.hook.ownLabel} />
          </TransitionSeries.Sequence>
          {/* A strip of yellow label tape prints across and opens up. */}
          <TransitionSeries.Transition presentation={labelPrint({ tape: brand.yellow })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.agenda} name="3 · In je agenda">
            <AgendaScene props={props.agenda} bills={props.bills} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={stickerPeel({ corner: "tl", angle: 30, backing: "#eef1f8" })}
            timing={timing}
          />

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
