import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { IceSpray, SkaterBuddy } from "../components/SkaterBuddy";
import type { IjsProps } from "../schema";
import { VOICE_END, wordAt } from "../vo";

export const ctaBeats = (start: number) => ({
  tagline: wordAt("zo") - start - 2, // "ZO sta je": first line
  tagStagger: 3,
  line2: wordAt("vaste") - start - 5, // "op VASTE grond": second line
  button: wordAt("zo") - start + 10,
  skateIn: wordAt("vaste") - start - 8, // Buddy skates in from the right
  stop: wordAt("grond") - start, // "GROND": hockey stop, ice turns solid
  subline: wordAt("grond") - start - 8,
  logo: wordAt("grond") - start + 6,
  happy: wordAt("grond") - start + 12,
  tap: VOICE_END - start + 2, // right after the last word
});

const FEET = 680;
const BUDDY = 230;

export const CtaScene: React.FC<{ props: IjsProps["cta"]; start: number }> = ({ props, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const B = ctaBeats(start);

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  const wordDelay = (li: number, i: number) =>
    li === 0 ? B.tagline + i * B.tagStagger : i < lines[1].length - 1 ? B.line2 + i * 3 : B.stop - 3;

  const btnIn = pop(frame, fps, B.button, springs.bouncy);
  const arrowIn = pop(frame, fps, B.button + 6, springs.pop);
  const tap = interpolate(frame, [B.tap, B.tap + 3, B.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [B.tap + 1, B.tap + 18], [0, 1], clamp);
  const nudge = frame > B.button + 14 ? Math.max(0, Math.sin((frame - B.button - 14) / 4)) * 8 : 0;

  const skate = interpolate(frame, [B.skateIn, B.stop], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bx = interpolate(skate, [0, 1], [1300, 540]);
  const lean = frame < B.stop ? -10 + Math.sin(frame / 3) * 5 * (1 - skate) : interpolate(frame, [B.stop, B.stop + 4, B.stop + 12], [-10, 16, 0], clamp);
  const settle = interpolate(frame, [B.stop + 2, B.stop + 6, B.stop + 12], [1, 0.84, 1], clamp);
  const spray = interpolate(frame, [B.stop, B.stop + 16], [0, 1], clamp);
  // "vaste grond": a solid block grows out from under Buddy's skates
  const solid = interpolate(frame, [B.stop, B.stop + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const happy = frame >= B.happy && frame < B.happy + 16 ? 0.18 : blinkScale(frame, [B.happy + 26]);

  const subIn = interpolate(frame, [B.subline, B.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, B.logo, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 10,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 1.2,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, wordDelay(li, i), springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: li === 0 ? p.white : p.blueSoft,
                      opacity: Math.min(1, s * 1.4),
                      transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                      filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                    }}
                  >
                    {w}
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>

      <Stage offsetY={50}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 110,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrowIn} arrowNudge={nudge} />
            <div
              style={{
                position: "absolute",
                left: CTA_H / 2 - 90,
                top: CTA_H / 2 - 90,
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: `5px solid ${p.white}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
                transform: `scale(${0.3 + ripple * 1.2})`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 290,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            letterSpacing: "0.01em",
            color: p.blueText,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 20}px)`,
          }}
        >
          {props.subline}
        </div>

        {/* ice lane, and the solid ground that grows under Buddy */}
        <div style={{ position: "absolute", left: -40, right: -40, top: FEET - 4, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.16)" }} />
        <div
          style={{
            position: "absolute",
            left: 540 - 230 * solid,
            width: 460 * solid,
            top: FEET - 4,
            height: 40,
            borderRadius: 14,
            background: p.blueSoft,
            opacity: solid > 0 ? 1 : 0,
          }}
        />
        <SkaterBuddy
          size={BUDDY}
          x={bx}
          feetY={FEET}
          body={p.white}
          eye={p.blueMascot}
          beanie={p.blueSoft}
          blade={p.white}
          lean={lean}
          squash={settle}
          blink={happy}
          look={{ x: frame < B.stop ? -0.6 : 0, y: 0.2 }}
          flip={false}
        />
        <IceSpray x={bx - 70} y={FEET} progress={spray} color={p.white} dir={1} />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 770,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={110} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
