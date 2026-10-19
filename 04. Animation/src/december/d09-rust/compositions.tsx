import React from "react";
import { Folder, Still } from "remotion";
import { FEED } from "../common";
import { RustPost } from "./RustPost";
import { defaultRustProps, rustSchema } from "./schema";

export const Dec09RustCompositions: React.FC = () => (
  <Folder name="D09-Rust">
    <Still
      id="DEC09-Rust"
      component={RustPost}
      schema={rustSchema}
      defaultProps={defaultRustProps}
      width={FEED.width}
      height={FEED.height}
    />
  </Folder>
);
