import React from "react";
import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { FEED, FPS, REEL } from "../common";
import { AftellenAd } from "./AftellenAd";
import { type AftellenProps, aftellenSchema, aftellenTotal, defaultAftellenProps } from "./schema";

const metadata: CalculateMetadataFunction<AftellenProps> = ({ props }) => ({
  durationInFrames: aftellenTotal(props.timing),
});

export const Dec15Aftellen2027Compositions: React.FC = () => (
  <Folder name="D15-Aftellen-2027">
    <Composition
      id="DEC15-Aftellen2027-Reel"
      component={AftellenAd}
      schema={aftellenSchema}
      defaultProps={defaultAftellenProps}
      calculateMetadata={metadata}
      durationInFrames={aftellenTotal(defaultAftellenProps.timing)}
      fps={FPS}
      width={REEL.width}
      height={REEL.height}
    />
    <Composition
      id="DEC15-Aftellen2027-Feed"
      component={AftellenAd}
      schema={aftellenSchema}
      defaultProps={defaultAftellenProps}
      calculateMetadata={metadata}
      durationInFrames={aftellenTotal(defaultAftellenProps.timing)}
      fps={FPS}
      width={FEED.width}
      height={FEED.height}
    />
  </Folder>
);
