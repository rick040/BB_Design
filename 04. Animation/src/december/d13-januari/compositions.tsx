import React from "react";
import { Folder, Still } from "remotion";
import { FEED } from "../common";
import { JanuariSlide } from "./JanuariSlide";
import { defaultJanuariProps, januariSchema } from "./schema";

// Idee 13 · "Januari staat al klaar": carrousel van 6 slides (1080×1350), organisch en als ad.
export const Dec13JanuariCompositions: React.FC = () => (
  <Folder name="D13-Januari">
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <Still
        key={n}
        id={`DEC13-Januari-${n}`}
        component={JanuariSlide}
        schema={januariSchema}
        defaultProps={{ ...defaultJanuariProps, slide: n }}
        width={FEED.width}
        height={FEED.height}
      />
    ))}
  </Folder>
);
