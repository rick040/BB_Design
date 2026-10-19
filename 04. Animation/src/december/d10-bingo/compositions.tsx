import React from "react";
import { Folder, Still } from "remotion";
import { FEED } from "../common";
import { BingoPost } from "./BingoPost";
import { bingoSchema, defaultBingoProps } from "./schema";

export const Dec10BingoCompositions: React.FC = () => (
  <Folder name="D10-Bingo">
    <Still
      id="DEC10-Bingo"
      component={BingoPost}
      schema={bingoSchema}
      defaultProps={defaultBingoProps}
      width={FEED.width}
      height={FEED.height}
    />
  </Folder>
);
