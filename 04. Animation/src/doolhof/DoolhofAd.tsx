import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { PaletteProvider } from "../lib/palette";
import { brand } from "../theme";
import "../theme";
import { type DoolhofProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE } from "./schema";
import { AgendaScene } from "./scenes/AgendaScene";
import { CtaScene } from "./scenes/CtaScene";
import { MazeScene } from "./scenes/MazeScene";
import { seamPush, straightDown } from "./wipes";

// Concept 126 · "Geen app. Gewoon rechtdoor." (doolhof)
// Scenes run on absolute frames so each scene start sits on its spoken cue.
// S1 to S2 is the split seam inside MazeScene; S2 to S3 the seam push; S3 to S4 the straight wipe.
export const DoolhofAd: React.FC<DoolhofProps> = (props) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const T = props.transitionFrames;
  const half = T / 2;
  const [, , s3, s4] = SCENE_STARTS;
  const ease = Easing.inOut(Easing.cubic);
  const p3 = interpolate(frame, [s3 - half, s3 + half], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const p4 = interpolate(frame, [s4 - half, s4 + half], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light }}>
        {frame < s3 + half ? <MazeScene props={props} T={T} /> : null}
        {frame >= s3 - half && frame < s4 + half ? (
          <AbsoluteFill style={p3 < 1 ? seamPush(p3) : {}}>
            <AgendaScene props={props.agenda} bill={props.bill} />
          </AbsoluteFill>
        ) : null}
        {frame >= s4 - half ? (
          <AbsoluteFill style={p4 < 1 ? straightDown(p4) : {}}>
            <CtaScene props={props.cta} />
          </AbsoluteFill>
        ) : null}
        {p4 > 0 && p4 < 1 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: p4 * height - 8,
              height: 16,
              background: brand.yellow,
              borderRadius: 8,
            }}
          />
        ) : null}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};

export const doolhofDuration = () => TOTAL_FRAMES;
