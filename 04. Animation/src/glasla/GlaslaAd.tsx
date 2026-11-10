import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { drawerPull, squeegeeMask, squeegeeX } from "../lib/glassWipes";
import { PaletteProvider } from "../lib/palette";
import { brand } from "../theme";
import "../theme";
import { Squeegee } from "./components/Glass";
import { type GlaslaProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { DrawerScene } from "./scenes/DrawerScene";
import { ExpiryScene } from "./scenes/ExpiryScene";
import { HookScene } from "./scenes/HookScene";
import { InspectScene } from "./scenes/InspectScene";

type Kind = "none" | "drawer" | "squeegee" | "squeegeeRight";

// Concept 65 · "Niks verstopt. Alles in zicht." (glazen la)
// Scenes run on absolute frames so each scene start sits exactly on its
// spoken cue; every transition is centred on that cue.
export const GlaslaAd: React.FC<GlaslaProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = props.transitionFrames;
  const half = T / 2;
  const starts = SCENE_STARTS;
  const ends = [...starts.slice(1).map((s) => s + half), TOTAL_FRAMES];
  const progress = (i: number) => (frame - (starts[i] - half)) / T;

  const scenes: { node: React.ReactNode; kind: Kind }[] = [
    { node: <HookScene props={props.hook} fields={props.fields} />, kind: "none" },
    { node: <DrawerScene props={props.drawer} fields={props.fields} />, kind: "drawer" },
    { node: <InspectScene props={props.inspect} fields={props.fields} sender={props.sender} />, kind: "squeegee" },
    { node: <ExpiryScene props={props.expiry} fields={props.fields} />, kind: "squeegeeRight" },
    { node: <CtaScene props={props.cta} />, kind: "drawer" },
  ];

  const style = (kind: Kind, p: number): React.CSSProperties =>
    kind === "drawer" ? drawerPull(p) : kind === "squeegee" ? squeegeeMask(p) : kind === "squeegeeRight" ? squeegeeMask(p, true) : {};

  let blade: React.ReactNode = null;
  scenes.forEach((s, i) => {
    const p = progress(i);
    if (i > 0 && p >= 0 && p < 1 && (s.kind === "squeegee" || s.kind === "squeegeeRight")) {
      const x = squeegeeX(p) * width;
      const right = s.kind === "squeegeeRight";
      blade = (
        <div style={{ position: "absolute", inset: 0, transform: right ? "scaleX(-1)" : undefined }}>
          <Squeegee x={x} top={-20} height={height + 40} color={brand.yellow} handle="transparent" />
        </div>
      );
    }
  });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.blue }}>
        {scenes.map((s, i) => {
          const from = i === 0 ? 0 : starts[i] - half;
          if (frame < from || frame >= ends[i]) return null;
          const p = progress(i);
          return (
            <AbsoluteFill key={i} style={i > 0 && p < 1 ? style(s.kind, p) : {}}>
              {s.node}
            </AbsoluteFill>
          );
        })}
        {blade}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
