import { springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { crtSwitch } from "../lib/crtSwitch";
import { PaletteProvider } from "../lib/palette";
import { starburst } from "../lib/starburst";
import "../theme";
import { type TelshopProps, telshopFrames } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { DemoScene } from "./scenes/DemoScene";
import { HookScene } from "./scenes/HookScene";
import { MoreScene } from "./scenes/MoreScene";

// Concept 28 · "Niet bellen. Gewoon doorsturen." (telshop-parodie)
export const TelshopAd: React.FC<TelshopProps> = (props) => {
  const f = telshopFrames(props.timing);
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: f.transition,
    durationRestThreshold: 0.001,
  });
  // The colour scenes burst open like a TV-shop price sticker; "Maar wacht,
  // er is meer!" arrives with an old-TV channel switch.
  const burst = starburst();
  const crt = crtSwitch();

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={f.hook} name="1 · Ken je dit?">
            <HookScene props={props.hook} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={burst} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.demo} name="2 · Demonstratie">
            <DemoScene props={props.demo} bill={props.bill} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={crt} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={f.more} name="3 · Maar wacht">
            <MoreScene props={props.more} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={burst} timing={timing} />

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
