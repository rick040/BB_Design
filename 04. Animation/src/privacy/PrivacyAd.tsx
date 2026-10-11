import { springTiming, TransitionSeries } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { focusPull } from "../lib/focusPull";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type PrivacyProps, privacyFrames } from "./schema";
import { BlindScene } from "./scenes/BlindScene";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { ReadScene } from "./scenes/ReadScene";

// Concept 3 · "Jij kiest wat Buddy ziet." (privacy)
export const PrivacyAd: React.FC<PrivacyProps> = (props) => {
  const f = privacyFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // Wipes sweep over the frame like a privacy screen; the focus pull fits
  // the "out of focus vs. sharp" idea of this concept.
  const focus = focusPull({ blur: 26 });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} mails={props.privateMails} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.blind} name="2 · Kijkt niet mee">
            <BlindScene props={props.blind} mails={props.privateMails} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={focus} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.read} name="3 · Alleen doorgestuurd">
            <ReadScene props={props.read} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={timing} />

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
