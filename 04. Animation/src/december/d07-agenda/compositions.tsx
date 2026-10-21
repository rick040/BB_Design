import React from "react";
import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { FEED, FPS, REEL } from "../common";
import { AgendaAd } from "./AgendaAd";
import { type AgendaProps, agendaSchema, agendaTotal, defaultAgendaProps } from "./schema";

const metadata: CalculateMetadataFunction<AgendaProps> = ({ props }) => ({
  durationInFrames: agendaTotal(props.timing),
});

export const Dec07AgendaCompositions: React.FC = () => (
  <Folder name="D07-Agenda">
    {([
      ["DEC07-Agenda-Reel", REEL],
      ["DEC07-Agenda-Feed", FEED],
    ] as const).map(([id, size]) => (
      <Composition
        key={id}
        id={id}
        component={AgendaAd}
        schema={agendaSchema}
        defaultProps={defaultAgendaProps}
        calculateMetadata={metadata}
        durationInFrames={agendaTotal(defaultAgendaProps.timing)}
        fps={FPS}
        width={size.width}
        height={size.height}
      />
    ))}
  </Folder>
);
