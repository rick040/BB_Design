import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { FieldCard, GlassDrawer } from "../components/Glass";
import { type GlaslaProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[1];
export const DRAWER_T = {
  headline: S - 4,
  headlineStagger: 5,
  pull: S,
  pullLen: 14,
  fields: wordAt("jij"),
  fieldStagger: 6,
  subline: wordAt("doorstuurt") + 10,
};

const DW = 820;
const DH = 600;
const TOP = 110;

export const DrawerScene: React.FC<{ props: GlaslaProps["drawer"]; fields: GlaslaProps["fields"] }> = ({ props, fields }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const open = interpolate(frame, [DRAWER_T.pull, DRAWER_T.pull + DRAWER_T.pullLen], [0, 1], clamp);
  const pullSq = interpolate(frame, [DRAWER_T.pull - 2, DRAWER_T.pull + 4, DRAWER_T.pull + DRAWER_T.pullLen + 6], [1, 0.8, 1], clamp);
  const lastField = DRAWER_T.fields + 3 * DRAWER_T.fieldStagger;
  const happy = frame > lastField + 10 && frame < lastField + 22 ? 0.18 : blinkScale(frame, [S + 30]);
  const rim = 40 + open * 70;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={DRAWER_T.headline} stagger={DRAWER_T.headlineStagger} />
      <Stage offsetY={10}>
        <GlassDrawer
          width={DW}
          height={DH}
          frost={0}
          open={open}
          edge={p.white}
          backdrop={p.blue}
          style={{ left: (1080 - DW) / 2, top: TOP - 40 }}
        >
          {fields.map((f, i) => {
            const s = pop(frame, fps, DRAWER_T.fields + i * DRAWER_T.fieldStagger, springs.pop);
            return (
              <FieldCard
                key={i}
                label={f.label}
                value={f.value}
                width={DW - 120}
                style={{
                  left: 54,
                  top: 90 + i * 118,
                  opacity: Math.min(1, s * 2),
                  transform: `translateY(${(1 - s) * -260}px) rotate(${(1 - s) * (i % 2 ? 6 : -6)}deg)`,
                }}
              />
            );
          })}
        </GlassDrawer>
        {/* Buddy on the rim, leaning back as he pulls the drawer out */}
        <Buddy
          size={170}
          body={p.white}
          eye={p.blueMascot}
          squash={pullSq}
          blink={happy}
          look={{ x: 0, y: frame > DRAWER_T.fields - 4 ? 0.9 : -0.2 }}
          style={{
            position: "absolute",
            left: 540 - 85,
            top: TOP - 40 + rim - 170 * BUDDY_RATIO + 22,
            transform: `rotate(${interpolate(open, [0, 0.5, 1], [0, -10, 0])}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={DRAWER_T.subline} />
    </SceneBg>
  );
};
