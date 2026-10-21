import React from "react";
import { Folder, Still } from "remotion";
import { FEED } from "../common";
import { BriefPost } from "./BriefPost";
import { briefSchema, defaultBriefProps } from "./schema";

export const Dec06BriefCompositions: React.FC = () => (
  <Folder name="D06-Brief">
    <Still
      id="DEC06-Brief"
      component={BriefPost}
      schema={briefSchema}
      defaultProps={defaultBriefProps}
      width={FEED.width}
      height={FEED.height}
    />
  </Folder>
);
