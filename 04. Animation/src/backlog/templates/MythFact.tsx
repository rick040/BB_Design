import { flip } from "@remotion/transitions/flip";
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BacklogFrame, endFrames } from "../BacklogFrame";
import { baseSchema, bgSchema, sec, seriesTotal } from "../common";
import { Head, Sub, useBg } from "../parts";
import { VisualView } from "../visuals";
import { CheckIcon } from "../visuals/Card";
import { z } from "zod";

// Template 5 · Mythe vs feit (also used as a quiz). A card shows a claim, then
// flips over to the answer. Up to four cards in a row, then a payoff.
export const mythSchema = baseSchema.extend({
  headline: z.string(),
  bg: bgSchema,
  claimLabel: z.string(),
  factLabel: z.string(),
  pairs: z
    .array(
      z.object({
        claim: z.string(),
        fact: z.string(),
        /** Label on the answer side; empty = factLabel. */
        verdict: z.string(),
        /** fact = blue answer · bill = red ("Rekening") · ad = grey ("Reclame"). */
        tone: z.enum(["fact", "bill", "ad"]),
      }),
    )
    .min(1)
    .max(4),
  pairSeconds: z.number().min(1.4).max(5),
  /** Second within a pair at which the card flips. */
  flipAt: z.number().min(0.5).max(3),
  payoff: z.object({ headline: z.string(), subline: z.string(), seconds: z.number().min(0).max(6) }),
});
export type MythProps = z.infer<typeof mythSchema>;

export const MYTH_T = {
  flipLen: 14, // frames of the flip
  swapLen: 9, // frames the next card needs to slide in over the outgoing one
  payoffBuddy: 8,
};

const cardsSeconds = (p: MythProps) => p.pairs.length * p.pairSeconds + 0.3;
export const mythFrames = (p: MythProps) =>
  p.payoff.seconds > 0 ? [sec(cardsSeconds(p)), sec(p.payoff.seconds), endFrames(p)] : [sec(cardsSeconds(p)), endFrames(p)];
export const mythTotal = (p: MythProps) => seriesTotal(mythFrames(p), p.transition);

const CardFace: React.FC<{
  label: string;
  text: string;
  bg: string;
  fg: string;
  labelBg: string;
  labelFg: string;
  icon: React.ReactNode;
  back?: boolean;
  count: string;
}> = ({ label, text, bg, fg, labelBg, labelFg, icon, back, count }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 56,
      background: bg,
      boxShadow: "0 30px 80px rgba(1, 40, 160, 0.2)",
      backfaceVisibility: "hidden",
      transform: back ? "rotateY(180deg)" : undefined,
      padding: "56px 60px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: 40,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 28px 12px 16px",
          borderRadius: 34,
          background: labelBg,
          color: labelFg,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {icon}
        {label}
      </div>
      <span style={{ fontFamily: fonts.ui, fontSize: 32, color: fg, opacity: 0.5 }}>{count}</span>
    </div>
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: text.length > 80 ? 64 : text.length > 50 ? 74 : text.length > 30 ? 84 : 96,
        lineHeight: 1.08,
        letterSpacing: "-0.035em",
        color: fg,
        textWrap: "balance",
      }}
    >
      {text}
    </div>
  </div>
);

const CardsScene: React.FC<{ props: MythProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const c = useBg(props.bg);
  const per = sec(props.pairSeconds);
  const swap = MYTH_T.swapLen;
  const n = props.pairs.length;
  const f0 = sec(props.flipAt);
  return (
    <SceneBg color={c.bg}>
      <Head text={props.headline} color={c.fg} hook sizeFactor={0.95} />
      <Stage offsetY={20}>
        {props.pairs.map((pair, j) => {
          const start = j * per;
          if (frame < start - swap || (j < n - 1 && frame > start + per)) return null;
          const inP = j === 0 ? 1 : interpolate(frame, [start - swap, start], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const outP = j === n - 1 ? 0 : interpolate(frame, [start + per - swap, start + per], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
          const flipP = interpolate(frame - start, [f0, f0 + MYTH_T.flipLen], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          const tone = pair.tone;
          // On a blue scene the answer side turns white, so the card never melts into the background.
          const factOnBlue = tone === "fact" && c.onBlue;
          const backBg = factOnBlue ? p.white : tone === "fact" ? p.blue : tone === "bill" ? p.red : p.grey;
          const backFg = factOnBlue ? p.blue : tone === "ad" ? p.ink : p.white;
          const count = n > 1 ? `${j + 1}/${n}` : "";
          return (
            <div
              key={j}
              style={{
                position: "absolute",
                left: 90,
                top: 40,
                width: 900,
                height: 800,
                perspective: 2400,
                zIndex: j,
                transform: `translateX(${(1 - inP) * 1100 - outP * 1100}px) rotate(${(1 - inP) * 8 - outP * 8}deg)`,
              }}
            >
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flipP * 180}deg)` }}>
                <CardFace
                  label={props.claimLabel}
                  text={pair.claim}
                  bg={factOnBlue ? p.blueSoft : p.white}
                  fg={p.ink}
                  labelBg={tone === "fact" ? p.red : p.grey}
                  labelFg={tone === "fact" ? p.white : p.ink}
                  icon={null}
                  count={count}
                />
                <CardFace
                  label={pair.verdict || props.factLabel}
                  text={pair.fact}
                  bg={backBg}
                  fg={backFg}
                  labelBg={factOnBlue ? p.blue : p.white}
                  labelFg={factOnBlue ? p.white : tone === "fact" ? p.blue : tone === "bill" ? p.red : p.ink}
                  icon={tone === "ad" ? null : <CheckIcon size={44} color={factOnBlue ? p.white : tone === "fact" ? p.blue : p.red} />}
                  back
                  count={count}
                />
              </div>
            </div>
          );
        })}
      </Stage>
    </SceneBg>
  );
};

const PayoffScene: React.FC<{ props: MythProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const c = useBg(props.bg === "blue" ? "light" : "blue");
  return (
    <SceneBg color={c.bg}>
      <Head text={props.payoff.headline} color={c.fg} />
      <Stage offsetY={40}>
        <VisualView v={{ kind: "buddy", text: "", mood: "idle" }} t={frame - MYTH_T.payoffBuddy} onBlue={c.onBlue} />
      </Stage>
      <Sub text={props.payoff.subline} color={c.sub} />
    </SceneBg>
  );
};

export const MythFact: React.FC<MythProps> = (props) => (
  <BacklogFrame
    base={props}
    presentation={() => flip({ direction: "from-right" })}
    scenes={[
      { name: "Kaarten", frames: sec(cardsSeconds(props)), node: <CardsScene props={props} /> },
      ...(props.payoff.seconds > 0
        ? [{ name: "Payoff", frames: sec(props.payoff.seconds), node: <PayoffScene props={props} /> }]
        : []),
    ]}
  />
);
