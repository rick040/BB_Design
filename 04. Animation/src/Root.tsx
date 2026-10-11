import React from "react";
import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { Ad } from "./Ad";
import { type AdProps, adSchema, defaultAdProps, FPS, totalFrames } from "./schema";

const calculateMetadata: CalculateMetadataFunction<AdProps> = ({ props }) => ({
  durationInFrames: totalFrames(props.timing),
});

export const RemotionRoot: React.FC = () => (
  <Folder name="BetaalBuddy">
    {/* 9:16 for Reels + Stories */}
    <Composition
      id="BB-Ad-Reel"
      component={Ad}
      schema={adSchema}
      defaultProps={defaultAdProps}
      calculateMetadata={calculateMetadata}
      durationInFrames={totalFrames(defaultAdProps.timing)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    {/* 4:5 for the feed */}
    <Composition
      id="BB-Ad-Feed"
      component={Ad}
      schema={adSchema}
      defaultProps={defaultAdProps}
      calculateMetadata={calculateMetadata}
      durationInFrames={totalFrames(defaultAdProps.timing)}
      fps={FPS}
      width={1080}
      height={1350}
    />
  </Folder>
);
