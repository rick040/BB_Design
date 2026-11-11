import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Subline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Door, Key, SpokenHeadline } from "../components/Props";
import { SCENE_STARTS, type SleutelProps, wordAt, wordStartsFrom } from "../schema";

const S = SCENE_STARTS[1];
// Absolute frames on the spoken words.
export const NEE_T = {
  shake: S, // Buddy shakes his head on "Nee"
  push: wordAt("die") - 2, // Buddy pushes the key back to you
  mailLock: wordAt("zelf"), // mailbox padlock clicks shut
  subline: wordAt("en"), // "En je bank blijft dicht."
  bankLock: wordAt("dicht"), // bank padlock clicks shut
};

const BUDDY = 210;
const FEET = 810;

export const NeeScene: React.FC<{ props: SleutelProps["nee"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const shakeAmt = interpolate(frame, [NEE_T.shake, NEE_T.shake + 4, NEE_T.push - 2, NEE_T.push + 2], [0, 1, 1, 0], clamp);
  const lookX = Math.sin((frame - NEE_T.shake) / 2.2) * shakeAmt;
  const pushSq = interpolate(frame, [NEE_T.push - 4, NEE_T.push, NEE_T.push + 8], [1, 0.84, 1.06], clamp);

  const k = interpolate(frame, [NEE_T.push, NEE_T.mailLock + 2], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const kx = 520 - 420 * k;
  const ky = 470 + 650 * k;
  const ks = 1 + 1.6 * k;

  const mailLock = pop(frame, fps, NEE_T.mailLock, springs.pop);
  const bankLock = pop(frame, fps, NEE_T.bankLock, springs.pop);
  const shM = shake(frame, NEE_T.mailLock, 10, 8);
  const shB = shake(frame, NEE_T.bankLock, 10, 8);
  const headlineAt = wordStartsFrom(S, 5);

  return (
    <SceneBg color={p.blue}>
      <SpokenHeadline text={props.headline} at={headlineAt} color={p.white} secondColor={p.blueSoft} />
      <Stage offsetY={110}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${shM.x}px, ${shM.y}px)` }}>
          <Door
            x={70}
            y={190}
            w={300}
            h={600}
            label={props.mailboxLabel}
            icon="mail"
            door={p.white}
            ink={p.blue}
            lockColor={p.yellow}
            locked={Math.min(1, mailLock)}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${shB.x}px, ${shB.y}px)` }}>
          <Door
            x={710}
            y={190}
            w={300}
            h={600}
            label={props.bankLabel}
            icon="bank"
            door={p.white}
            ink={p.blue}
            lockColor={p.yellow}
            locked={Math.min(1, bankLock)}
          />
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={pushSq}
          blink={frame > NEE_T.bankLock + 4 ? 0.2 : 1}
          look={{ x: frame < NEE_T.push ? lookX : -0.6, y: frame < NEE_T.push ? 0 : 0.5 }}
          style={{ position: "absolute", left: 540 - BUDDY / 2, top: FEET - BUDDY * BUDDY_RATIO }}
        />
        {k < 1 ? (
          <div
            style={{
              position: "absolute",
              left: kx - 50,
              top: ky - 50,
              transform: `rotate(${-10 - 80 * k}deg) scale(${ks})`,
              transformOrigin: "50px 50px",
              opacity: 1 - Math.max(0, k - 0.8) * 5,
            }}
          >
            <Key size={240} color={p.yellow} />
          </div>
        ) : null}
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={NEE_T.subline} />
    </SceneBg>
  );
};
