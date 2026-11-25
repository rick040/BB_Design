import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Keyring } from "../components/Keyring";
import { SCENE_STARTS, type SleutelbosProps, wordAt } from "../schema";

const S = SCENE_STARTS[1];
export const REFUSE_T = {
  headline: S - 4,
  ringDown: S, // the key ring is held out to Buddy
  shake: wordAt("hoeft"), // Buddy shakes his head
  push: wordAt("sleutels"), // ...and bumps the ring away
  mailIn: wordAt("alleen"), // one forwarded mail flies in
  swallow: wordAt("door"), // Buddy takes that one
  subline: wordAt("jij"),
};

const BUDDY = 250;
const FEET = 830;

export const RefuseScene: React.FC<{ props: SleutelbosProps["refuse"]; keys: string[] }> = ({ props, keys }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const down = pop(frame, fps, REFUSE_T.ringDown, springs.smooth);
  const away = interpolate(frame, [REFUSE_T.push, REFUSE_T.push + 16], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const ringX = -420 + 960 * down - 1100 * away;
  const ringY = 40 - 200 * away;
  const swing = 6 * Math.sin(frame / 7) + 40 * away;

  const shakeT = frame - REFUSE_T.shake;
  const shakeLook = shakeT >= 0 && shakeT < 16 ? Math.sin(shakeT * 0.8) * 0.9 : 0;
  const hop = interpolate(frame, [REFUSE_T.push - 3, REFUSE_T.push + 3, REFUSE_T.push + 10], [0, -70, 0], clamp);
  const pushSq = interpolate(frame, [REFUSE_T.push - 6, REFUSE_T.push - 3, REFUSE_T.push + 3], [1, 0.82, 1.08], clamp);

  const m = interpolate(frame, [REFUSE_T.mailIn, REFUSE_T.mailIn + 18], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const gulp = interpolate(frame, [REFUSE_T.swallow - 4, REFUSE_T.swallow + 4], [0, 1], clamp);
  const mailX = interpolate(m, [0, 1], [1300, 540]);
  const mailY = interpolate(gulp, [0, 1], [380, FEET - 120]);
  const gulpSq = interpolate(frame, [REFUSE_T.swallow + 2, REFUSE_T.swallow + 6, REFUSE_T.swallow + 14], [1, 0.8, 1], clamp);
  const buddyIn = pop(frame, fps, S - 2, springs.bouncy);

  const look =
    frame < REFUSE_T.mailIn
      ? { x: shakeLook, y: -0.6 }
      : { x: interpolate(m, [0, 1], [0.9, 0]), y: interpolate(gulp, [0, 1], [-0.7, 0.2]) };

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={REFUSE_T.headline} stagger={2} />
      <Stage>
        <Keyring
          tags={keys}
          swing={swing}
          style={{ left: ringX - 300, top: ringY, transform: `scale(1.05) rotate(${-50 * away}deg)`, transformOrigin: "300px 70px" }}
        />
        {/* the one forwarded mail */}
        <div
          style={{
            position: "absolute",
            left: mailX - 300,
            top: mailY - 80,
            width: 600,
            height: 170,
            borderRadius: 32,
            background: p.white,
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "0 30px",
            boxSizing: "border-box",
            boxShadow: "0 24px 60px rgba(0, 20, 120, 0.3)",
            transform: `scale(${1 - 0.85 * gulp}) rotate(${(1 - m) * 12}deg)`,
            opacity: frame < REFUSE_T.mailIn ? 0 : 1 - Math.max(0, gulp - 0.8) * 5,
          }}
        >
          <svg width={84} height={64} viewBox="0 0 84 64">
            <rect x={3} y={3} width={78} height={58} rx={10} fill={p.blueSoft} stroke={p.blue} strokeWidth={5} />
            <path d="M6 8 L42 36 L78 8" fill="none" stroke={p.blue} strokeWidth={5} strokeLinejoin="round" />
          </svg>
          <div style={{ fontFamily: fonts.ui, lineHeight: 1.15 }}>
            <div style={{ fontSize: 34, fontWeight: 600, color: "#111114" }}>{props.mailFrom}</div>
            <div style={{ fontSize: 28, color: "#6b6b78" }}>Fwd: {props.mailSubject}</div>
          </div>
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [REFUSE_T.shake - 8, REFUSE_T.swallow + 10])}
          look={look}
          squash={frame < S + 14 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : Math.min(pushSq, gulpSq)}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO + hop,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={REFUSE_T.subline} />
    </SceneBg>
  );
};
