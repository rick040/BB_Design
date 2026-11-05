import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BacklogFrame, endFrames } from "../BacklogFrame";
import { baseSchema, bgSchema, sec, seriesTotal } from "../common";
import { Head, Sub, useBg } from "../parts";
import { VisualView } from "../visuals";
import { sp } from "../visuals/Card";
import { z } from "zod";

// Template 2 · "Dingen die niemand je vertelt" / tier list. Numbered (or tiered)
// cards stack in one by one under a fixed title, then a payoff.
export const listSchema = baseSchema.extend({
  title: z.string(),
  bg: bgSchema,
  items: z
    .array(
      z.object({
        text: z.string(),
        /** Badge instead of the number (tier letter), empty = number. */
        tag: z.string(),
        tagTone: z.enum(["blue", "red", "yellow", "grey"]),
      }),
    )
    .min(3)
    .max(5),
  /** Seconds between two items. */
  itemGap: z.number().min(0.6).max(3),
  /** Seconds the full list stays up after the last item. */
  hold: z.number().min(0.5).max(4),
  payoff: z.object({ headline: z.string(), subline: z.string(), seconds: z.number().min(2).max(6) }),
});
export type ListProps = z.infer<typeof listSchema>;

export const LIST_T = {
  firstItem: -12, // item 1 is already there on frame 0 (cover); the rest follow every itemGap seconds
  payoffBuddy: 8,
};

const listSeconds = (p: ListProps) => 0.4 + (p.items.length - 1) * p.itemGap + p.hold;
export const listFrames = (p: ListProps) => [sec(listSeconds(p)), sec(p.payoff.seconds), endFrames(p)];
export const listTotal = (p: ListProps) => seriesTotal(listFrames(p), p.transition);

const ListScene: React.FC<{ props: ListProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const c = useBg(props.bg);
  const n = props.items.length;
  const ROW = Math.min(200, 900 / n);
  const top0 = (900 - n * ROW) / 2;
  const tones = { blue: p.blue, red: p.red, yellow: p.yellow, grey: p.greyText };
  return (
    <SceneBg color={c.bg}>
      <Head text={props.title} color={c.fg} hook sizeFactor={0.92} />
      <Stage offsetY={60}>
        {props.items.map((it, i) => {
          const at = LIST_T.firstItem + sec(i * props.itemGap);
          const s = sp(frame, at, 13, 190);
          if (frame < at - 2) return null;
          const tagged = it.tag !== "";
          const badgeBg = tagged ? tones[it.tagTone] : c.onBlue ? p.white : p.blue;
          const badgeFg = tagged ? (it.tagTone === "yellow" ? p.ink : p.white) : c.onBlue ? p.blue : p.white;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 50,
                right: 50,
                top: top0 + i * ROW,
                height: ROW - 22,
                borderRadius: 40,
                background: p.white,
                boxShadow: "0 18px 50px rgba(1, 40, 160, 0.14)",
                display: "flex",
                alignItems: "center",
                gap: 30,
                padding: "0 36px 0 24px",
                opacity: Math.min(1, s * 1.6),
                transform: `translateX(${(1 - s) * 120}px) rotate(${(1 - s) * 3}deg)`,
              }}
            >
              <div
                style={{
                  width: ROW - 56,
                  height: ROW - 56,
                  borderRadius: 30,
                  background: badgeBg,
                  color: badgeFg,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: tagged ? 72 : 56,
                  letterSpacing: "-0.04em",
                }}
              >
                {tagged ? it.tag : String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 500,
                  fontSize: n > 4 ? 46 : 52,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: p.ink,
                  textWrap: "balance",
                }}
              >
                {it.text}
              </div>
            </div>
          );
        })}
      </Stage>
    </SceneBg>
  );
};

const PayoffScene: React.FC<{ props: ListProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const c = useBg(props.bg === "blue" ? "light" : "blue");
  return (
    <SceneBg color={c.bg}>
      <Head text={props.payoff.headline} color={c.fg} />
      <Stage offsetY={40}>
        <VisualView v={{ kind: "buddy", text: "", mood: "happy" }} t={frame - LIST_T.payoffBuddy} onBlue={c.onBlue} />
      </Stage>
      <Sub text={props.payoff.subline} color={c.sub} />
    </SceneBg>
  );
};

export const List: React.FC<ListProps> = (props) => (
  <BacklogFrame
    base={props}
    presentation={() => wipe({ direction: "from-top" })}
    scenes={[
      { name: "Lijst", frames: sec(listSeconds(props)), node: <ListScene props={props} /> },
      { name: "Payoff", frames: sec(props.payoff.seconds), node: <PayoffScene props={props} /> },
    ]}
  />
);
