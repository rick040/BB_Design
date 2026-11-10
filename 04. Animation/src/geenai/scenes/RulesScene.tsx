import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { DOC_H, DOC_W, FIELDS, InvoiceDoc } from "../components/InvoiceDoc";
import { Stencil } from "../components/Stencil";
import { type GeenAiProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
// Absolute frames. Buddy slams a stencil on the bill; only four holes, one rule each.
export const RULES_T = {
  hop: S + 4, // Buddy hops up
  plate: wordAt("vaste"), // stencil plate lands on the bill
  amount: wordAt("bedrag"), // hole 1 lights
  due: wordAt("vervaldatum"), // hole 2
  link: wordAt("betaallink"), // hole 3
  ref: wordAt("kenmerk"), // hole 4
};
const LIGHT = [RULES_T.amount, RULES_T.due, RULES_T.link, RULES_T.ref];

const DOC_X = (1080 - DOC_W) / 2;
const DOC_Y = 20;
const BUDDY = 120;
const FEET = 1072;

export const RulesScene: React.FC<{ props: GeenAiProps["rules"]; invoice: GeenAiProps["invoice"] }> = ({ props, invoice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const plate = pop(frame, fps, RULES_T.plate - 6, { damping: 14, stiffness: 220, mass: 0.6 });
  const thud = interpolate(frame, [RULES_T.plate, RULES_T.plate + 3, RULES_T.plate + 10], [0, 1, 0], clamp);
  const lit = LIGHT.map((t) => pop(frame, fps, t - 2, springs.pop));

  // Buddy: hop on the cue, land as the plate lands, then look at each hole.
  const hopT = interpolate(frame, [RULES_T.hop, RULES_T.plate], [0, 1], clamp);
  const hopY = -Math.sin(Math.PI * hopT) * 120;
  const landSq = interpolate(frame, [RULES_T.plate, RULES_T.plate + 3, RULES_T.plate + 10], [1, 0.8, 1], clamp);
  const preSq = interpolate(frame, [RULES_T.hop - 4, RULES_T.hop, RULES_T.hop + 4], [1, 0.85, 1.08], clamp);
  const squash = frame < RULES_T.plate ? preSq : landSq;
  let target = 0;
  for (let i = 0; i < LIGHT.length; i++) if (frame >= LIGHT[i] - 2) target = i;
  const lookY = frame < RULES_T.amount - 2 ? -0.6 : -1 + target * 0.12;
  const lookX = frame < RULES_T.amount - 2 ? 0 : -0.55;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={S - 4} stagger={12} />
      <Stage offsetY={0}>
        <div style={{ position: "absolute", left: 0, top: thud * 6, width: 1080, height: 900, transform: "scale(1.12)", transformOrigin: "50% 0%" }}>
          <InvoiceDoc invoice={invoice} style={{ left: DOC_X, top: DOC_Y }} />
          <Stencil
            w={DOC_W}
            h={DOC_H}
            holes={FIELDS}
            color={p.blue}
            lit={lit}
            labels={props.ruleLabels}
            style={{
              left: DOC_X,
              top: DOC_Y,
              opacity: Math.min(1, plate * 2.5),
              transform: `scale(${1.25 - 0.25 * plate})`,
              filter: `drop-shadow(0 ${30 * (1 - plate) + 12}px ${40 * (1 - plate) + 20}px rgba(1,59,255,0.3))`,
            }}
          />
        </div>
        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blinkScale(frame, [RULES_T.ref + 16])}
          squash={squash}
          look={{ x: lookX, y: lookY }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO + hopY,
          }}
        />
      </Stage>
    </SceneBg>
  );
};
