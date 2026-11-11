import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { NOTA_H, NOTA_W, NotaCard, NumberTag } from "../components/Parts";
import { SCENE_STARTS, type WachtkamerProps, wordAt } from "../schema";

const S = SCENE_STARTS[1];
export const FORWARD_T = {
  button: S - 2, // knop Doorsturen staat er
  tap: wordAt("door") - 3, // tik op "door"
  slideIn: wordAt("door") + 1, // nota's schuiven de rij in
  slideStagger: 4,
  buddy: wordAt("buddy") - 4, // Buddy springt op "Buddy"
  tag: wordAt("buddy"), // eerste wachtnummer
  tagStagger: 5,
};

const SCALE = 0.78;
const W = NOTA_W * SCALE;
const H = NOTA_H * SCALE;
const SLOTS = [140, 380, 620];
const ROW_Y = 860;
const BUDDY = 240;
const BUDDY_X = 920;

export const ForwardScene: React.FC<{ props: WachtkamerProps["forward"]; notas: WachtkamerProps["notas"] }> = ({
  props,
  notas,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const btnIn = pop(frame, fps, FORWARD_T.button, springs.pop);
  const tap = interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 3, FORWARD_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 14], [0, 1], clamp);
  const hop = pop(frame, fps, FORWARD_T.buddy, springs.bouncy);
  const jump = Math.sin(Math.min(1, hop) * Math.PI) * -90;
  const squash = interpolate(frame, [FORWARD_T.buddy - 4, FORWARD_T.buddy, FORWARD_T.buddy + 6, FORWARD_T.buddy + 14], [1, 0.82, 1.12, 1], clamp);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={S - 10} stagger={2} />
      <Stage>
        {/* Forward button */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 150,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, btnIn * 2),
            transform: `scale(${(0.7 + 0.3 * btnIn) * tap})`,
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: p.white,
                color: p.blue,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 48,
                padding: "22px 46px",
                borderRadius: 60,
                boxShadow: "0 20px 50px rgba(0, 10, 80, 0.3)",
              }}
            >
              <svg width={46} height={46} viewBox="0 0 40 40">
                <path d="M24 8l12 11-12 11M36 19H16c-6 0-10 4-10 10v4" fill="none" stroke={p.blue} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {props.button}
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 200,
                height: 200,
                marginLeft: -100,
                marginTop: -100,
                borderRadius: "50%",
                border: `5px solid ${p.white}`,
                opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.9 : 0,
                transform: `scale(${0.3 + ripple * 1.4})`,
              }}
            />
          </div>
        </div>

        {/* The bills queue up in front of Buddy */}
        {notas.map((n, i) => {
          const t = interpolate(frame, [FORWARD_T.slideIn + i * FORWARD_T.slideStagger, FORWARD_T.slideIn + i * FORWARD_T.slideStagger + 12], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.back(1.4)),
          });
          const x = interpolate(t, [0, 1], [-400, SLOTS[i]]);
          const tagIn = pop(frame, fps, FORWARD_T.tag + i * FORWARD_T.tagStagger, springs.bouncy);
          return (
            <div key={i} style={{ position: "absolute", left: x - W / 2, top: ROW_Y - H, width: W, height: H }}>
              <div style={{ transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
                <NotaCard sender={n.sender} subject={n.subject} amount={n.amount} due={n.due} />
              </div>
              <NumberTag
                n={String(i + 1)}
                size={88}
                style={{
                  position: "absolute",
                  left: W / 2 - 44,
                  top: -60,
                  opacity: Math.min(1, tagIn * 2),
                  transform: `scale(${tagIn}) rotate(${(1 - tagIn) * -40}deg)`,
                }}
              />
            </div>
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [S + 4])}
          squash={squash}
          look={{ x: -0.8, y: 0.2 }}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: ROW_Y - BUDDY * BUDDY_RATIO + jump,
          }}
        />
        {/* floor line */}
        <div style={{ position: "absolute", left: 60, right: 60, top: ROW_Y + 6, height: 6, borderRadius: 3, background: p.blueSoft, opacity: 0.35 }} />
      </Stage>
    </SceneBg>
  );
};
