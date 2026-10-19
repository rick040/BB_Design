import React from "react";
import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { FEED, FPS, REEL } from "../common";
import { PakketjesAd } from "./PakketjesAd";
import { defaultPakketjesProps, type PakketjesProps, pakketjesSchema, pakketjesTotal } from "./schema";

const metadata: CalculateMetadataFunction<PakketjesProps> = ({ props }) => ({
  durationInFrames: pakketjesTotal(props.timing),
});

export const Dec01PakketjesCompositions: React.FC = () => (
  <Folder name="D01-Pakketjes">
    {([
      ["DEC01-Pakketjes-Reel", REEL],
      ["DEC01-Pakketjes-Feed", FEED],
    ] as const).map(([id, size]) => (
      <Composition
        key={id}
        id={id}
        component={PakketjesAd}
        schema={pakketjesSchema}
        defaultProps={defaultPakketjesProps}
        calculateMetadata={metadata}
        durationInFrames={pakketjesTotal(defaultPakketjesProps.timing)}
        fps={FPS}
        width={size.width}
        height={size.height}
      />
    ))}
  </Folder>
);
