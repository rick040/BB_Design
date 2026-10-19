import React from "react";
import { type CalculateMetadataFunction, Composition, Folder, Still } from "remotion";
import { FEED, FPS, REEL } from "../common";
import { AdventAd } from "./AdventAd";
import { type AdventProps, adventSchema, adventTotal, defaultAdventProps, defaultStoryProps, storySchema } from "./schema";
import { StoryDoor } from "./StoryDoor";

const metadata: CalculateMetadataFunction<AdventProps> = ({ props }) => ({
  durationInFrames: adventTotal(props.timing),
});

export const Dec02AdventCompositions: React.FC = () => (
  <Folder name="D02-Advent">
    <Composition
      id="DEC02-Advent-Reel"
      component={AdventAd}
      schema={adventSchema}
      defaultProps={defaultAdventProps}
      calculateMetadata={metadata}
      durationInFrames={adventTotal(defaultAdventProps.timing)}
      fps={FPS}
      width={REEL.width}
      height={REEL.height}
    />
    <Composition
      id="DEC02-Advent-Feed"
      component={AdventAd}
      schema={adventSchema}
      defaultProps={defaultAdventProps}
      calculateMetadata={metadata}
      durationInFrames={adventTotal(defaultAdventProps.timing)}
      fps={FPS}
      width={FEED.width}
      height={FEED.height}
    />
    {/* Story-reeks: één deurtje per dag, 1 t/m 24 december */}
    {Array.from({ length: 24 }, (_, i) => i + 1).map((day) => (
      <Still
        key={day}
        id={`DEC02-Advent-Story-${String(day).padStart(2, "0")}`}
        component={StoryDoor}
        schema={storySchema}
        defaultProps={{ ...defaultStoryProps, day }}
        width={REEL.width}
        height={REEL.height}
      />
    ))}
  </Folder>
);
