import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Chip, Door, Key, MailTab } from "../components/Parts";
import { type BrievenbusProps, wordAt } from "../schema";

// Absolute frames; the door swings open on the spoken word "mailbox".
export const HOOK_T = {
  keyIn: 0, // key already near the lock on frame 0
  keyLock: 12, // key in the lock
  keyTurn: 20, // key turns
  open: wordAt("mailbox") - 4, // door swings open
  mails: wordAt("mailbox"), // mails spill out with an eye each
  mailStagger: 3,
  chip: wordAt("mailbox") + 14, // "Alles leesbaar?"
};

const DOOR_W = 380;
const DOOR_H = 680;
const DOOR_X = 540 - DOOR_W / 2;
const DOOR_Y = 110;
const LOCK = { x: DOOR_X + DOOR_W * 0.9, y: DOOR_Y + DOOR_H * 0.555 };
const TARGETS = [
  { x: 200, y: 170, r: -6 },
  { x: 880, y: 260, r: 5 },
  { x: 190, y: 400, r: 4 },
  { x: 890, y: 500, r: -5 },
  { x: 210, y: 630, r: -3 },
];

export const HookScene: React.FC<{ props: BrievenbusProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const slide = interpolate(frame, [HOOK_T.keyIn, HOOK_T.keyLock], [70, 0], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const turnT = interpolate(frame, [HOOK_T.keyTurn, HOOK_T.keyTurn + 8], [0, 1], clamp);
  const turn = 1 - 0.65 * Math.sin(Math.PI * turnT);
  const open = pop(frame, fps, HOOK_T.open, springs.smooth);
  const keyGone = interpolate(frame, [HOOK_T.open, HOOK_T.open + 6], [1, 0], clamp);
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-16} stagger={2} />
      <Stage>
        <Door
          width={DOOR_W}
          height={DOOR_H}
          open={open * 0.85}
          leaf={p.blue}
          style={{ position: "absolute", left: DOOR_X, top: DOOR_Y }}
          inside={
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 50% 55%, ${p.blueMid} 0%, #0b1d6b 70%)`,
                opacity: open,
              }}
            />
          }
        />
        {/* key with label tag */}
        <div
          style={{
            position: "absolute",
            left: LOCK.x - 8 + slide,
            top: LOCK.y - 34,
            opacity: keyGone,
            transform: `scaleY(${turn})`,
            transformOrigin: "0% 50%",
          }}
        >
          <Key size={170} color={p.yellow} style={{ transform: "scaleX(-1)", transformOrigin: "50% 50%" }} />
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 66,
              transform: "rotate(8deg)",
              background: p.ink,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 34,
              padding: "10px 22px",
              borderRadius: 14,
              whiteSpace: "nowrap",
            }}
          >
            {props.keyLabel}
          </div>
        </div>
        {/* mails spill out of the open door */}
        {props.mails.map((m, i) => {
          const s = pop(frame, fps, HOOK_T.mails + i * HOOK_T.mailStagger, springs.bouncy);
          if (s <= 0.001) return null;
          const t = TARGETS[i];
          const x = 540 + (t.x - 540) * s;
          const y = DOOR_Y + DOOR_H * 0.5 + (t.y - DOOR_Y - DOOR_H * 0.5) * s;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 165,
                top: y - 46,
                transform: `rotate(${t.r * s}deg) scale(${0.4 + 0.6 * s})`,
                opacity: Math.min(1, s * 2),
                zIndex: 2 + i,
              }}
            >
              <MailTab label={m} />
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 830,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `scale(${0.5 + 0.5 * chipIn})`,
            zIndex: 10,
          }}
        >
          <Chip text={props.chip} bg={p.ink} fg={p.white} size={46} />
        </div>
      </Stage>
    </SceneBg>
  );
};
