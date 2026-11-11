import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Piggy, PIGGY_H, PIGGY_W, SLOT } from "../components/Piggy";
import { type SpaarpotProps, wordAt } from "../schema";

// Myth: "Weer een abonnement? Zonde van je geld."
export const HOOK_T = {
  tag: -14,
  zonde: wordAt("zonde"),
  geld: wordAt("geld"),
};

const PX = 540 - PIGGY_W / 2;
const PY = 470;

export const HookScene: React.FC<{ props: SpaarpotProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const tagIn = pop(frame, fps, HOOK_T.tag, springs.bouncy);
  // The tag swings on its string, then jerks back when the voice says "Zonde".
  const swing = Math.sin(frame / 7) * 10 * Math.exp(-Math.max(0, frame - HOOK_T.tag) / 40);
  const jerk = interpolate(frame, [HOOK_T.zonde, HOOK_T.zonde + 6, HOOK_T.zonde + 18], [0, -16, -10], clamp);
  const lift = interpolate(frame, [HOOK_T.zonde, HOOK_T.zonde + 10], [0, -60], clamp);
  const sh = shake(frame, HOOK_T.zonde, 16, 10);
  const strike = interpolate(frame, [HOOK_T.geld, HOOK_T.geld + 8], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-12} stagger={2} />
      <Stage>
        {/* string */}
        <div
          style={{
            position: "absolute",
            left: 538,
            top: -40,
            width: 4,
            height: 140 + lift,
            background: p.greyText,
            opacity: tagIn,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - 190,
            top: 90 + lift - (1 - tagIn) * 80,
            opacity: Math.min(1, tagIn * 1.5),
            width: 380,
            height: 250,
            transformOrigin: "50% -60px",
            transform: `rotate(${swing + jerk}deg)`,
          }}
        >
          <div
            style={{
              width: 380,
              height: 250,
              borderRadius: 40,
              background: p.yellow,
              boxShadow: "0 24px 60px rgba(1,40,160,0.16)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: 22, width: 30, height: 30, borderRadius: "50%", background: p.light }} />
            <div
              style={{
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 120,
                letterSpacing: headlineTracking,
                color: p.ink,
                marginTop: 34,
                lineHeight: 1,
                position: "relative",
              }}
            >
              {props.tag}
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  right: -10,
                  top: "52%",
                  height: 12,
                  borderRadius: 6,
                  background: p.red,
                  transform: `scaleX(${strike})`,
                  transformOrigin: "0 50%",
                }}
              />
            </div>
            <div style={{ fontFamily: fonts.display, fontSize: 40, color: p.ink, opacity: 0.7 }}>{props.tagSub}</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: PX + sh.x, top: PY + sh.y, transform: `rotate(${sh.r}deg)` }}>
          <Piggy body={p.blueMid} shade={p.blue} slot={p.ink} />
        </div>
        <div
          style={{
            position: "absolute",
            left: PX + SLOT.x - 260,
            width: 520,
            top: PY + PIGGY_H + 10,
            height: 30,
            borderRadius: "50%",
            background: "rgba(1,40,160,0.10)",
          }}
        />
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={HOOK_T.zonde} />
    </SceneBg>
  );
};
