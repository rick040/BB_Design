import React from "react";
import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { FEED, FPS, REEL } from "../common";
import { defaultVriendProps, type VriendProps, vriendSchema, vriendTotal } from "./schema";
import { VriendAd } from "./VriendAd";

const metadata: CalculateMetadataFunction<VriendProps> = ({ props }) => ({
  durationInFrames: vriendTotal(props.timing),
});

export const Dec12VriendCompositions: React.FC = () => (
  <Folder name="D12-Vriend">
    <Composition
      id="DEC12-Vriend-Reel"
      component={VriendAd}
      schema={vriendSchema}
      defaultProps={defaultVriendProps}
      calculateMetadata={metadata}
      durationInFrames={vriendTotal(defaultVriendProps.timing)}
      fps={FPS}
      width={REEL.width}
      height={REEL.height}
    />
    <Composition
      id="DEC12-Vriend-Feed"
      component={VriendAd}
      schema={vriendSchema}
      defaultProps={defaultVriendProps}
      calculateMetadata={metadata}
      durationInFrames={vriendTotal(defaultVriendProps.timing)}
      fps={FPS}
      width={FEED.width}
      height={FEED.height}
    />
  </Folder>
);
