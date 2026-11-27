import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { AdSafeZoneProvider } from "../lib/layout";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import type { BriefProps } from "./schema";
import { LetterScene } from "./scenes/LetterScene";

// Campagne 2612 · W2 "Brief van de maker" (warm). One continuous shot, no cuts.
export const BriefAd: React.FC<BriefProps> = (props) => {
  const { paper, ...palette } = props.colors;
  return (
    <PaletteProvider colors={palette}>
      <AdSafeZoneProvider enabled={props.adSafeZone}>
        <AbsoluteFill style={{ background: paper }}>
          <LetterScene props={props} />
          {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} /> : null}
          {props.showSafeZones ? <SafeZones /> : null}
        </AbsoluteFill>
      </AdSafeZoneProvider>
    </PaletteProvider>
  );
};
