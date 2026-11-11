import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { AppLoader, appPct, appSpin } from "../components/AppLoader";
import { type WedstrijdProps, wordAt } from "../schema";

// Hook headline has 4 words: start early so frame 0 already shows most of it.
export const HOOK_T = {
  headlineStagger: 3,
  headlineDelay: -16,
  card: 0,
  chores: [wordAt("downloaden") - 4, wordAt("voor") , wordAt("rekeningen") - 2, wordAt("rekeningen") + 8],
  heavy: wordAt("rekeningen") + 12,
};

export const HookScene: React.FC<{ props: WedstrijdProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const pct = appPct(frame);
  const sh = shake(frame, HOOK_T.heavy, 14, 10);
  // The card sags a little under every chore it adds.
  const sag = HOOK_T.chores.reduce((acc, at) => acc + pop(frame, fps, at, springs.bouncy) * 6, 0);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={HOOK_T.headlineDelay} stagger={HOOK_T.headlineStagger} />
      <Stage offsetY={50}>
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 40 + sag,
            width: 860,
            borderRadius: 56,
            background: p.white,
            boxShadow: "0 30px 80px rgba(1, 40, 160, 0.14)",
            padding: "44px 48px 40px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
            <AppLoader size={150} pct={pct} spin={appSpin(frame)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 44, fontWeight: 600, color: p.ink }}>{props.appName}</div>
              <div style={{ fontSize: 34, color: p.greyText, marginTop: 6 }}>
                {props.installing}
                {".".repeat(1 + (Math.floor(frame / 8) % 3))}
              </div>
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 72,
                letterSpacing: headlineTracking,
                color: p.greyText,
              }}
            >
              {Math.floor(pct)}%
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 22, borderRadius: 11, background: p.grey, marginTop: 34, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 11, background: p.greyText }} />
          </div>
          {/* Chores pile up */}
          <div style={{ marginTop: 26 }}>
            {props.chores.map((c, i) => {
              const s = pop(frame, fps, HOOK_T.chores[i], springs.pop);
              const h = interpolate(s, [0, 1], [0, 104], clamp);
              return (
                <div key={i} style={{ height: h, overflow: "hidden" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 26,
                      height: 88,
                      marginTop: 16,
                      padding: "0 28px",
                      borderRadius: 26,
                      background: p.light,
                      border: `3px solid ${p.grey}`,
                      fontSize: 38,
                      color: p.ink,
                      opacity: Math.min(1, s * 1.5),
                      transform: `translateX(${(1 - s) * 80}px)`,
                    }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 12, border: `4px solid ${p.greyText}`, boxSizing: "border-box" }} />
                    {c}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
