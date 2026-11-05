import React from "react";
import { type AnyZodObject, Composition, Folder } from "remotion";
import { FPS } from "./common";
import { TEMPLATES } from "./templates";
import { type Entry, PILLARS, type PillarKey, VIDEOS } from "./videos";

// Every backlog video, grouped in a Folder per pillar. IDs: BB-P1-03-Reel
// (1080×1920) and, for videos that also suit the feed, BB-P1-03-Feed (1080×1350).

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const Comp: React.FC<{ e: Entry; format: "Reel" | "Feed" }> = ({ e, format }) => {
  // Each entry pairs a template with props of that template's schema.
  const t = TEMPLATES[e.template] as unknown as {
    component: React.FC<Record<string, unknown>>;
    schema: AnyZodObject;
    total: (p: unknown) => number;
  };
  return (
    <Composition
      id={`${e.id}-${format}`}
      component={t.component}
      schema={t.schema}
      defaultProps={e.props as unknown as Record<string, unknown>}
      calculateMetadata={({ props }) => ({ durationInFrames: t.total(props) })}
      durationInFrames={t.total(e.props)}
      fps={FPS}
      width={1080}
      height={format === "Reel" ? 1920 : 1350}
    />
  );
};

export const BacklogCompositions: React.FC = () => (
  <>
    {(Object.keys(PILLARS) as PillarKey[]).map((key) => (
      <Folder key={key} name={`Backlog-${key}-${slug(PILLARS[key])}`}>
        {VIDEOS.filter((e) => e.pillar === key).map((e) => (
          <React.Fragment key={e.id}>
            <Comp e={e} format="Reel" />
            {e.feed ? <Comp e={e} format="Feed" /> : null}
          </React.Fragment>
        ))}
      </Folder>
    ))}
  </>
);
