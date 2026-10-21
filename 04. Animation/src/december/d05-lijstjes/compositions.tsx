import React from "react";
import { Folder, Still } from "remotion";
import { FEED } from "../common";
import { LijstjesSlide } from "./LijstjesSlide";
import { defaultLijstjesProps, lijstjesSchema } from "./schema";

// Idee 5 · "Lijstjesmaand": carrousel van 5 slides (1080×1350), organisch.
export const Dec05LijstjesCompositions: React.FC = () => (
  <Folder name="D05-Lijstjes">
    {[1, 2, 3, 4, 5].map((n) => (
      <Still
        key={n}
        id={`DEC05-Lijstjes-${n}`}
        component={LijstjesSlide}
        schema={lijstjesSchema}
        defaultProps={{ ...defaultLijstjesProps, slide: n }}
        width={FEED.width}
        height={FEED.height}
      />
    ))}
  </Folder>
);
