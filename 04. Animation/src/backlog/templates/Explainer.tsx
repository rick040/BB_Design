import { slide } from "@remotion/transitions/slide";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BacklogFrame, endFrames } from "../BacklogFrame";
import { baseSchema, bgSchema, sec, seriesTotal } from "../common";
import { Head, Sub, useBg } from "../parts";
import { VisualView, visualSchema } from "../visuals";
import { z } from "zod";

// Template 6 · Mini-explainer. Numbered steps, one visual per step, pushed in from the right.
export const explainerSchema = baseSchema.extend({
  bg: bgSchema,
  steps: z
    .array(
      z.object({
        /** Step 1's headline is the hook. */
        headline: z.string(),
        subline: z.string(),
        visual: visualSchema,
        seconds: z.number().min(2).max(8),
      }),
    )
    .min(2)
    .max(4),
});
export type ExplainerProps = z.infer<typeof explainerSchema>;

export const EXPLAINER_T = {
  visualIn: 8, // visual of step 2+ pops in after the push
  dots: 4,
  subline: 16,
};

export const explainerFrames = (p: ExplainerProps) => [...p.steps.map((s) => sec(s.seconds)), endFrames(p)];
export const explainerTotal = (p: ExplainerProps) => seriesTotal(explainerFrames(p), p.transition);

const StepDots: React.FC<{ n: number; active: number; onBlue: boolean }> = ({ n, active, onBlue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const s = pop(frame, fps, EXPLAINER_T.dots, springs.pop);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", gap: 18 }}>
      {Array.from({ length: n }, (_, i) => {
        const on = i === active;
        return (
          <div
            key={i}
            style={{
              width: on ? 72 + 0 * s : 72,
              height: 72,
              borderRadius: 36,
              background: on ? (onBlue ? p.white : p.blue) : "transparent",
              border: `3px solid ${onBlue ? p.blueSoft : p.blueSoft}`,
              color: on ? (onBlue ? p.blue : p.white) : onBlue ? p.blueSoft : p.blueSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 38,
              transform: `scale(${on ? 0.8 + 0.2 * s : 1})`,
            }}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );
};

const Step: React.FC<{ step: ExplainerProps["steps"][number]; i: number; n: number; bg: ExplainerProps["bg"] }> = ({ step, i, n, bg }) => {
  const frame = useCurrentFrame();
  const c = useBg(bg);
  return (
    <SceneBg color={c.bg}>
      <Head text={step.headline} color={c.fg} hook={i === 0} />
      <Stage offsetY={-30}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 830, transform: "scale(0.92)", transformOrigin: "50% 0%" }}>
          <VisualView v={step.visual} t={i === 0 ? frame : frame - EXPLAINER_T.visualIn} onBlue={c.onBlue} enter={i !== 0} />
        </div>
        <StepDots n={n} active={i} onBlue={c.onBlue} />
      </Stage>
      <Sub text={step.subline} color={c.sub} delay={EXPLAINER_T.subline} />
    </SceneBg>
  );
};

export const Explainer: React.FC<ExplainerProps> = (props) => (
  <BacklogFrame
    base={props}
    presentation={() => slide({ direction: "from-right" })}
    scenes={props.steps.map((s, i) => ({
      name: `Stap ${i + 1}`,
      frames: sec(s.seconds),
      node: <Step step={s} i={i} n={props.steps.length} bg={props.bg} />,
    }))}
  />
);
