import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg } from "../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Envelope } from "../components/parts";
import { type DeurmatProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const BUDDY_T = {
  buddyIn: S + 2,
  fly0: wordAt("door") - 2, // envelopes fly into Buddy one by one
  flyStagger: 5,
  flyLen: 12,
  swap: wordAt("hij") - 4, // headline swaps to the agenda line
  rows: wordAt("zet"), // agenda rows pop in
  rowStagger: 4,
};
const SPOKEN1 = [wordAt("stuur"), wordAt("ze"), wordAt("door"), wordAt("naar"), wordAt("buddy")];
const SPOKEN2 = [wordAt("hij"), wordAt("zet"), wordAt("ze", 2), wordAt("in"), wordAt("je"), wordAt("agenda")];

const BUDDY = 230;
const FEET = 1030;
const MOUTH = { x: 540, y: FEET - BUDDY * BUDDY_RATIO * 0.55 };

import { SpokenHeadline } from "../components/parts";

export const BuddyScene: React.FC<{ props: DeurmatProps["buddy"]; bills: DeurmatProps["bills"] }> = ({
  props,
  bills,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const inP = pop(frame, fps, BUDDY_T.buddyIn, springs.bouncy);
  const gulps = bills.map((_, i) => BUDDY_T.fly0 + i * BUDDY_T.flyStagger + BUDDY_T.flyLen);
  const sq = Math.min(
    interpolate(inP, [0, 0.6, 1], [0.6, 1.1, 1]),
    ...gulps.map((g) => interpolate(frame, [g - 1, g + 2, g + 7], [1, 1.12, 1], clamp)),
  );
  const look = frame < BUDDY_T.fly0 ? { x: -0.5, y: 0.6 } : frame < BUDDY_T.rows ? { x: -0.3, y: 0.8 } : { x: 0, y: 1 };

  return (
    <SceneBg color={p.light}>
      <SpokenHeadline text={props.headline} at={SPOKEN1} c1={p.blue} c2={p.blue} top={250} size={104} fadeOutAt={BUDDY_T.swap} />
      {frame >= BUDDY_T.swap ? (
        <SpokenHeadline text={props.headline2} at={SPOKEN2} c1={p.blue} c2={p.blue} top={250} size={104} />
      ) : null}

      <Buddy
        size={BUDDY}
        body={p.blueMascot}
        eye={p.white}
        squash={sq}
        look={look}
        blink={blinkScale(frame, [BUDDY_T.rows + 20])}
        style={{
          position: "absolute",
          left: 540 - BUDDY / 2,
          top: FEET - BUDDY * BUDDY_RATIO,
          opacity: Math.min(1, inP * 3),
          transformOrigin: "50% 100%",
        }}
      />

      {/* envelopes fly from the mat (bottom left) into Buddy */}
      {bills.map((b, i) => {
        const s = BUDDY_T.fly0 + i * BUDDY_T.flyStagger;
        const u = interpolate(frame, [s, s + BUDDY_T.flyLen], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
        if (u >= 1) return null;
        const x0 = 230 + i * 30;
        const y0 = 1560 - i * 26;
        const x = x0 + (MOUTH.x - x0) * u;
        const y = y0 + (MOUTH.y - y0) * u - Math.sin(Math.PI * u) * 260;
        const sc = 0.55 * (1 - 0.8 * u);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 235,
              top: y - 135,
              transform: `rotate(${(1 - u) * -10 + u * 30}deg) scale(${sc})`,
              zIndex: 5,
              opacity: frame < S + 2 ? 0 : 1,
            }}
          >
            <Envelope sender={b.sender} due={b.due} />
          </div>
        );
      })}

      {/* agenda rows */}
      <div style={{ position: "absolute", left: 150, right: 150, top: 1090 }}>
        {bills.map((b, i) => {
          const r = pop(frame, fps, BUDDY_T.rows + i * BUDDY_T.rowStagger, springs.pop);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                height: 80,
                marginBottom: 14,
                background: p.white,
                borderRadius: 20,
                boxShadow: "0 8px 24px rgba(1, 20, 90, 0.10)",
                fontFamily: fonts.ui,
                opacity: Math.min(1, r * 2),
                transform: `translateY(${(1 - r) * -50}px) scale(${0.85 + 0.15 * r})`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 170,
                  height: "100%",
                  background: p.blueMid,
                  color: p.white,
                  fontWeight: 600,
                  fontSize: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {b.date}
              </div>
              <div style={{ paddingLeft: 28, fontSize: 34, fontWeight: 500, color: p.ink }}>{b.sender}</div>
            </div>
          );
        })}
      </div>
    </SceneBg>
  );
};
