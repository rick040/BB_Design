import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { flapReveal, zipPullY, zipReveal } from "../lib/kofferWipes";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { type KofferProps, SCENE_STARTS, VO_FILE } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { ForwardScene } from "./scenes/ForwardScene";
import { SuitcaseScene } from "./scenes/SuitcaseScene";

// Concept 101 · "Geen app erbij." (koffer)
// Scenes run on absolute frames so each scene start sits on its spoken cue.
// [S1] and [S2] share one suitcase shot (the label flips MYTHE → FEIT);
// [S3] is unzipped in (rits), [S4] drops in like carousel flaps (flappen).
export const KofferAd: React.FC<KofferProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = props.transitionFrames;
  const half = T / 2;
  const s3 = SCENE_STARTS[2];
  const s4 = SCENE_STARTS[3];
  const zipLen = T + 6;
  const zipFrom = s3 - zipLen / 2;
  const zipP = (frame - zipFrom) / zipLen;
  const flapFrom = s4 - half;
  const flapP = (frame - flapFrom) / T;

  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light }}>
        {frame < zipFrom + zipLen ? (
          <AbsoluteFill>
            <SuitcaseScene myth={props.myth} fact={props.fact} />
          </AbsoluteFill>
        ) : null}
        {frame >= zipFrom && frame < flapFrom + T ? (
          <AbsoluteFill style={zipP < 1 ? zipReveal(zipP, width, height) : {}}>
            <ForwardScene props={props.forward} bill={props.bill} />
          </AbsoluteFill>
        ) : null}
        {frame >= zipFrom && zipP < 1 ? (
          <div
            style={{
              position: "absolute",
              left: width / 2 - 26,
              top: zipPullY(zipP, height) - 10,
              width: 52,
              height: 90,
              borderRadius: 26,
              background: "#ffce31",
              boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
            }}
          />
        ) : null}
        {frame >= flapFrom ? (
          <AbsoluteFill style={flapP < 1 ? flapReveal(flapP, width, height) : {}}>
            <CtaScene props={props.cta} />
          </AbsoluteFill>
        ) : null}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
