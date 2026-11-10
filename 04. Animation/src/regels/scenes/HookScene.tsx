import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Sparkle } from "../components/Ruler";
import { type RegelsProps, wordAt } from "../schema";

// Absolute frames; the myth tag lands on the spoken "AI?".
export const HOOK_T = {
  chip: wordAt("ai") - 10,
  myth: wordAt("ai"),
};

const BUDDY = 400;
const FEET = 900;

export const HookScene: React.FC<{ props: RegelsProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const buddyIn = pop(frame, fps, -8, springs.bouncy);
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.pop);
  const mythIn = pop(frame, fps, HOOK_T.myth, springs.bouncy);
  const head = FEET - BUDDY * BUDDY_RATIO;
  // Sparkles orbit Buddy: the cliché picture of "AI".
  const orbit = [0, 1, 2, 3].map((i) => {
    const a = frame * 0.06 + (i * Math.PI) / 2;
    return { x: 540 + Math.cos(a) * 340, y: head + 160 + Math.sin(a) * 120, s: 70 + (i % 2) * 34, z: Math.sin(a) };
  });
  const tilt = interpolate(frame, [HOOK_T.myth, HOOK_T.myth + 10], [0, -8], clamp);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-12} stagger={2} />
      <Stage>
        {orbit.map((o, i) => (
          <Sparkle
            key={i}
            size={o.s}
            color={i % 2 ? p.blueSoft : p.blueMid}
            style={{
              position: "absolute",
              left: o.x - o.s / 2,
              top: o.y - o.s / 2,
              opacity: Math.min(1, buddyIn) * (0.55 + 0.45 * (o.z + 1) / 2),
              transform: `rotate(${frame * 2 + i * 20}deg) scale(${0.8 + 0.2 * o.z})`,
            }}
          />
        ))}
        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blinkScale(frame, [30])}
          look={{ x: frame > HOOK_T.myth ? 0.6 : -0.2, y: -0.5 }}
          squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.08, 1])}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: head,
            transformOrigin: "50% 100%",
            transform: `scale(${0.5 + 0.5 * Math.min(1, buddyIn)})`,
          }}
        />
        {/* "AI" chip floating above Buddy's head like a halo. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: head - 150,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `translateY(${Math.sin(frame / 8) * 8}px) scale(${0.5 + 0.5 * chipIn})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: p.blue,
              color: p.white,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 72,
              padding: "14px 40px",
              borderRadius: 60,
              boxShadow: "0 20px 50px rgba(1, 59, 255, 0.3)",
            }}
          >
            <Sparkle size={52} color={p.yellow} />
            {props.aiChip}
          </div>
        </div>
        {/* Myth tag, slapped on at "AI?". */}
        <div
          style={{
            position: "absolute",
            left: 640,
            top: head - 250,
            opacity: Math.min(1, mythIn * 2),
            transform: `rotate(${12 + tilt}deg) scale(${1.6 - 0.6 * mythIn})`,
            transformOrigin: "50% 50%",
            background: p.yellow,
            color: p.ink,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 62,
            padding: "12px 34px",
            borderRadius: 18,
            boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
          }}
        >
          {props.mythTag}
        </div>
      </Stage>
    </SceneBg>
  );
};
