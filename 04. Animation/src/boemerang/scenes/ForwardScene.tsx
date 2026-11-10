import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Arrow } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Trail } from "../components/Flight";
import { type BoemerangProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[1];
export const FORWARD_T = {
  headline: S - 6,
  tap: wordAt("door"),
  throw: wordAt("door") + 5,
  gone: wordAt("door") + 22,
};

const BUDDY = 210;
const throwPath = (u: number) => ({
  x: 540 + 700 * u,
  y: 300 - 900 * u + 500 * u * u * 0.2,
});

export const ForwardScene: React.FC<{ props: BoemerangProps["forward"]; bill: BoemerangProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const press = interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 3, FORWARD_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 14], [0, 1], clamp);
  const u = interpolate(frame, [FORWARD_T.throw, FORWARD_T.gone], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const pos = throwPath(u);
  const btnFade = interpolate(frame, [FORWARD_T.throw, FORWARD_T.throw + 6], [1, 0], clamp);
  const buddyIn = pop(frame, fps, S - 2, springs.bouncy);
  const look = interpolate(frame, [FORWARD_T.throw, FORWARD_T.gone], [0, 1], clamp);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={FORWARD_T.headline} stagger={2} />
      <Stage>
        <Trail at={throwPath} u={u} length={0.35} color={p.blueSoft} dot={22} />
        <div
          style={{
            position: "absolute",
            left: pos.x - BILL_W / 2,
            top: pos.y - BILL_H / 2,
            width: BILL_W,
            height: BILL_H,
            transform: `rotate(${-900 * u}deg) scale(${0.92 - 0.5 * u})`,
          }}
        >
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 500,
            display: "flex",
            justifyContent: "center",
            opacity: btnFade,
          }}
        >
          <div style={{ position: "relative", transform: `scale(${press})` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: p.white,
                color: p.blue,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 46,
                padding: "22px 44px",
                borderRadius: 60,
                boxShadow: "0 20px 60px rgba(0, 20, 120, 0.3)",
              }}
            >
              {props.button}
              <Arrow size={40} color={p.blue} />
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
                border: `6px solid ${p.white}`,
                opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0,
                transform: `scale(${0.3 + ripple * 1.3})`,
              }}
            />
          </div>
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [FORWARD_T.tap - 6])}
          look={{ x: 0.2 + 0.7 * look, y: -0.3 - 0.6 * look }}
          squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1])}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: 880 - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
      </Stage>
    </SceneBg>
  );
};
