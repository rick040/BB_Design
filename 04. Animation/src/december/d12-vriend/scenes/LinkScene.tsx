import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { SceneBg, Stage } from "../../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import { dec } from "../../theme";
import { Envelope, LinkBubble, SpeechBubble, Zoom } from "../components/Props";
import type { VriendProps } from "../schema";
import { BUDDY_SIZE, FEET_Y, PILE } from "./HookScene";

// Timeline (frames, scene-local).
export const LINK_T = {
  windup: 14, // de linker Buddy buigt door de knieën
  send: 20, // de link vliegt naar rechts
  sendLen: 18, // duur van de vlucht
  read: 44, // de vriend leest, knippert
  reply: 56, // "Top, doe ik!"
  sub: 40,
};

const BUDDY_H = BUDDY_SIZE * BUDDY_RATIO;
const LEFT_X = 90;
const RIGHT_X = 650;

export const LinkScene: React.FC<{ props: VriendProps["link"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const squashL = interpolate(frame, [LINK_T.windup, LINK_T.send - 2, LINK_T.send + 4, LINK_T.send + 10], [1, 0.82, 1.12, 1], clamp);
  const fly = interpolate(frame, [LINK_T.send, LINK_T.send + LINK_T.sendLen], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const landed = pop(frame, fps, LINK_T.send + LINK_T.sendLen - 2, { damping: 10, stiffness: 190 });
  const reply = pop(frame, fps, LINK_T.reply, springs.pop);
  const squashR = interpolate(frame, [LINK_T.reply - 2, LINK_T.reply + 2, LINK_T.reply + 8], [1, 0.86, 1], clamp);
  const bob = frame > LINK_T.send + LINK_T.sendLen ? Math.sin((frame - LINK_T.send - LINK_T.sendLen) / 5) * 3 : 0;

  // De bubbel start bij de linker Buddy en landt boven de rechter.
  const bx = interpolate(fly, [0, 1], [150, 380]);
  const by = interpolate(fly, [0, 1], [380, 60]) - Math.sin(Math.PI * fly) * 90;

  return (
    <SceneBg color={p.blue}>
      <DHeadline text={props.headline} color={dec.white} delay={-6} stagger={3} />
      <Stage offsetY={0}>
        <Zoom k={1.12} dy={-10}>
        <Buddy
          size={BUDDY_SIZE}
          body={dec.white}
          eye={p.blueMascot}
          squash={squashL}
          blink={blinkScale(frame, [8, 70])}
          look={{ x: 0.6, y: -0.2 }}
          style={{ position: "absolute", left: LEFT_X, top: FEET_Y - BUDDY_H }}
        />

        <Buddy
          size={BUDDY_SIZE}
          body={dec.ice}
          eye={p.blueMascot}
          squash={squashR}
          blink={blinkScale(frame, [LINK_T.read, LINK_T.read + 30])}
          look={{ x: -0.7, y: interpolate(frame, [LINK_T.send + 8, LINK_T.send + 20], [0.3, -0.7], clamp) }}
          style={{ position: "absolute", left: RIGHT_X, top: FEET_Y - BUDDY_H }}
        />
        {PILE.map((e, i) => (
          <Envelope
            key={i}
            width={190}
            style={{ position: "absolute", left: e.x - 95, top: e.y - 66, transform: `rotate(${e.r}deg)` }}
          />
        ))}

        {frame >= LINK_T.send ? (
          <LinkBubble
            message={props.message}
            linkText={props.linkText}
            style={{
              position: "absolute",
              left: bx,
              top: by + bob,
              transform: `scale(${0.5 + 0.5 * fly + 0.06 * landed}) rotate(${(1 - fly) * -8}deg)`,
              transformOrigin: "0% 100%",
              opacity: Math.min(1, fly * 4),
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 600,
            top: 268,
            opacity: Math.min(1, reply * 2),
            transform: `scale(${0.6 + 0.4 * reply})`,
            transformOrigin: "70% 100%",
          }}
        >
          <SpeechBubble text={props.reply} tail="right" />
        </div>
        </Zoom>
      </Stage>
      <DSubline text={props.subline} color={p.blueText} delay={LINK_T.sub} />
    </SceneBg>
  );
};
