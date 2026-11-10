import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Ruler } from "./components/Ruler";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type RegelsProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { FactScene } from "./scenes/FactScene";
import { HookScene } from "./scenes/HookScene";
import { RulesScene } from "./scenes/RulesScene";
import { flipIn, flipOut, rulerSweep, ruledLines } from "./transitions";

// Concept 63 · "Geen AI. Gewoon vaste regels." (mythe tegenover feit)
// Scenes run on absolute frames so each scene start sits exactly on its
// spoken cue; every transition is centred on that cue.
export const RegelsAd: React.FC<RegelsProps> = (props) => {
  const frame = useCurrentFrame();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: React.ReactNode[] = [
    <HookScene props={props.hook} />,
    <FactScene props={props.fact} aiChip={props.hook.aiChip} />,
    <RulesScene props={props.rules} />,
    <CtaScene props={props.cta} />,
  ];
  // Incoming style per scene index, outgoing style for scene 0 (flip).
  const inStyle = [() => ({}), flipIn, ruledLines, rulerSweep];

  const p3 = progress(3);
  const sweeping = p3 > 0 && p3 < 1;

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        {scenes.map((node, i) => {
          const from = i === 0 ? 0 : starts[i] - half;
          if (frame < from || frame >= ends[i]) return null;
          const pIn = progress(i);
          let style: React.CSSProperties = i > 0 && pIn < 1 ? inStyle[i](pIn) : {};
          if (i === 0) {
            const pOut = progress(1);
            if (pOut > 0) style = flipOut(pOut);
          }
          return (
            <AbsoluteFill key={i} style={style}>
              {node}
            </AbsoluteFill>
          );
        })}
        {sweeping ? (
          <div style={{ position: "absolute", left: -40, top: `calc(${p3 * 100}% - 40px)` }}>
            <Ruler width={1160} height={80} />
          </div>
        ) : null}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
