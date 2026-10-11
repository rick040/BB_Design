import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SleepMask } from "../../components/SleepMask";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { PrivateMailCard } from "../components/PrivateMailCard";
import type { PrivacyProps } from "../schema";

// Timeline (frames, scene-local).
export const BLIND_T = {
  buddyIn: 8, // Buddy pops up, mask on his head, glances at the mails
  maskDown: 30, // pulls the mask over his eyes; mails go out of focus
  maskLen: 7,
  shake: 42, // "nee": shakes his head
  shakeLen: 26,
  subline: 52,
};

const BUDDY = 320;
const BUDDY_FEET = 665;

// Mails drift around Buddy (stage coordinates, top-left + rotation).
const SLOTS = [
  { x: 30, y: 40, r: -6, from: { x: -520, y: 0 } },
  { x: 585, y: 10, r: 5, from: { x: 620, y: -60 } },
  { x: 20, y: 712, r: 5, from: { x: -540, y: 40 } },
  { x: 595, y: 744, r: -4, from: { x: 560, y: 60 } },
];

export const BlindScene: React.FC<{
  props: PrivacyProps["blind"];
  mails: PrivacyProps["privateMails"];
}> = ({ props, mails }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Focus: soft from the start, fully out of focus once the mask is down.
  const blur = interpolate(frame, [0, BLIND_T.maskDown, BLIND_T.maskDown + 12], [5, 5, 16], clamp);
  const mailOpacity = interpolate(frame, [BLIND_T.maskDown, BLIND_T.maskDown + 12], [0.9, 0.5], clamp);

  // Buddy
  const buddyIn = pop(frame, fps, BLIND_T.buddyIn, springs.bouncy);
  const lift = interpolate(frame, [BLIND_T.maskDown, BLIND_T.maskDown + BLIND_T.maskLen], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  let squash = interpolate(buddyIn, [0, 0.6, 1], [1.2, 1.08, 1]);
  if (frame >= BLIND_T.maskDown) {
    squash = interpolate(
      frame,
      [BLIND_T.maskDown, BLIND_T.maskDown + BLIND_T.maskLen, BLIND_T.maskDown + 11, BLIND_T.maskDown + 16],
      [1, 0.86, 1.05, 1],
      clamp,
    );
  }
  const st = frame - BLIND_T.shake;
  const shakeOn = st >= 0 && st <= BLIND_T.shakeLen;
  const decay = shakeOn ? 1 - st / BLIND_T.shakeLen : 0;
  const shakeX = shakeOn ? Math.sin(st / 2.1) * 16 * decay : 0;
  const shakeR = shakeOn ? Math.sin(st / 2.1) * 5 * decay : 0;
  const idle = frame > BLIND_T.shake + BLIND_T.shakeLen ? Math.sin((frame - BLIND_T.shake - BLIND_T.shakeLen) / 8) * 5 : 0;
  const look = {
    x: interpolate(frame, [BLIND_T.buddyIn + 4, BLIND_T.buddyIn + 9, BLIND_T.maskDown - 8, BLIND_T.maskDown - 2], [0, -0.9, -0.9, 0.9], clamp),
    y: -0.5,
  };

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={8} stagger={3} />

      <Stage>
        {mails.map((m, i) => {
          const s = SLOTS[i];
          const t = pop(frame, fps, i * 3, springs.smooth);
          const drift = Math.sin((frame + i * 20) / 18) * 10;
          return (
            <PrivateMailCard
              key={i}
              from={m.from}
              subject={m.subject}
              style={{
                left: s.x + (1 - t) * s.from.x,
                top: s.y + (1 - t) * s.from.y + drift,
                transform: `rotate(${s.r}deg)`,
                filter: `blur(${blur}px)`,
                opacity: mailOpacity,
              }}
            />
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          look={look}
          accessory={<SleepMask lift={lift} color={p.blueSoft} lineColor={p.blue} />}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2 + shakeX,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + (1 - buddyIn) * 320 + idle,
            opacity: Math.min(1, buddyIn * 3),
            transform: `rotate(${shakeR}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={BLIND_T.subline} />
    </SceneBg>
  );
};
