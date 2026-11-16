import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { type ZakmesProps, wordAt } from "../schema";

// Absolute frames. The install card is already on screen at frame 0; the
// sign-up chores pile up while "voor je rekeningen" is spoken.
export const HOOK_T = {
  step1: 4,
  step2: wordAt("voor") - 2,
  step3: wordAt("rekeningen") + 2,
  stuck: wordAt("rekeningen") + 14, // last chore shakes, bar stays stuck
};

const CARD_W = 820;

export const HookScene: React.FC<{ props: ZakmesProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const pct = Math.round(interpolate(frame, [0, HOOK_T.stuck], [9, 12], clamp));
  const steps = [HOOK_T.step1, HOOK_T.step2, HOOK_T.step3];
  const sh = shake(frame, HOOK_T.stuck, 14, 14);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-18} stagger={2} />
      <Stage offsetY={30}>
        {/* install card */}
        <div
          style={{
            position: "absolute",
            left: 540 - CARD_W / 2,
            top: 40,
            width: CARD_W,
            height: 250,
            borderRadius: 48,
            background: p.white,
            boxShadow: "0 30px 80px rgba(1, 59, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: 40,
            padding: "0 48px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 38,
              background: p.grey,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 84,
              color: "#9aa3b2",
              flexShrink: 0,
            }}
          >
            €
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 52, color: p.ink }}>{props.appName}</div>
            <div style={{ fontFamily: fonts.ui, fontSize: 36, color: p.greyText, marginTop: 6 }}>
              {props.progressLabel} {pct}%
            </div>
            <div style={{ marginTop: 18, height: 16, borderRadius: 8, background: p.grey, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "#9aa3b2", borderRadius: 8 }} />
            </div>
          </div>
        </div>

        {/* chores pile up */}
        {props.steps.map((s, i) => {
          const at = steps[i];
          const k = pop(frame, fps, at, springs.pop);
          const last = i === props.steps.length - 1;
          const tilt = [-3, 2.5, -1.5][i];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 350 + i * 165,
                display: "flex",
                justifyContent: "center",
                opacity: Math.min(1, k * 2),
                transform: `translate(${last ? sh.x : 0}px, ${(1 - k) * -40}px) rotate(${tilt + (last ? sh.r * 3 : 0)}deg) scale(${0.85 + 0.15 * k})`,
              }}
            >
              <div
                style={{
                  background: p.red,
                  color: "#fff",
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 56,
                  padding: "30px 56px",
                  borderRadius: 32,
                  boxShadow: "0 20px 50px rgba(17, 24, 39, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                }}
              >
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "4px solid rgba(255,255,255,0.7)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                  }}
                >
                  {i + 1}
                </span>
                {s}
              </div>
            </div>
          );
        })}
      </Stage>
    </SceneBg>
  );
};
