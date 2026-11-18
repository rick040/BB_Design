import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { clamp } from "../lib/anim";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { CtaScene } from "./scenes/CtaScene";
import { WithoutPanel } from "./scenes/WithoutPanel";
import { WithPanel } from "./scenes/WithPanel";
import { SCENE_STARTS, SPLIT_Y, VO_FILE, type ZakdoekProps } from "./schema";

// Concept 98 · "Geen knopen meer." (zakdoek)
// Two screens on one canvas. Transition "split": the blue "Met Buddy" screen
// rises from below and parks under the "Zonder Buddy" screen. Transition
// "overname": at the CTA the blue screen pushes the top screen out.
export const ZakdoekAd: React.FC<ZakdoekProps> = (props) => {
  const frame = useCurrentFrame();
  const [, s2, , s4] = SCENE_STARTS;

  const rise = interpolate(frame, [s2 - 8, s2 + 6], [1920, SPLIT_Y], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const take = interpolate(frame, [s4 - 8, s4 + 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const panelTop = rise * (1 - take);
  const topShift = -take * 420;
  const withFade = interpolate(frame, [s4 - 8, s4 - 1], [1, 0], clamp);
  const lip = Math.max(0, 1 - Math.abs(frame - (s2 + 6)) / 10);

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light, overflow: "hidden" }}>
        {frame < s4 + 6 ? (
          <AbsoluteFill style={{ transform: `translateY(${topShift}px)` }}>
            <WithoutPanel hook={props.hook} split={props.split} />
          </AbsoluteFill>
        ) : null}
        {frame >= s2 - 8 ? (
          <AbsoluteFill style={{ clipPath: `inset(${panelTop}px 0 0 0)`, background: props.colors.blue }}>
            {withFade > 0 ? (
              <AbsoluteFill style={{ opacity: withFade }}>
                <WithPanel split={props.split} bill={props.bill} />
              </AbsoluteFill>
            ) : null}
            {frame >= s4 - 8 ? <CtaScene props={props.cta} /> : null}
          </AbsoluteFill>
        ) : null}
        {frame >= s2 - 8 && take < 1 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: panelTop - 6 - lip * 8,
              height: 12 + lip * 8,
              background: props.colors.softBlue,
              opacity: 0.9,
            }}
          />
        ) : null}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
