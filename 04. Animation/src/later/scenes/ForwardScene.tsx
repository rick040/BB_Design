import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W } from "../../components/BillCard";
import { Arrow } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { StickerBill } from "../components/StickerBill";
import { type LaterProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const FORWARD_T = {
  headline: S - 4,
  button: S + 2,
  press: wordAt("door"),
  fly: wordAt("door") + 5,
  gone: SCENE_STARTS[3] + 4,
};

export const ForwardScene: React.FC<{ props: LaterProps["forward"]; bill: LaterProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const cardIn = pop(frame, fps, S - 8, springs.smooth);
  const btnIn = pop(frame, fps, FORWARD_T.button, springs.bouncy);
  const press = interpolate(frame, [FORWARD_T.press - 2, FORWARD_T.press + 2, FORWARD_T.press + 7], [1, 0.88, 1], clamp);
  const fly = interpolate(frame, [FORWARD_T.fly, FORWARD_T.gone], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={FORWARD_T.headline} stagger={2} />
      <Stage offsetY={20}>
        <div
          style={{
            position: "absolute",
            left: 540 - BILL_W / 2 + fly * 700,
            top: 120 + (1 - cardIn) * 120 - fly * 900,
            width: BILL_W,
            height: BILL_H,
            opacity: cardIn,
            transform: `rotate(${fly * 24}deg) scale(${1 - 0.5 * fly})`,
          }}
        >
          <StickerBill bill={bill} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 560,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, btnIn * 2),
            transform: `scale(${(0.6 + 0.4 * btnIn) * press})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              height: 120,
              padding: "0 54px 0 18px",
              borderRadius: 60,
              background: p.white,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 54,
              color: p.blue,
              boxShadow: "0 20px 60px rgba(0, 20, 120, 0.3)",
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: p.blueMid,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Arrow size={44} />
            </div>
            {props.button}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
