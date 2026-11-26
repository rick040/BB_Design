import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SceneBg } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { JackBox } from "../components/JackBox";
import { type DuveltjeProps, SCENE_STARTS } from "../schema";

// Absolute frames. The box rattles harder and harder: something wants out,
// you just don't know when.
export const HOOK_T = {
  rattle: 0, // crank turns on its own from frame 0
  peek1: 34, // lid lifts, the bill peeks out
  peek2: 62, // second, bigger peek
  end: SCENE_STARTS[1],
};

const peek = (frame: number, at: number, amount: number) =>
  interpolate(frame, [at - 4, at, at + 5, at + 12], [0, amount, amount * 0.6, 0], clamp);

export const HookScene: React.FC<{ props: DuveltjeProps["hook"]; bill: DuveltjeProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const ramp = interpolate(frame, [0, HOOK_T.end], [0.4, 1], clamp);
  const lid = Math.max(peek(frame, HOOK_T.peek1, 0.12), peek(frame, HOOK_T.peek2, 0.32), 0.03 * Math.abs(Math.sin(frame * 0.9)) * ramp);
  const spring = Math.max(peek(frame, HOOK_T.peek1, 40), peek(frame, HOOK_T.peek2, 120));
  const rot = Math.sin(frame * 1.3) * 2.2 * ramp;
  const dx = Math.sin(frame * 2.1) * 5 * ramp;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-15} stagger={2} />
      <JackBox
        cx={540}
        bottom={1330}
        w={440}
        body={p.blue}
        trim={p.white}
        label={props.boxLabel}
        crank={frame * 11}
        lid={lid}
        spring={spring}
        crankColor={p.blueMid}
        springColor={p.blueMid}
        dx={dx}
        rot={rot}
      >
        <div
          style={{
            width: 240,
            height: 90,
            background: p.white,
            borderRadius: 20,
            boxShadow: "0 12px 30px rgba(1,20,90,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 44,
            color: p.ink,
          }}
        >
          {bill.amount}
        </div>
      </JackBox>
      {/* motion ticks around the rattling box */}
      {[-1, 1].map((s) => (
        <div
          key={s}
          style={{
            position: "absolute",
            left: 540 + s * 300 - 20,
            top: 1060 + Math.sin(frame * 0.8 + s) * 10,
            width: 40,
            height: 90,
            borderLeft: s < 0 ? `8px solid ${p.blueSoft}` : undefined,
            borderRight: s > 0 ? `8px solid ${p.blueSoft}` : undefined,
            borderRadius: 40,
            opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.5)) * ramp,
          }}
        />
      ))}
    </SceneBg>
  );
};
