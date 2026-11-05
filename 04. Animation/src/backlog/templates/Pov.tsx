import { slide } from "@remotion/transitions/slide";
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { shake } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BacklogFrame, endFrames } from "../BacklogFrame";
import { baseSchema, bgSchema, sec, seriesTotal } from "../common";
import { Head, Sub, useBg } from "../parts";
import { VisualView, visualSchema } from "../visuals";
import { z } from "zod";

// Template 1 · POV. A "POV" sticker on a phone-screen moment, a twist, a payoff.
export const povSchema = baseSchema.extend({
  sticker: z.string(),
  beats: z
    .array(
      z.object({
        headline: z.string(),
        subline: z.string(),
        bg: bgSchema,
        visual: visualSchema,
        seconds: z.number().min(2).max(8),
        /** Second at which the frame shakes, -1 = no shake. */
        shakeAt: z.number(),
      }),
    )
    .min(1)
    .max(3),
});
export type PovProps = z.infer<typeof povSchema>;

export const POV_T = {
  visualIn: 6, // visual pops in (beat 1 starts with it already there)
  stickerIn: 0,
  subline: 18,
};

export const povFrames = (p: PovProps) => [...p.beats.map((b) => sec(b.seconds)), endFrames(p)];
export const povTotal = (p: PovProps) => seriesTotal(povFrames(p), p.transition);

const PovBeat: React.FC<{ beat: PovProps["beats"][number]; first: boolean; sticker: string }> = ({ beat, first, sticker }) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const c = useBg(beat.bg);
  const sh = beat.shakeAt >= 0 ? shake(frame, sec(beat.shakeAt), 16, 20) : { x: 0, y: 0, r: 0 };
  return (
    <SceneBg color={c.bg}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg)` }}>
        <Head text={beat.headline} color={c.fg} hook={first} />
        <Stage>
          <VisualView v={beat.visual} t={first ? frame : frame - POV_T.visualIn} onBlue={c.onBlue} enter={!first} />
          {first && sticker ? (
            <div
              style={{
                position: "absolute",
                left: 60,
                top: -20,
                padding: "12px 30px 16px",
                borderRadius: 22,
                background: p.yellow,
                color: p.ink,
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 56,
                letterSpacing: "-0.02em",
                transform: "rotate(-7deg)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                zIndex: 10,
              }}
            >
              {sticker}
            </div>
          ) : null}
        </Stage>
        <Sub text={beat.subline} color={c.sub} delay={POV_T.subline} />
      </div>
    </SceneBg>
  );
};

export const Pov: React.FC<PovProps> = (props) => (
  <BacklogFrame
    base={props}
    presentation={() => slide({ direction: "from-bottom" })}
    scenes={props.beats.map((b, i) => ({
      name: i === 0 ? "Hook" : `Beat ${i + 1}`,
      frames: sec(b.seconds),
      node: <PovBeat beat={b} first={i === 0} sticker={props.sticker} />,
    }))}
  />
);
