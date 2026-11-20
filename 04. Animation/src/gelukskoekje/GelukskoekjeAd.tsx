import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { crackOpen, unrollDown, unrollEdge } from "../lib/cookieWipes";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type GelukskoekjeProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { FactScene } from "./scenes/FactScene";
import { HookScene } from "./scenes/HookScene";
import { OutcomeScene } from "./scenes/OutcomeScene";

// Concept 105 · "Geen AI. Geen gok." (gelukskoekje)
// Scenes run on absolute frames so each scene start sits exactly on its
// spoken cue; every transition is centred on that cue.
export const GelukskoekjeAd: React.FC<GelukskoekjeProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: { node: React.ReactNode; style: (p: number) => React.CSSProperties }[] = [
    { node: <HookScene props={props.hook} />, style: () => ({}) },
    { node: <FactScene props={props.fact} bill={props.bill} />, style: (p) => crackOpen(p, width, height) },
    { node: <OutcomeScene props={props.outcome} guess={props.hook.guess} />, style: (p) => unrollDown(p) },
    { node: <CtaScene props={props.cta} />, style: (p) => crackOpen(p, width, height) },
  ];

  const p2 = progress(2);
  const rolling = p2 > 0 && p2 < 1;

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        {scenes.map((s, i) => {
          const from = i === 0 ? 0 : starts[i] - half;
          if (frame < from || frame >= ends[i]) return null;
          const p = progress(i);
          const style = i > 0 && p < 1 ? s.style(p) : {};
          return (
            <AbsoluteFill key={i} style={style}>
              {s.node}
            </AbsoluteFill>
          );
        })}
        {rolling ? (
          // The rolled-up edge of the paper slip while it unrolls.
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: unrollEdge(p2) * height - 28,
              height: 56,
              borderRadius: 28,
              background: "linear-gradient(180deg, #ffffff 0%, #e8edf2 55%, #b6c7ff 100%)",
              boxShadow: "0 18px 40px rgba(1, 40, 160, 0.25)",
            }}
          />
        ) : null}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
