import { fade } from "@remotion/transitions/fade";
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BacklogFrame, endFrames } from "../BacklogFrame";
import { type Bg, baseSchema, bgSchema, sec, seriesTotal } from "../common";
import { Head, Sub, useBg } from "../parts";
import { VisualView, visualSchema } from "../visuals";
import { z } from "zod";

// Template 3 · Voor/na. One frame, a divider sweeps across and flips the whole
// scene from "before" to "after" (other background colour, other visual).
const side = z.object({ label: z.string(), visual: visualSchema });

export const splitSchema = baseSchema.extend({
  headline: z.string(),
  /** Background of the "before" half; "after" gets the other colour. */
  bg: bgSchema,
  before: side,
  after: side,
  /** Second at which the divider sweeps. */
  wipeAt: z.number(),
  payoff: z.string(),
  seconds: z.number().min(4).max(14),
});
export type SplitProps = z.infer<typeof splitSchema>;

export const SPLIT_T = {
  wipeLen: 16, // frames the divider needs to cross
  afterVisual: 8, // after-visual starts this many frames after the wipe starts
  payoff: 26, // payoff line, frames after the wipe starts
};

export const splitFrames = (p: SplitProps) => [sec(p.seconds), endFrames(p)];
export const splitTotal = (p: SplitProps) => seriesTotal(splitFrames(p), p.transition);

const Label: React.FC<{ text: string; onBlue: boolean }> = ({ text, onBlue }) => {
  const p = usePalette();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: -64, display: "flex", justifyContent: "center", zIndex: 5 }}>
      <div
        style={{
          padding: "10px 30px 12px",
          borderRadius: 28,
          background: onBlue ? p.white : p.blue,
          color: onBlue ? p.blue : p.white,
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Half: React.FC<{ props: SplitProps; which: "before" | "after"; bg: Bg; t: number; payoffT: number }> = ({ props, which, bg, t, payoffT }) => {
  const c = useBg(bg);
  const s = props[which];
  return (
    <SceneBg color={c.bg}>
      <Head text={props.headline} color={c.fg} hook />
      <Stage offsetY={40}>
        <Label text={s.label} onBlue={c.onBlue} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 900, transform: "scale(0.96)", transformOrigin: "50% 0%" }}>
          <VisualView v={s.visual} t={t} onBlue={c.onBlue} enter={which === "after"} />
        </div>
      </Stage>
      {which === "after" ? <Sub text={props.payoff} color={c.sub} delay={payoffT} /> : null}
    </SceneBg>
  );
};

const SplitScene: React.FC<{ props: SplitProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const p = usePalette();
  const w0 = sec(props.wipeAt);
  const w = interpolate(frame, [w0, w0 + SPLIT_T.wipeLen], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const afterBg: Bg = props.bg === "blue" ? "light" : "blue";
  const x = w * width;
  return (
    <>
      <Half props={props} which="before" bg={props.bg} t={frame + 24} payoffT={0} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>
        <Half props={props} which="after" bg={afterBg} t={frame - w0 - SPLIT_T.afterVisual} payoffT={w0 + SPLIT_T.payoff} />
      </div>
      {w > 0 && w < 1 ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: x - 5, width: 10, background: p.yellow }}>
          <div
            style={{
              position: "absolute",
              left: -45,
              top: "50%",
              width: 100,
              height: 100,
              marginTop: -50,
              borderRadius: 50,
              background: p.yellow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 40 40">
              <path d="M15 12l-8 8 8 8M25 12l8 8-8 8" fill="none" stroke={p.ink} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ) : null}
    </>
  );
};

export const Split: React.FC<SplitProps> = (props) => (
  <BacklogFrame
    base={props}
    presentation={() => fade()}
    scenes={[{ name: "Voor/na", frames: sec(props.seconds), node: <SplitScene props={props} /> }]}
  />
);
