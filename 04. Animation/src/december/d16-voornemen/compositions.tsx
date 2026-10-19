import React from "react";
import { type CalculateMetadataFunction, Composition, Folder, Still } from "remotion";
import { FEED, FPS, REEL } from "../common";
import { StoryPoll } from "./StoryPoll";
import {
  defaultVoornemenProps,
  defaultVoornemenStoryProps,
  type VoornemenProps,
  voornemenSchema,
  voornemenStorySchema,
  voornemenTotal,
} from "./schema";
import { VoornemenAd } from "./VoornemenAd";

const metadata: CalculateMetadataFunction<VoornemenProps> = ({ props }) => ({
  durationInFrames: voornemenTotal(props.timing),
});

// Idee 16 · "Een voornemen in 30 seconden": Reel (9:16), Feed (4:5) en een Story-poll.
export const Dec16VoornemenCompositions: React.FC = () => (
  <Folder name="D16-Voornemen">
    <Composition
      id="DEC16-Voornemen-Reel"
      component={VoornemenAd}
      schema={voornemenSchema}
      defaultProps={defaultVoornemenProps}
      calculateMetadata={metadata}
      durationInFrames={voornemenTotal(defaultVoornemenProps.timing)}
      fps={FPS}
      width={REEL.width}
      height={REEL.height}
    />
    <Composition
      id="DEC16-Voornemen-Feed"
      component={VoornemenAd}
      schema={voornemenSchema}
      defaultProps={defaultVoornemenProps}
      calculateMetadata={metadata}
      durationInFrames={voornemenTotal(defaultVoornemenProps.timing)}
      fps={FPS}
      width={FEED.width}
      height={FEED.height}
    />
    <Still
      id="DEC16-Voornemen-Story"
      component={StoryPoll}
      schema={voornemenStorySchema}
      defaultProps={defaultVoornemenStoryProps}
      width={REEL.width}
      height={REEL.height}
    />
  </Folder>
);
