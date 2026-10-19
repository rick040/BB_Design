import React from "react";
import { Folder, Still } from "remotion";
import { FEED } from "../common";
import { RijmSlide } from "./RijmSlide";
import { defaultRijmProps, rijmSchema } from "./schema";

// Idee 4 · "Het Buddy-rijm": carrousel van 4 slides (1080×1350), alleen organisch.
export const Dec04RijmCompositions: React.FC = () => (
  <Folder name="D04-Rijm">
    {[1, 2, 3, 4].map((n) => (
      <Still
        key={n}
        id={`DEC04-Rijm-${n}`}
        component={RijmSlide}
        schema={rijmSchema}
        defaultProps={{ ...defaultRijmProps, slide: n }}
        width={FEED.width}
        height={FEED.height}
      />
    ))}
  </Folder>
);
