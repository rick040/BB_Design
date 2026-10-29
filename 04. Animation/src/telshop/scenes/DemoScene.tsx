import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Chip, DemoMail, MAILCARD_H, MAILCARD_W, Sparkle, Starburst, Turntable } from "../components/Telshop";
import type { TelshopProps } from "../schema";

// Timeline (frames, scene-local).
export const DEMO_T = {
  mail: 6, // the bill mail pops in
  buddyIn: 14, // Buddy, the presenter, bounces in
  press: 22, // "Doorsturen" is tapped
  forwarded: 26, // ... and turns into "Doorgestuurd · Aan: jij@in.betaalbuddy.nl"
  fly: 38, // the mail moves onto the display turntable
  flyLen: 12,
  tada: 50, // Buddy hops "ta-da", sparkles
  amount: 58, // chip: amount
  due: 66, // chip: due date
  burst: 78, // starburst "Zo simpel!"
  subline: 84,
};

const TT = { x: 160, y: 660, w: 760 };
const CARD_START = { x: 540 - MAILCARD_W / 2, y: 30 };
const CARD_SCALE = 0.88;
// Card stands on the turntable: bottom centre on the disc.
const CARD_END = { x: 540 - MAILCARD_W / 2, y: TT.y + 60 - MAILCARD_H };
const BUDDY = 190;
const BUDDY_X = 950;
const BUDDY_FEET = 900;

export const DemoScene: React.FC<{
  props: TelshopProps["demo"];
  bill: TelshopProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const mailIn = pop(frame, fps, DEMO_T.mail, springs.pop);
  const press = interpolate(frame, [DEMO_T.press, DEMO_T.press + 3, DEMO_T.press + 8], [1, 0.92, 1], clamp);
  const done = interpolate(frame, [DEMO_T.forwarded, DEMO_T.forwarded + 6], [0, 1], clamp);
  const fly = interpolate(frame, [DEMO_T.fly, DEMO_T.fly + DEMO_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const cardX = interpolate(fly, [0, 1], [CARD_START.x, CARD_END.x]);
  const cardY = interpolate(fly, [0, 1], [CARD_START.y, CARD_END.y]) - Math.sin(fly * Math.PI) * 60;
  const cardScale = interpolate(fly, [0, 1], [1, CARD_SCALE]);
  const turn = frame > DEMO_T.fly + DEMO_T.flyLen ? Math.sin((frame - DEMO_T.fly - DEMO_T.flyLen) / 12) * 18 : 0;
  const ttIn = pop(frame, fps, DEMO_T.mail + 4, springs.smooth);

  // Buddy: bounces in, watches the mail, hops "ta-da" when it lands.
  const buddyIn = pop(frame, fps, DEMO_T.buddyIn, springs.bouncy);
  const hopT = frame - DEMO_T.tada;
  const hop = hopT >= 0 && hopT <= 14 ? Math.sin((hopT / 14) * Math.PI) * 120 : 0;
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  if (hopT >= -4 && hopT < 0) squash = interpolate(hopT, [-4, -1], [1, 0.8], clamp);
  else if (hopT >= 0 && hopT <= 14) squash = interpolate(hopT, [0, 3, 12, 14], [0.8, 1.15, 1.05, 0.85], clamp);
  else if (hopT > 14 && hopT <= 20) squash = interpolate(hopT, [14, 20], [0.85, 1], clamp);
  const look =
    frame < DEMO_T.fly
      ? { x: -0.8, y: -0.6 }
      : frame < DEMO_T.amount
        ? { x: -0.9, y: 0.1 }
        : { x: interpolate(frame, [DEMO_T.amount, DEMO_T.due + 6], [-1, 0.2], clamp), y: -0.3 };
  const blink = blinkScale(frame, [DEMO_T.buddyIn + 18, DEMO_T.due + 22]);

  const amount = pop(frame, fps, DEMO_T.amount, springs.bouncy);
  const due = pop(frame, fps, DEMO_T.due, springs.bouncy);
  const burst = pop(frame, fps, DEMO_T.burst, springs.bouncy);
  const sp = (d: number) => (frame - DEMO_T.tada - d) / 16;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={4} stagger={3} />

      <Stage offsetY={-10}>
        <Turntable
          w={TT.w}
          spin={frame * 0.05}
          style={{ left: TT.x, top: TT.y, opacity: ttIn, transform: `scale(${0.8 + 0.2 * ttIn})` }}
        />

        <div
          style={{
            position: "absolute",
            left: cardX,
            top: cardY,
            width: MAILCARD_W,
            height: MAILCARD_H,
            transform: `perspective(1400px) scale(${cardScale * (0.7 + 0.3 * mailIn)}) rotateY(${turn}deg)`,
            transformOrigin: "50% 100%",
            opacity: Math.min(1, mailIn * 2),
          }}
        >
          <DemoMail
            sender={bill.sender}
            subject={bill.subject}
            forward={props.forward}
            forwarded={props.forwarded}
            toLabel={props.toLabel}
            address={props.address}
            done={done}
            press={press}
            style={{ left: 0, top: 0 }}
          />
        </div>

        <Sparkle size={90} t={sp(0)} color={p.yellow} style={{ left: 120, top: 330 }} />
        <Sparkle size={70} t={sp(4)} color={p.white} style={{ left: 880, top: 360 }} />
        <Sparkle size={60} t={sp(8)} color={p.blueSoft} style={{ left: 200, top: 620 }} />

        <Chip text={bill.amount} t={frame >= DEMO_T.amount ? amount : 0} style={{ left: 60, top: 210 }} />
        <Chip text={bill.due} t={frame >= DEMO_T.due ? due : 0} style={{ left: 640, top: 210 }} />

        <Starburst text={props.burst} size={250} t={frame >= DEMO_T.burst ? burst : 0} rotate={-14} style={{ left: 20, top: 300, zIndex: 5 }} />

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO - hop,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={DEMO_T.subline} />
    </SceneBg>
  );
};
