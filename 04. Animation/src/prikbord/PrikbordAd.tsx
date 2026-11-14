import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type PrikbordProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { BoardScene } from "./scenes/BoardScene";
import { CtaScene } from "./scenes/CtaScene";
import { ListScene } from "./scenes/ListScene";
import { SheetScene } from "./scenes/SheetScene";

// Venetian-blind reveal: slats open from their centre line (CSS mask only).
const blinds = (p: number, dir: "to bottom" | "to right", slat = 160): React.CSSProperties => {
  const open = Math.max(0, Math.min(1, p)) * (slat / 2);
  const a = slat / 2 - open;
  const b = slat / 2 + open;
  const mask = `repeating-linear-gradient(${dir}, transparent 0px, transparent ${a}px, #000 ${a}px, #000 ${b}px, transparent ${b}px, transparent ${slat}px)`;
  return { WebkitMaskImage: mask, maskImage: mask };
};
// Push up from below.
const riseUp = (p: number): React.CSSProperties => ({
  transform: `translateY(${(1 - Math.min(1, Math.max(0, p))) ** 2 * 100}%)`,
});

// Concept 86 · "Geen draadjes. Gewoon één lijst." (prikbord)
// Scenes run on absolute frames; each scene start sits on its spoken cue and
// every transition is centred on that cue.
export const PrikbordAd: React.FC<PrikbordProps> = (props) => {
  const frame = useCurrentFrame();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [starts[1] + half, starts[2] + half, starts[3] + half, TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: { node: React.ReactNode; style: (p: number) => React.CSSProperties }[] = [
    { node: <BoardScene props={props.board} bills={props.bills} />, style: () => ({}) },
    { node: <ListScene props={props.list} bills={props.bills} />, style: (p) => blinds(p, "to bottom") },
    { node: <SheetScene props={props.sheet} bills={props.bills} />, style: (p) => blinds(p, "to right", 180) },
    { node: <CtaScene props={props.cta} />, style: (p) => riseUp(p) },
  ];

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
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
