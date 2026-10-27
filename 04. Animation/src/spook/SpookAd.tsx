import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { flicker } from "../lib/flicker";
import { lightSwitch } from "../lib/lightSwitch";
import { PaletteProvider } from "../lib/palette";
import { sheetDrop } from "../lib/sheetDrop";
import "../theme";
import { mix } from "./components/Spook";
import { type SpookProps, spookFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookScene } from "./scenes/HookScene";
import { LightScene } from "./scenes/LightScene";
import { PeekScene } from "./scenes/PeekScene";

// Concept 26 · "Eng was hij alleen in het donker." (de mail die je niet durft te openen)
export const SpookAd: React.FC<SpookProps> = (props) => {
  const f = spookFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // The flicker needs dark behind it: the "off" frames show this background.
  const dark = mix(props.colors.blue, "#000000", 0.92);

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: dark }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Hook">
            <HookScene props={props.hook} mail={props.mail} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={flicker()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.peek} name="2 · Buddy kijkt">
            <PeekScene props={props.peek} mail={props.mail} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={lightSwitch()} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.light} name="3 · Licht aan">
            <LightScene props={props.light} mail={props.mail} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={sheetDrop()} timing={timing} />

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
