import React from "react";
import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { FEED, FPS, REEL } from "../common";
import { SintAd } from "./SintAd";
import { defaultSintProps, type SintProps, sintSchema, sintTotal } from "./schema";

const metadata: CalculateMetadataFunction<SintProps> = ({ props }) => ({
  durationInFrames: sintTotal(props.timing),
});

export const Dec03SintCompositions: React.FC = () => (
  <Folder name="D03-Sint">
    {([
      ["DEC03-Sint-Reel", REEL],
      ["DEC03-Sint-Feed", FEED],
    ] as const).map(([id, size]) => (
      <Composition
        key={id}
        id={id}
        component={SintAd}
        schema={sintSchema}
        defaultProps={defaultSintProps}
        calculateMetadata={metadata}
        durationInFrames={sintTotal(defaultSintProps.timing)}
        fps={FPS}
        width={size.width}
        height={size.height}
      />
    ))}
  </Folder>
);
