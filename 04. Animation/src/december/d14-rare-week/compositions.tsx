import React from "react";
import { Folder, Still } from "remotion";
import { FEED } from "../common";
import { RareWeekPost } from "./RareWeekPost";
import { defaultRareWeekProps, rareWeekSchema } from "./schema";

export const Dec14RareWeekCompositions: React.FC = () => (
  <Folder name="D14-RareWeek">
    <Still
      id="DEC14-RareWeek"
      component={RareWeekPost}
      schema={rareWeekSchema}
      defaultProps={defaultRareWeekProps}
      width={FEED.width}
      height={FEED.height}
    />
  </Folder>
);
