import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { FieldCard, GlassDrawer } from "../components/Glass";
import { type GlaslaProps, wordAt } from "../schema";

// Frame 0 already shows most of the question (cover frame).
export const HOOK_T = {
  headline: -24,
  headlineStagger: 3,
  buddy: wordAt("buddy"),
  lookAtYou: wordAt("jou"),
};

const DW = 820;
const DH = 600;

export const HookScene: React.FC<{ props: GlaslaProps["hook"]; fields: GlaslaProps["fields"] }> = ({ props, fields }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const drawerIn = pop(frame + 12, fps, 0, springs.smooth);
  const buddyIn = pop(frame, fps, HOOK_T.buddy - 4, springs.bouncy);
  const lookX = interpolate(frame, [HOOK_T.buddy + 2, HOOK_T.buddy + 8, HOOK_T.lookAtYou, HOOK_T.lookAtYou + 5], [0, -1, -1, 0], clamp);
  const wobble = Math.sin(frame / 5) * 2;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={HOOK_T.headline} stagger={HOOK_T.headlineStagger} />
      <Stage offsetY={20}>
        <GlassDrawer
          width={DW}
          height={DH}
          frost={1}
          edge={p.blue}
          backdrop={p.light}
          label={props.frontLabel}
          labelColor={p.blue}
          style={{ left: (1080 - DW) / 2, top: 120, transform: `translateY(${(1 - drawerIn) * 80}px) rotate(${wobble * 0.2}deg)` }}
        >
          {fields.map((f, i) => (
            <FieldCard key={i} label={f.label} value={f.value} width={DW - 120} style={{ left: 54, top: 100 + i * 118 }} />
          ))}
        </GlassDrawer>
        <Buddy
          size={190}
          body={p.blueMascot}
          eye={p.white}
          look={{ x: lookX, y: lookX < -0.5 ? 0.4 : 0 }}
          blink={blinkScale(frame, [40])}
          squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.12, 1])}
          style={{
            position: "absolute",
            left: 540 + DW / 2 - 150,
            top: 120 + 30 - 190 * BUDDY_RATIO + 20,
            opacity: Math.min(1, buddyIn * 3),
            transform: `translateY(${(1 - buddyIn) * 120}px)`,
          }}
        />
      </Stage>
    </SceneBg>
  );
};
