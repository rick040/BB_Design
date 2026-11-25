import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Keyring } from "../components/Keyring";
import { SCENE_STARTS, type SleutelbosProps, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  buddyIn: S - 4,
  toss: S + 2, // Buddy tosses your key ring back up...
  hang: wordAt("sleutels", 2), // ...and it lands on your own hook
  button: wordAt("activeer"),
  logo: wordAt("activeer") + 6,
  subline: wordAt("activeer") + 12,
  tap: VOICE_END - 2,
};
const SPOKEN = [wordAt("houd"), wordAt("je", 3), wordAt("sleutels", 2)];

const BUDDY = 190;
const FEET = 330;
const HOOK = { x: 800, y: 40 };
const SCALE = 0.62;

export const CtaScene: React.FC<{ props: SleutelbosProps["cta"]; keys: string[] }> = ({ props, keys }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  // Toss arc from Buddy (370, 220) up and over onto the hook.
  const u = interpolate(frame, [CTA_T.toss, CTA_T.hang], [0, 1], clamp);
  const ringX = interpolate(u, [0, 1], [400, HOOK.x]);
  const ringY = interpolate(u, [0, 1], [200, HOOK.y + 30]) - Math.sin(u * Math.PI) * 240;
  const land = frame - CTA_T.hang;
  const swing = land >= 0 ? 22 * Math.exp(-land / 12) * Math.sin(land / 2.2) : 720 * u;
  const tossSq = interpolate(frame, [CTA_T.toss - 4, CTA_T.toss, CTA_T.toss + 6], [1, 0.84, 1], clamp);
  const hop = interpolate(frame, [CTA_T.hang, CTA_T.hang + 6, CTA_T.hang + 14], [0, -60, 0], clamp);
  const happy = frame > CTA_T.hang + 8 ? 0.2 : blinkScale(frame, [CTA_T.toss + 10]);

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

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
              const at = SPOKEN[wi] ?? SPOKEN[SPOKEN.length - 1];
              wi++;
              const s = pop(frame, fps, at - 3, springs.pop);
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

      <Stage offsetY={40}>
        {/* your own key hook */}
        <div
          style={{
            position: "absolute",
            left: HOOK.x - 120,
            top: HOOK.y - 30,
            width: 240,
            height: 36,
            borderRadius: 18,
            background: p.blueSoft,
            opacity: Math.min(1, buddyIn * 2),
          }}
        />
        <svg
          width={60}
          height={80}
          viewBox="0 0 60 80"
          style={{ position: "absolute", left: HOOK.x - 30, top: HOOK.y, opacity: Math.min(1, buddyIn * 2) }}
        >
          <path d="M30 0 V40 Q30 62 48 56" fill="none" stroke={p.blueSoft} strokeWidth={12} strokeLinecap="round" />
        </svg>
        <Keyring
          tags={keys}
          swing={swing}
          tagsIn={0}
          style={{
            left: ringX - 300,
            top: ringY - 70,
            transform: `scale(${SCALE})`,
            transformOrigin: "300px 70px",
            opacity: Math.min(1, buddyIn * 2),
          }}
        />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={happy}
          squash={frame < CTA_T.buddyIn + 12 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : tossSq}
          look={frame < CTA_T.hang ? { x: 0.7 * u + 0.2, y: -0.8 } : { x: 0.6, y: -0.4 }}
          style={{
            position: "absolute",
            left: 330 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO + hop,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 420,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrowIn} />
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
            top: 610,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            color: p.blueText,
            opacity: subIn,
          }}
        >
          {props.subline}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 730,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
