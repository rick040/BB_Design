import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { clamp } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type KnikkerbaanProps, SCENE_STARTS } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { Headlines } from "./scenes/Headlines";
import { WORLD_FIT, World, WORLD_T } from "./scenes/World";

// Concept 73 · "Geen gok. Elke keer dezelfde baan." (knikkerbaan)
// One continuous shot, no cuts: a camera follows the bill down the run,
// pulls back to show the whole run while the second bill takes the same
// path, then tilts down into the blue floor where the CTA waits.
const [, S2, S3, S4] = SCENE_STARTS;

export const CAMERA_T = {
  follow: S2 + 6, //           start following bill 1 down
  settle: WORLD_T.tray1 + 2, // camera arrives at the tray
  pullBack: S3 - 8, //          zoom out over the whole run
  pulled: S3 + 12,
  tilt: S4 - 10, //              tilt down into the blue floor
  tilted: S4 + 6,
};

export const KnikkerbaanAd: React.FC<KnikkerbaanProps> = (props) => {
  const frame = useCurrentFrame();
  const L = useLayout();

  // Viewport between the headline and the bottom safe zone.
  const top = L.safeTop + L.headlineSize * 2.05;
  const bottom = L.height - L.safeBottom;
  const Vc = (top + bottom) / 2 + (L.tall ? 0 : 20);
  const Hv = bottom - top;
  const base = L.tall ? 1.12 : 0.9;
  const fit = Math.min(base, (Hv + 60) / (WORLD_FIT.bottom - WORLD_FIT.top));
  const fitCy = (WORLD_FIT.top + WORLD_FIT.bottom) / 2;

  const C = CAMERA_T;
  const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const cy0 = 560;
  const cyFollow = interpolate(
    frame,
    [C.follow, WORLD_T.gateA1, WORLD_T.gateB1, C.settle],
    [cy0, 760, 1170, 1540],
    ease,
  );
  let cy = frame < C.pullBack ? cyFollow : interpolate(frame, [C.pullBack, C.pulled], [1540, fitCy], ease);
  let S = frame < C.pullBack ? base : interpolate(frame, [C.pullBack, C.pulled], [base, fit], ease);
  if (frame >= C.tilt) {
    cy = interpolate(frame, [C.tilt, C.tilted], [fitCy, 2600], ease);
    S = interpolate(frame, [C.tilt, C.tilted], [fit, base], ease);
  }
  const tx = 540 - 540 * S;
  const ty = Vc - cy * S;

  const bg = interpolateColors(frame, [C.tilted - 8, C.tilted - 2], [props.colors.light, props.colors.blue]);

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${tx}px, ${ty}px) scale(${S})`, transformOrigin: "0 0" }}>
          <World props={props} />
        </div>
        {/* soft band so the run never fights with the headline */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: top + 60,
            background: `linear-gradient(${bg} 0%, ${bg} ${((top + 6) / (top + 60)) * 100}%, transparent 100%)`,
          }}
        />
        <Headlines props={props} />
        <CtaScene props={props.cta} />
        {props.withVoice ? <Audio src={staticFile("vo/knikkerbaan/voice-over.mp3")} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
