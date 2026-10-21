import React from "react";
import { Folder, Still } from "remotion";
import { FEED, REEL } from "../common";
import { KerstkaartBack, KerstkaartFront, KerstkaartStory } from "./Kerstkaart";
import { defaultKerstkaartProps, kerstkaartSchema } from "./schema";

export const Dec11KerstkaartCompositions: React.FC = () => (
  <Folder name="D11-Kerstkaart">
    <Still
      id="DEC11-Kerstkaart-1"
      component={KerstkaartFront}
      schema={kerstkaartSchema}
      defaultProps={defaultKerstkaartProps}
      width={FEED.width}
      height={FEED.height}
    />
    <Still
      id="DEC11-Kerstkaart-2"
      component={KerstkaartBack}
      schema={kerstkaartSchema}
      defaultProps={defaultKerstkaartProps}
      width={FEED.width}
      height={FEED.height}
    />
    <Still
      id="DEC11-Kerstkaart-Story"
      component={KerstkaartStory}
      schema={kerstkaartSchema}
      defaultProps={defaultKerstkaartProps}
      width={REEL.width}
      height={REEL.height}
    />
  </Folder>
);
