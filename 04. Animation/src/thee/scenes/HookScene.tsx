import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Mug } from "../components/Mug";
import type { TheeProps } from "../schema";

// Timeline (frames, scene-local; scene 1 starts at frame 0 of the video).
export const HOOK_T = {
  lying2: 44, // chip "Ligt er 1 week" ("hoe langer")
  subline: 50, // "Hoe langer hij ligt, hoe bitterder."
  lying3: 70, // chip "Ligt er 3 weken" ("laat liggen")
  red: 84, // tag turns into "Aanmaning", mug shakes
  cost: 100, // chip "Kan uitlopen op €40" ("bitterder")
  steepLen: 100, // duration: tea goes from fresh to bitter
};

export const HookScene: React.FC<{ props: TheeProps["hook"]; bill: TheeProps["bill"]; tea: TheeProps["tea"] }> = ({
  props,
  bill,
  tea,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const steep = interpolate(frame, [0, HOOK_T.steepLen], [0.1, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const step = frame < HOOK_T.lying2 ? 0 : frame < HOOK_T.lying3 ? 1 : 2;
  const stepAt = [0, HOOK_T.lying2, HOOK_T.lying3][step];
  const chipPop = step === 0 ? 1 : pop(frame, fps, stepAt, springs.bouncy);
  const red = frame >= HOOK_T.red;
  const sh = shake(frame, HOOK_T.red, 14, 14);
  const cost = pop(frame, fps, HOOK_T.cost, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-30} stagger={3} />
      <Stage>
        {/* time-passing chip */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 40,
            padding: "16px 26px",
            borderRadius: 999,
            background: step === 2 ? p.yellow : p.grey,
            color: "#1b1b2e",
            fontFamily: fonts.ui,
            fontSize: 36,
            fontWeight: 600,
            transform: `scale(${0.8 + 0.2 * chipPop}) rotate(-3deg)`,
            transformOrigin: "0% 50%",
          }}
        >
          {props.lying[step]}
        </div>

        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg)` }}>
          <Mug
            steep={steep}
            fresh={tea.fresh}
            bitter={tea.bitter}
            cup="#ffffff"
            outline={p.blue}
            tag={{ line1: red ? props.reminderLabel : bill.sender.slice(0, 7), line2: bill.amount, red, redColor: p.red }}
            steam={1}
            steamPhase={frame}
            scale={1.45}
            style={{ left: 270, top: 380 }}
          />
        </div>

        {/* cost chip */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 775,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, cost * 2),
            transform: `scale(${0.6 + 0.4 * cost})`,
          }}
        >
          <div
            style={{
              padding: "18px 34px",
              borderRadius: 999,
              background: p.red,
              color: "#ffffff",
              fontFamily: fonts.ui,
              fontSize: 42,
              fontWeight: 700,
              boxShadow: "0 14px 34px rgba(255,90,121,0.35)",
            }}
          >
            {props.costChip}
          </div>
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={HOOK_T.subline} />
    </SceneBg>
  );
};
