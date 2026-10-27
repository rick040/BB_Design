import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Bulb, MAIL_H, MAIL_W, MailCard, MONSTER_H, MONSTER_W, MonsterShadow, useNight, WallGlow } from "../components/Spook";
import type { SpookProps } from "../schema";

// Timeline (frames, scene-local).
export const PEEK_T = {
  buddyIn: 6, // Buddy pops up, glowing in the dark
  tap: 14, // tap on "Doorsturen"
  fly: 22, // the mail flies to Buddy
  flyLen: 18,
  catch: 40, // Buddy catches it (squash)
  peek: 46, // he looks inside
  blink: 60,
  happy: 74, // "valt mee": happy eyes
  happyLen: 10,
  jump: 86, // jumps for the light cord
  jumpLen: 10,
  pull: 96, // lands, pulls the cord: light on
};

const BUDDY = 240;
const BUDDY_FEET = 800;
const REST_X = 560;
const CORD_X = 820;
const BULB_Y = 30;
const CORD_LEN = 300;
const HANDLE_X = CORD_X + 35.5;
const HANDLE_BOTTOM = BULB_Y + 20 + CORD_LEN + 40;
const MAIL = { x: (1080 - MAIL_W) / 2, y: 110 };
const CATCH = { x: REST_X, y: BUDDY_FEET - 110 };

export const PeekScene: React.FC<{ props: SpookProps["peek"]; mail: SpookProps["mail"] }> = ({ props, mail }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const n = useNight();

  // Mail: tap, then fly into Buddy's arms.
  const press = interpolate(frame, [PEEK_T.tap, PEEK_T.tap + 10], [0, 1], clamp);
  const fly = interpolate(frame, [PEEK_T.fly, PEEK_T.fly + PEEK_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const mailScale = 1 - 0.6 * fly;
  const mailCx = interpolate(fly, [0, 1], [540, CATCH.x]);
  const mailCy = interpolate(fly, [0, 1], [MAIL.y + MAIL_H / 2, CATCH.y]) - Math.sin(fly * Math.PI) * 120;

  // Buddy
  const buddyIn = pop(frame, fps, PEEK_T.buddyIn, springs.bouncy);
  const jt = interpolate(frame, [PEEK_T.jump, PEEK_T.jump + PEEK_T.jumpLen], [0, 1], clamp);
  const bx = interpolate(jt, [0, 1], [REST_X, HANDLE_X], { easing: Easing.inOut(Easing.quad) });
  const hop = Math.sin(jt * Math.PI) * 160;
  let squash = interpolate(buddyIn, [0, 0.6, 1], [1.2, 1.08, 1]);
  squash *= interpolate(frame, [PEEK_T.catch, PEEK_T.catch + 4, PEEK_T.catch + 10], [1, 0.86, 1], clamp);
  squash *= interpolate(frame, [PEEK_T.jump - 6, PEEK_T.jump, PEEK_T.jump + 4], [1, 0.84, 1.12], clamp);
  if (frame >= PEEK_T.jump + 4) {
    squash = interpolate(frame, [PEEK_T.jump + 4, PEEK_T.pull, PEEK_T.pull + 4, PEEK_T.pull + 10], [1.12, 1, 0.82, 1], clamp);
  }
  const happy = frame >= PEEK_T.happy && frame < PEEK_T.happy + PEEK_T.happyLen;
  const blink = happy ? 0.18 : blinkScale(frame, [PEEK_T.blink]);
  const look =
    frame < PEEK_T.peek
      ? { x: interpolate(frame, [PEEK_T.buddyIn, PEEK_T.tap + 4, PEEK_T.fly + 10], [0, -0.6, -0.2], clamp), y: -0.7 }
      : frame < PEEK_T.happy
        ? { x: -0.2, y: 0.9 }
        : frame < PEEK_T.jump - 4
          ? { x: 0, y: 0 }
          : { x: 0.6, y: -0.9 };
  const buddyTop = BUDDY_FEET - BUDDY * BUDDY_RATIO - hop + (1 - buddyIn) * 300;

  // Cord: after the grab, the handle follows Buddy's head down.
  const grabbed = frame >= PEEK_T.jump + PEEK_T.jumpLen / 2;
  const pull = grabbed ? Math.max(0, buddyTop + 14 - HANDLE_BOTTOM) : 0;
  const lit = frame >= PEEK_T.pull ? interpolate(frame, [PEEK_T.pull, PEEK_T.pull + 3], [0.2, 1], clamp) : 0.2;
  const shadowFade = interpolate(frame, [PEEK_T.happy, PEEK_T.happy + 10], [0.75, 0.35], clamp);
  const shadowScale = interpolate(frame, [PEEK_T.happy, PEEK_T.happy + 14], [1, 0.82], { ...clamp, easing: Easing.out(Easing.cubic) });

  // Card in Buddy's arms moves with him a little after the catch, then drops when he jumps.
  const drop = interpolate(frame, [PEEK_T.jump, PEEK_T.jump + 8], [0, 1], clamp);

  return (
    <SceneBg color={n.room}>
      <Stage offsetY={30}>
        <div style={{ position: "absolute", inset: 0, filter: `brightness(${0.75 + 0.5 * lit})` }}>
          <WallGlow x={540} y={500} r={600} on={0.4 + 0.6 * lit} />
          <MonsterShadow
            color={n.shadow}
            teeth={n.wall}
            eyes={1 - drop}
            eyeColor={p.red}
            style={{
              left: 540 - MONSTER_W / 2,
              top: 820 - MONSTER_H,
              opacity: shadowFade,
              transform: `scale(${shadowScale})`,
              transformOrigin: "50% 100%",
              filter: "blur(4px)",
            }}
          />
        </div>

        <Bulb x={CORD_X} y={BULB_Y} on={lit > 0.5 ? 1 : 0} handle cordLen={CORD_LEN} pull={pull} />

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: buddyTop,
            opacity: Math.min(1, buddyIn * 3),
            filter: `drop-shadow(0 0 40px ${p.blueSoft}aa)`,
          }}
        />

        <MailCard
          sender={mail.sender}
          subject={mail.subject}
          preview={mail.preview}
          age={mail.age}
          forward={mail.forward}
          press={press}
          style={{
            left: mailCx - MAIL_W / 2,
            top: mailCy - MAIL_H / 2 + drop * 70,
            transform: `scale(${mailScale}) rotate(${-6 * fly + drop * -10}deg)`,
            transformOrigin: "50% 50%",
            opacity: 1 - drop * 0.4,
          }}
        />
      </Stage>

      <Headline text={props.headline} color={p.white} delay={8} stagger={3} />
      <Subline text={props.subline} color={p.blueSoft} delay={50} />
    </SceneBg>
  );
};
